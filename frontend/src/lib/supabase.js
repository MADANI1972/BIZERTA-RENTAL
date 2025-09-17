// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// REMPLACEZ CES VALEURS PAR VOS VRAIES CLÉS SUPABASE
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL' // Exemple: https://abcdefghijk.supabase.co
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY' // Votre clé publique très longue

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service d'authentification
export const authService = {
  // Inscription
  async signUp(email, password, firstName, lastName, phone) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone
        }
      }
    })
    return { data, error }
  },

  // Connexion
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Déconnexion
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Obtenir l'utilisateur actuel
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Obtenir le profil complet
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Mettre à jour le profil
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
    return { data, error }
  }
}

// Service des propriétés
export const propertyService = {
  // Obtenir toutes les propriétés
  async getProperties(filters = {}) {
    let query = supabase
      .from('properties')
      .select(`
        *,
        profiles:host_id (first_name, last_name, phone),
        property_images (image_url, is_main)
      `)
      .eq('status', 'active')

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice)
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice)
    }
    if (filters.guests) {
      query = query.gte('guests', filters.guests)
    }
    if (filters.bedrooms) {
      query = query.gte('bedrooms', filters.bedrooms)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    return { data, error }
  },

  // Obtenir une propriété par ID
  async getProperty(id) {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        profiles:host_id (first_name, last_name, phone, avatar_url),
        property_images (image_url, is_main),
        reviews (rating, comment, created_at, profiles:user_id (first_name, last_name))
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single()
    return { data, error }
  },

  // Ajouter une nouvelle propriété
  async createProperty(propertyData) {
    const user = await authService.getCurrentUser()
    if (!user) throw new Error('Utilisateur non connecté')

    const { data, error } = await supabase
      .from('properties')
      .insert([{ ...propertyData, host_id: user.id }])
      .select()
      .single()
    return { data, error }
  },

  // Upload d'images depuis PC (FICHIER LOCAL)
  async uploadPropertyImage(propertyId, file) {
    const user = await authService.getCurrentUser()
    if (!user) throw new Error('Utilisateur non connecté')

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      throw new Error('Seules les images sont autorisées')
    }

    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('La taille du fichier ne peut pas dépasser 5MB')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${propertyId}/${Date.now()}.${fileExt}`

    // Upload du fichier vers Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Erreur upload:', uploadError)
      throw new Error('Erreur lors de l\'upload de l\'image')
    }

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName)

    // Sauvegarder l'URL en base de données
    const { data, error } = await supabase
      .from('property_images')
      .insert([{
        property_id: propertyId,
        image_url: publicUrl,
        is_main: false // Le premier sera défini comme principale manuellement
      }])
      .select()
      .single()

    if (error) {
      console.error('Erreur sauvegarde DB:', error)
      throw new Error('Erreur lors de la sauvegarde en base')
    }

    return { data: { ...data, public_url: publicUrl }, error: null }
  },

  // Upload multiple d'images
  async uploadMultipleImages(propertyId, files) {
    const results = []
    const errors = []

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.uploadPropertyImage(propertyId, files[i])
        results.push(result.data)
        
        // Définir la première image comme principale
        if (i === 0) {
          await supabase
            .from('property_images')
            .update({ is_main: true })
            .eq('id', result.data.id)
        }
      } catch (error) {
        errors.push({ file: files[i].name, error: error.message })
      }
    }

    return { results, errors }
  },

  // Obtenir les propriétés d'un hôte
  async getHostProperties(hostId) {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (image_url, is_main),
        bookings (id, status, check_in, check_out)
      `)
      .eq('host_id', hostId)
      .order('created_at', { ascending: false })
    return { data, error }
  }
}

// Service des réservations
export const bookingService = {
  // Créer une réservation
  async createBooking(bookingData) {
    const user = await authService.getCurrentUser()
    if (!user) throw new Error('Utilisateur non connecté')

    // Vérifier la disponibilité
    const { data: available } = await supabase
      .rpc('check_property_availability', {
        prop_id: bookingData.property_id,
        check_in_date: bookingData.check_in,
        check_out_date: bookingData.check_out
      })

    if (!available) {
      return { data: null, error: { message: 'Ces dates ne sont pas disponibles' } }
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([{ ...bookingData, user_id: user.id }])
      .select(`
        *,
        properties (title, location, price),
        profiles:user_id (first_name, last_name)
      `)
      .single()
    return { data, error }
  },

  // Obtenir les réservations de l'utilisateur
  async getUserBookings(userId) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        properties (title, location, property_images (image_url, is_main))
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Obtenir les réservations pour les propriétés d'un hôte
  async getHostBookings(hostId) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        properties!inner (title, location, host_id),
        profiles:user_id (first_name, last_name, phone)
      `)
      .eq('properties.host_id', hostId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Mettre à jour le statut d'une réservation
  async updateBookingStatus(bookingId, status) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single()
    return { data, error }
  }
}

// Service admin
export const adminService = {
  // Vérifier si l'utilisateur est admin
  async isAdmin() {
    const user = await authService.getCurrentUser()
    if (!user) return false

    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    return data?.role === 'admin'
  },

  // Obtenir toutes les propriétés (admin)
  async getAllProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        profiles:host_id (first_name, last_name, email, phone),
        property_images (image_url)
      `)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Mettre à jour le statut d'une propriété
  async updatePropertyStatus(propertyId, status) {
    const { data, error } = await supabase
      .from('properties')
      .update({ status })
      .eq('id', propertyId)
      .select()
      .single()
    return { data, error }
  },

  // Obtenir toutes les réservations
  async getAllBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        properties (title, location),
        profiles:user_id (first_name, last_name, email)
      `)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Obtenir les statistiques
  async getStats() {
    const { data, error } = await supabase
      .from('admin_stats')
      .select('*')
      .single()
    return { data, error }
  },

  // Obtenir tous les utilisateurs
  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  }
}

// Service de messagerie
export const messageService = {
  // Envoyer un message
  async sendMessage(receiverId, subject, message, propertyId = null, bookingId = null) {
    const user = await authService.getCurrentUser()
    if (!user) throw new Error('Utilisateur non connecté')

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        sender_id: user.id,
        receiver_id: receiverId,
        subject,
        message,
        property_id: propertyId,
        booking_id: bookingId
      }])
      .select(`
        *,
        sender:sender_id (first_name, last_name),
        receiver:receiver_id (first_name, last_name)
      `)
      .single()
    return { data, error }
  },

  // Obtenir les messages d'un utilisateur
  async getUserMessages(userId) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (first_name, last_name),
        receiver:receiver_id (first_name, last_name),
        properties (title),
        bookings (check_in, check_out)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Marquer un message comme lu
  async markAsRead(messageId) {
    const { data, error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)
      .select()
      .single()
    return { data, error }
  }
}

// Service d'avis
export const reviewService = {
  // Créer un avis
  async createReview(bookingId, propertyId, rating, comment) {
    const user = await authService.getCurrentUser()
    if (!user) throw new Error('Utilisateur non connecté')

    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        booking_id: bookingId,
        user_id: user.id,
        property_id: propertyId,
        rating,
        comment
      }])
      .select(`
        *,
        profiles:user_id (first_name, last_name)
      `)
      .single()
    
    // Mettre à jour la note moyenne de la propriété
    if (!error) {
      await this.updatePropertyRating(propertyId)
    }
    
    return { data, error }
  },

  // Mettre à jour la note moyenne d'une propriété
  async updatePropertyRating(propertyId) {
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('property_id', propertyId)

    if (reviews && reviews.length > 0) {
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      const reviewCount = reviews.length

      await supabase
        .from('properties')
        .update({ 
          rating: Math.round(avgRating * 10) / 10,
          review_count: reviewCount
        })
        .eq('id', propertyId)
    }
  },

  // Obtenir les avis d'une propriété
  async getPropertyReviews(propertyId) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (first_name, last_name)
      `)
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false })
    return { data, error }
  }
}
