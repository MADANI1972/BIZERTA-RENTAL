import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://pxgeckzjsavfzzrwztcd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4Z2Vja3pqc2F2Znp6cnd6dGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MDg5NTEsImV4cCI6MjA3MzI4NDk1MX0.DM3tOiRRMX0pYQa6bxiSqOdH6e6PSPqSzAj8BE3hbco';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ========================================
// AUTHENTIFICATION
// ========================================

export const authService = {
  // Inscription
  signUp: async (email, password, userData) => {
    try {
      // 1. Créer l'utilisateur dans auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) throw authError;

      // 2. Créer le profil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          email: email,
          first_name: userData.firstName || '',
          last_name: userData.lastName || '',
          phone: userData.phone || '',
          role: userData.role || 'user'
        }])
        .select()
        .single();

      if (profileError) throw profileError;

      return { 
        user: { ...authData.user, ...profileData }, 
        error: null 
      };
    } catch (error) {
      console.error('Erreur inscription:', error);
      return { user: null, error };
    }
  },

  // Connexion
  signIn: async (email, password) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      // Récupérer le profil complet
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      return { 
        user: { ...authData.user, ...profile }, 
        error: null 
      };
    } catch (error) {
      console.error('Erreur connexion:', error);
      return { user: null, error };
    }
  },

  // Déconnexion
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      return { error };
    }
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { user: null, error: null };

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return { 
        user: { ...user, ...profile }, 
        error: null 
      };
    } catch (error) {
      console.error('Erreur get user:', error);
      return { user: null, error };
    }
  }
};

// ========================================
// PROPRIÉTÉS
// ========================================

export const propertyService = {
  // Obtenir toutes les propriétés actives
  getAll: async (filters = {}) => {
    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          property_images (
            id,
            image_url,
            is_main
          ),
          profiles!properties_host_id_fkey (
            id,
            first_name,
            last_name,
            phone,
            email
          )
        `)
        .eq('status', 'active');

      // Filtres optionnels
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.guests) {
        query = query.gte('guests', filters.guests);
      }
      if (filters.bedrooms) {
        query = query.gte('bedrooms', filters.bedrooms);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Transformer les données pour correspondre au format de l'app
      const properties = data.map(prop => ({
        id: prop.id,
        title: prop.title,
        description: prop.description,
        location: prop.location,
        price: parseFloat(prop.price),
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        guests: prop.guests,
        type: prop.property_type,
        amenities: prop.amenities || [],
        images: prop.property_images?.map(img => img.image_url) || [],
        owner: {
          id: prop.profiles?.id,
          name: `${prop.profiles?.first_name} ${prop.profiles?.last_name}`,
          phone: prop.profiles?.phone,
          email: prop.profiles?.email
        },
        rating: 0, // À calculer depuis reviews
        reviews: 0, // À calculer depuis reviews
        features: []
      }));

      return { properties, error: null };
    } catch (error) {
      console.error('Erreur get properties:', error);
      return { properties: [], error };
    }
  },

  // Obtenir une propriété par ID
  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (
            id,
            image_url,
            is_main
          ),
          profiles!properties_host_id_fkey (
            id,
            first_name,
            last_name,
            phone,
            email
          ),
          reviews (
            id,
            rating,
            comment,
            created_at,
            profiles!reviews_user_id_fkey (
              first_name,
              last_name
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Calculer la note moyenne
      const avgRating = data.reviews?.length > 0
        ? data.reviews.reduce((acc, r) => acc + r.rating, 0) / data.reviews.length
        : 0;

      const property = {
        id: data.id,
        title: data.title,
        description: data.description,
        location: data.location,
        price: parseFloat(data.price),
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        guests: data.guests,
        type: data.property_type,
        amenities: data.amenities || [],
        images: data.property_images?.map(img => img.image_url) || [],
        owner: {
          id: data.profiles?.id,
          name: `${data.profiles?.first_name} ${data.profiles?.last_name}`,
          phone: data.profiles?.phone,
          email: data.profiles?.email
        },
        rating: avgRating,
        reviews: data.reviews?.length || 0,
        features: []
      };

      return { property, error: null };
    } catch (error) {
      console.error('Erreur get property:', error);
      return { property: null, error };
    }
  },

  // Créer une nouvelle propriété
  create: async (propertyData, userId) => {
    try {
      // 1. Créer la propriété
      const { data: property, error: propError } = await supabase
        .from('properties')
        .insert([{
          title: propertyData.title,
          description: propertyData.description,
          location: propertyData.location,
          property_type: propertyData.type,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          guests: propertyData.guests,
          price: propertyData.price,
          amenities: propertyData.amenities,
          host_id: userId,
          status: 'pending' // En attente de validation admin
        }])
        .select()
        .single();

      if (propError) throw propError;

      // 2. Ajouter les images
      if (propertyData.images && propertyData.images.length > 0) {
        const images = propertyData.images.map((url, index) => ({
          property_id: property.id,
          image_url: url,
          is_main: index === 0
        }));

        const { error: imgError } = await supabase
          .from('property_images')
          .insert(images);

        if (imgError) throw imgError;
      }

      return { property, error: null };
    } catch (error) {
      console.error('Erreur create property:', error);
      return { property: null, error };
    }
  },

  // Mettre à jour une propriété
  update: async (propertyId, updates) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', propertyId)
        .select()
        .single();

      if (error) throw error;
      return { property: data, error: null };
    } catch (error) {
      console.error('Erreur update property:', error);
      return { property: null, error };
    }
  },

  // Supprimer une propriété
  delete: async (propertyId) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Erreur delete property:', error);
      return { error };
    }
  },

  // Upload d'image vers Supabase Storage
  uploadImage: async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `properties/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error('Erreur upload image:', error);
      return { url: null, error };
    }
  }
};

// ========================================
// RÉSERVATIONS
// ========================================

export const bookingService = {
  // Créer une réservation
  create: async (bookingData) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          property_id: bookingData.propertyId,
          user_id: bookingData.userId,
          check_in: bookingData.checkIn,
          check_out: bookingData.checkOut,
          guests: bookingData.guests,
          total_amount: bookingData.totalAmount,
          message: bookingData.message || '',
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      return { booking: data, error: null };
    } catch (error) {
      console.error('Erreur create booking:', error);
      return { booking: null, error };
    }
  },

  // Obtenir les réservations d'un utilisateur
  getByUser: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          properties (
            id,
            title,
            location,
            price,
            property_images (
              image_url,
              is_main
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { bookings: data, error: null };
    } catch (error) {
      console.error('Erreur get bookings:', error);
      return { bookings: [], error };
    }
  },

  // Obtenir les réservations d'une propriété
  getByProperty: async (propertyId) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles!bookings_user_id_fkey (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { bookings: data, error: null };
    } catch (error) {
      console.error('Erreur get property bookings:', error);
      return { bookings: [], error };
    }
  },

  // Mettre à jour le statut d'une réservation
  updateStatus: async (bookingId, status) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return { booking: data, error: null };
    } catch (error) {
      console.error('Erreur update booking:', error);
      return { booking: null, error };
    }
  }
};

// ========================================
// AVIS / REVIEWS
// ========================================

export const reviewService = {
  // Créer un avis
  create: async (reviewData) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          property_id: reviewData.propertyId,
          user_id: reviewData.userId,
          booking_id: reviewData.bookingId,
          rating: reviewData.rating,
          comment: reviewData.comment
        }])
        .select()
        .single();

      if (error) throw error;
      return { review: data, error: null };
    } catch (error) {
      console.error('Erreur create review:', error);
      return { review: null, error };
    }
  },

  // Obtenir les avis d'une propriété
  getByProperty: async (propertyId) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles!reviews_user_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { reviews: data, error: null };
    } catch (error) {
      console.error('Erreur get reviews:', error);
      return { reviews: [], error };
    }
  }
};

// ========================================
// ADMIN
// ========================================

export const adminService = {
  // Obtenir les statistiques
  getStats: async () => {
    try {
      const { data, error } = await supabase
        .from('admin_stats')
        .select('*')
        .single();

      if (error) throw error;
      return { stats: data, error: null };
    } catch (error) {
      console.error('Erreur get stats:', error);
      return { stats: null, error };
    }
  },

  // Obtenir toutes les propriétés (admin)
  getAllProperties: async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles!properties_host_id_fkey (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { properties: data, error: null };
    } catch (error) {
      console.error('Erreur get all properties:', error);
      return { properties: [], error };
    }
  },

  // Approuver/rejeter une propriété
  updatePropertyStatus: async (propertyId, status) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update({ status })
        .eq('id', propertyId)
        .select()
        .single();

      if (error) throw error;
      return { property: data, error: null };
    } catch (error) {
      console.error('Erreur update property status:', error);
      return { property: null, error };
    }
  },

  // Obtenir tous les utilisateurs
  getAllUsers: async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { users: data, error: null };
    } catch (error) {
      console.error('Erreur get users:', error);
      return { users: [], error };
    }
  }
};

export default {
  auth: authService,
  property: propertyService,
  booking: bookingService,
  review: reviewService,
  admin: adminService
};
