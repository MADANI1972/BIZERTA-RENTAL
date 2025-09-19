const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://pxgeckzjsavfzzrwztcd.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4Z2Vja3pqc2F2Znp6cnd6dGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzcwODk1MSwiZXhwIjoyMDczMjg0OTUxfQ.obRhlzvCnc0FpTl3I_Lt5ZvdkKkVc2A91mOscpKokDI';
const supabase = createClient(supabaseUrl, supabaseKey);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'bizerta_rental_secret_2024';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuration Multer pour upload photos local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads', 'properties');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 10 // Max 10 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées!'), false);
    }
  }
});

// Middleware d'authentification
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requis' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { data: user } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (!user) {
      return res.status(403).json({ error: 'Utilisateur non trouvé' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};

// ==================== ROUTES AUTH ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role = 'user' } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Créer utilisateur dans Auth Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      console.error('Erreur auth:', authError);
      return res.status(400).json({ error: authError.message });
    }

    // Créer profil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        role
      }])
      .select()
      .single();

    if (profileError) {
      console.error('Erreur profil:', profileError);
      return res.status(400).json({ error: 'Erreur création profil' });
    }

    // Générer JWT
    const token = jwt.sign({ userId: authData.user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: profile
    });

  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Connexion avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Erreur login:', authError);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Récupérer le profil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Erreur profil:', profileError);
      return res.status(400).json({ error: 'Profil non trouvé' });
    }

    // Générer JWT
    const token = jwt.sign({ userId: authData.user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Connexion réussie',
      token,
      user: profile
    });

  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ==================== ROUTES PROPRIÉTÉS ====================

// Obtenir toutes les propriétés
app.get('/api/properties', async (req, res) => {
  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (image_url, is_main),
        profiles:host_id (first_name, last_name, avatar_url)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur properties:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json(properties || []);
  } catch (error) {
    console.error('Erreur get properties:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir une propriété par ID
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: property, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (image_url, is_main),
        profiles:host_id (first_name, last_name, avatar_url, phone)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Propriété non trouvée' });
    }

    res.json(property);
  } catch (error) {
    console.error('Erreur get property:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer une propriété
app.post('/api/properties', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    const {
      title, description, location, property_type,
      bedrooms, bathrooms, guests, price, surface,
      amenities
    } = req.body;

    // Validation
    if (!title || !description || !location || !price) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    // Créer la propriété
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .insert([{
        title,
        description,
        location,
        property_type,
        bedrooms: parseInt(bedrooms) || 1,
        bathrooms: parseInt(bathrooms) || 1,
        guests: parseInt(guests) || 1,
        price: parseFloat(price),
        surface: surface ? parseFloat(surface) : null,
        amenities: amenities ? JSON.parse(amenities) : [],
        host_id: req.user.id,
        status: 'pending'
      }])
      .select()
      .single();

    if (propertyError) {
      console.error('Erreur property:', propertyError);
      return res.status(400).json({ error: 'Erreur création propriété' });
    }

    // Sauvegarder les images locales
    const imagePromises = req.files.map(async (file, index) => {
      const imageUrl = `/uploads/properties/${file.filename}`;
      
      const { data: image, error: imageError } = await supabase
        .from('property_images')
        .insert([{
          property_id: property.id,
          image_url: imageUrl,
          is_main: index === 0
        }])
        .select()
        .single();

      if (imageError) {
        console.error('Erreur image:', imageError);
      }
      
      return image;
    });

    const images = await Promise.all(imagePromises);

    res.status(201).json({
      message: 'Propriété créée avec succès',
      property: {
        ...property,
        property_images: images.filter(img => img)
      }
    });

  } catch (error) {
    console.error('Erreur create property:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les propriétés de l'utilisateur
app.get('/api/user/properties', authenticateToken, async (req, res) => {
  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (image_url, is_main)
      `)
      .eq('host_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur user properties:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json(properties || []);
  } catch (error) {
    console.error('Erreur get user properties:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ==================== ROUTES RÉSERVATIONS ====================

// Créer une réservation
app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { property_id, check_in, check_out, guests, total_amount, message } = req.body;

    if (!property_id || !check_in || !check_out || !total_amount) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    // Vérifier disponibilité
    const { data: existingBookings, error: checkError } = await supabase
      .from('bookings')
      .select('*')
      .eq('property_id', property_id)
      .in('status', ['confirmed', 'pending'])
      .or(`and(check_in.lte.${check_out},check_out.gte.${check_in})`);

    if (checkError) {
      console.error('Erreur check availability:', checkError);
      return res.status(400).json({ error: 'Erreur vérification disponibilité' });
    }

    if (existingBookings && existingBookings.length > 0) {
      return res.status(400).json({ error: 'Ces dates ne sont pas disponibles' });
    }

    // Créer la réservation
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        property_id,
        user_id: req.user.id,
        check_in,
        check_out,
        guests: parseInt(guests) || 1,
        total_amount: parseFloat(total_amount),
        message,
        status: 'pending'
      }])
      .select()
      .single();

    if (bookingError) {
      console.error('Erreur booking:', bookingError);
      return res.status(400).json({ error: 'Erreur création réservation' });
    }

    res.status(201).json({
      message: 'Réservation créée avec succès',
      booking
    });

  } catch (error) {
    console.error('Erreur create booking:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les réservations de l'utilisateur
app.get('/api/user/bookings', authenticateToken, async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        properties (title, location, property_images (image_url, is_main))
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur user bookings:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json(bookings || []);
  } catch (error) {
    console.error('Erreur get user bookings:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ==================== ROUTES ADMIN ====================

// Obtenir les statistiques admin
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    // Statistiques des propriétés
    const { data: propertiesStats } = await supabase
      .from('properties')
      .select('status');

    const { data: bookingsStats } = await supabase
      .from('bookings')
      .select('status');

    const { data: usersStats } = await supabase
      .from('profiles')
      .select('role');

    const stats = {
      totalProperties: propertiesStats?.length || 0,
      activeProperties: propertiesStats?.filter(p => p.status === 'active').length || 0,
      pendingProperties: propertiesStats?.filter(p => p.status === 'pending').length || 0,
      totalBookings: bookingsStats?.length || 0,
      confirmedBookings: bookingsStats?.filter(b => b.status === 'confirmed').length || 0,
      totalUsers: usersStats?.filter(u => u.role === 'user').length || 0,
      totalHosts: usersStats?.filter(u => u.role === 'host').length || 0
    };

    res.json(stats);
  } catch (error) {
    console.error('Erreur admin stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Approuver/Rejeter une propriété
app.put('/api/admin/properties/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const { data, error } = await supabase
      .from('properties')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur update status:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: `Propriété ${status === 'active' ? 'approuvée' : 'rejetée'} avec succès`,
      property: data
    });

  } catch (error) {
    console.error('Erreur admin update:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ==================== ROUTES GÉNÉRALES ====================

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Bizerta Rental API is running!', 
    timestamp: new Date().toISOString(),
    supabase: !!supabase ? 'Connected' : 'Disconnected'
  });
});

// Gestion des erreurs
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Fichier trop volumineux (max 5MB)' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Trop de fichiers (max 10)' });
    }
  }
  
  console.error('Erreur:', error);
  res.status(500).json({ error: error.message || 'Erreur serveur' });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}/api`);
  console.log(`🗄️  Uploads disponibles sur http://localhost:${PORT}/uploads`);
});

module.exports = app;
