import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Calendar, Users, Camera, Upload, Edit, Trash2, Eye, Shield, BarChart3, Home, Plus, Filter, Heart, Share2, Phone, Mail, Wifi, Car, Bath, Bed, Wind, Tv, ChefHat, Waves, Mountain, Building, TreePine } from 'lucide-react';

// Configuration Supabase
const supabaseUrl = 'https://pxgeckzjsavfzzrwztcd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4Z2Vja3pqc2F2Znp6cnd6dGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MDg5NTEsImV4cCI6MjA3MzI4NDk1MX0.DM3tOiRRMX0pYQa6bxiSqOdH6e6PSPqSzAj8BE3hbco';

// Services Supabase simplifiés
const supabaseAuth = {
  signUp: async (email, password, userData) => {
    console.log('Inscription:', email, userData);
    return { user: { id: Date.now(), email, ...userData }, error: null };
  },
  signIn: async (email, password) => {
    console.log('Connexion:', email);
    return { user: { id: 1, email, role: 'host' }, error: null };
  },
  signOut: async () => {
    console.log('Déconnexion');
    return { error: null };
  }
};

const App = () => {
  // États principaux avec détection de page basée sur l'URL
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname;
    if (path === '/login') return 'login';
    if (path === '/register') return 'register';
    if (path === '/host') return 'host';
    if (path === '/dashboard') return 'dashboard';
    if (path === '/admin') return 'admin';
    if (path === '/properties') return 'properties';
    if (path.startsWith('/property/')) return 'property';
    return 'home';
  });
  
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "Villa Vue Mer - Corniche Bizerte",
      location: "Corniche de Bizerte",
      price: 300,
      rating: 4.8,
      reviews: 24,
      images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400", "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400"],
      amenities: ['wifi', 'parking', 'air_conditioning', 'tv', 'kitchen'],
      bedrooms: 3,
      bathrooms: 2,
      guests: 6,
      type: 'villa',
      neighborhood: 'corniche',
      owner: { id: 1, name: "Ahmed Ben Ali", phone: "+216 20 123 456" },
      description: "Magnifique villa avec vue panoramique sur la mer Méditerranée. Située sur la corniche de Bizerte, cette propriété offre un cadre idyllique pour vos vacances.",
      features: ["Vue mer", "Jardin privé", "Terrasse", "Climatisation", "WiFi gratuit"]
    },
    {
      id: 2,
      title: "Villa Prestige Bizerte",
      location: "Hammamet",
      price: 450,
      rating: 5.0,
      reviews: 12,
      images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400", "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400"],
      amenities: ['wifi', 'air_conditioning', 'kitchen', 'parking'],
      bedrooms: 4,
      bathrooms: 3,
      guests: 8,
      type: 'villa',
      neighborhood: 'lac',
      owner: { id: 2, name: "Fatma Trabelsi", phone: "+216 25 987 654" },
      description: "Villa de prestige avec piscine privée et architecture moderne. Parfaite pour des vacances luxueuses en famille.",
      features: ["Piscine privée", "Architecture moderne", "Vue lac", "Jardin paysager", "Terrasse panoramique"]
    },
    {
      id: 3,
      title: "Sunset Villa - Sauna & Spa",
      location: "Sousse",
      price: 580,
      rating: 4.8,
      reviews: 18,
      images: ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"],
      amenities: ['wifi', 'air_conditioning', 'kitchen', 'parking'],
      bedrooms: 5,
      bathrooms: 4,
      guests: 10,
      type: 'villa',
      neighborhood: 'corniche',
      owner: { id: 3, name: "Karim Mansouri", phone: "+216 22 456 789" },
      description: "Villa de luxe avec sauna et spa privé. Vue imprenable sur le coucher de soleil. Idéale pour une retraite relaxante.",
      features: ["Sauna privé", "Spa", "Vue coucher de soleil", "Piscine à débordement", "Terrasse zen"]
    }
  ]);
  
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: '',
    location: '',
    price: '',
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    type: 'apartment',
    neighborhood: 'corniche',
    description: '',
    amenities: [],
    images: []
  });

  const neighborhoods = [
    { id: 'corniche', name: 'Corniche', icon: Waves, description: 'Front de mer avec vue panoramique' },
    { id: 'medina', name: 'Médina', icon: Building, description: 'Centre historique authentique' },
    { id: 'lac', name: 'Lac de Bizerte', icon: Mountain, description: 'Tranquillité au bord du lac' },
    { id: 'port', name: 'Port de plaisance', icon: TreePine, description: 'Animation portuaire' }
  ];

  const amenityIcons = {
    wifi: Wifi,
    parking: Car,
    air_conditioning: Wind,
    tv: Tv,
    kitchen: ChefHat
  };

  // Categories data
  const categories = [
    { id: 'chalet', name: 'Chalet', icon: Home, color: 'bg-green-100 text-green-600' },
    { id: 'pieds_eau', name: 'Pieds dans l\'eau', icon: Waves, color: 'bg-blue-100 text-blue-600' },
    { id: 'budget', name: 'Petit budget', icon: '💰', color: 'bg-orange-100 text-orange-600' },
    { id: 'luxe', name: 'Luxe', icon: Star, color: 'bg-purple-100 text-purple-600' },
    { id: 'couple', name: 'Couple', icon: Heart, color: 'bg-pink-100 text-pink-600' },
    { id: 'nature', name: 'Nature', icon: TreePine, color: 'bg-green-100 text-green-600' },
    { id: 'capacite', name: 'Grande capacité', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { id: 'appartement', name: 'Appartement', icon: Building, color: 'bg-gray-100 text-gray-600' }
  ];

  // Fonction pour naviguer avec mise à jour de l'URL
  const navigateTo = (page) => {
    setCurrentPage(page);
    window.history.pushState({}, '', `/${page === 'home' ? '' : page}`);
  };

  // Écouter les changements d'URL (bouton précédent/suivant du navigateur)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/login') setCurrentPage('login');
      else if (path === '/register') setCurrentPage('register');
      else if (path === '/host') setCurrentPage('host');
      else if (path === '/dashboard') setCurrentPage('dashboard');
      else if (path === '/admin') setCurrentPage('admin');
      else if (path === '/properties') setCurrentPage('properties');
      else if (path.startsWith('/property/')) setCurrentPage('property');
      else setCurrentPage('home');
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-white shadow-sm fixed top-0 w-full z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div 
              onClick={() => navigateTo('home')}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Bizerta Location</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigateTo('home')}
              className={`${currentPage === 'home' ? 'text-teal-600 font-medium' : 'text-gray-700'} hover:text-teal-600 transition-colors`}
            >
              Accueil
            </button>
            <button 
              onClick={() => navigateTo('properties')}
              className={`${currentPage === 'properties' ? 'text-teal-600 font-medium' : 'text-gray-700'} hover:text-teal-600 transition-colors`}
            >
              Propriétés
            </button>
            <button 
              onClick={() => navigateTo('about')}
              className={`${currentPage === 'about' ? 'text-teal-600 font-medium' : 'text-gray-700'} hover:text-teal-600 transition-colors`}
            >
              À propos
            </button>
            <button 
              onClick={() => navigateTo('contact')}
              className={`${currentPage === 'contact' ? 'text-teal-600 font-medium' : 'text-gray-700'} hover:text-teal-600 transition-colors`}
            >
              Contact
            </button>
            {user && (
              <>
                <button 
                  onClick={() => navigateTo('host')}
                  className={`${currentPage === 'host' ? 'text-teal-600 font-medium' : 'text-gray-700'} hover:text-teal-600 transition-colors`}
                >
                  Devenir Hôte
                </button>
                <button 
                  onClick={() => navigateTo('dashboard')}
                  className={`${currentPage === 'dashboard' ? 'text-teal-600 font-medium' : 'text-gray-700'} hover:text-teal-600 transition-colors`}
                >
                  Mon Compte
                </button>
                {user.role === 'admin' && (
                  <button 
                    onClick={() => navigateTo('admin')}
                    className={`${currentPage === 'admin' ? 'text-teal-600 font-medium' : 'text-gray-700'} hover:text-teal-600 transition-colors`}
                  >
                    Admin
                  </button>
                )}
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Bonjour, {user.email}</span>
                <button 
                  onClick={() => { setUser(null); navigateTo('home'); }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Se déconnecter
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => navigateTo('login')}
                  className="text-gray-700 hover:text-teal-600 transition-colors"
                >
                  Se connecter
                </button>
                <button 
                  onClick={() => navigateTo('register')}
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                >
                  S'inscrire
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  // Home Page Component
  const HomePage = () => (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-br from-teal-400 to-teal-600 py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Search Form */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Emplacement</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-gray-700">
                    <option>Choisir le lieu</option>
                    {neighborhoods.map(n => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Arrivée</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="jj/mm/aaaa"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Départ</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="jj/mm/aaaa"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Invités</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-gray-700">
                    <option>1 invité</option>
                    <option>2 invités</option>
                    <option>4 invités</option>
                    <option>6 invités</option>
                    <option>8+ invités</option>
                  </select>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-teal-500 text-white py-4 rounded-lg hover:bg-teal-600 font-semibold text-lg transition-colors flex items-center justify-center">
              <Search className="h-5 w-5 mr-2" />
              Rechercher
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {categories.map(category => {
            const Icon = typeof category.icon === 'string' ? null : category.icon;
            return (
              <div key={category.id} className="flex flex-col items-center space-y-3 cursor-pointer group">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${category.color} group-hover:scale-110 transition-transform`}>
                  {Icon ? (
                    <Icon className="h-8 w-8" />
                  ) : (
                    <span className="text-2xl">{category.icon}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 text-center group-hover:text-teal-600 transition-colors">
                  {category.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Les Tendances */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Les Tendances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(property => (
            <TrendCard key={property.id} property={property} onClick={() => {
              setSelectedProperty(property);
              navigateTo('property');
            }} />
          ))}
        </div>
      </div>
    </div>
  );

  // Properties Page Component
  const PropertiesPage = () => (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Toutes les propriétés</h1>
            <p className="text-gray-600 mt-2">Découvrez notre collection complète de propriétés à Bizerte</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              <span>Filtres</span>
            </button>
          </div>
        </div>

        {/* Filtres rapides */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {['Tous', 'Villa', 'Appartement', 'Maison', 'Studio'].map(type => (
              <button
                key={type}
                className="px-4 py-2 border border-gray-300 rounded-full hover:border-teal-500 hover:text-teal-600 transition-colors"
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des propriétés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(property => (
            <TrendCard key={property.id} property={property} onClick={() => {
              setSelectedProperty(property);
              navigateTo('property');
            }} />
          ))}
        </div>

        {/* Message si aucune propriété */}
        {properties.length === 0 && (
          <div className="text-center py-12">
            <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune propriété trouvée</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </div>
    </div>
  );

  // Trend Card Component (New Modern Design)
  const TrendCard = ({ property, onClick }) => (
    <div onClick={onClick} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <div className="relative h-64">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1 shadow-md">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-semibold text-gray-700">{property.rating}</span>
          <span className="text-sm text-gray-500">({property.reviews})</span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
        <p className="text-gray-600 mb-4">{property.location}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {property.guests} Invités
            </span>
            <span className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {property.bedrooms} Lits
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-gray-900">TND {property.price}</span>
            <span className="text-gray-600">Par nuit</span>
          </div>
          <button className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors font-medium">
            Voir détails
          </button>
        </div>
      </div>
    </div>
  );

  // Property Page Component
  const PropertyPage = () => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);

    if (!selectedProperty) return null;

    return (
      <div className="pt-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedProperty.title}</h1>
                <p className="text-gray-600 flex items-center mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  {selectedProperty.location}
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold">{selectedProperty.rating}</span>
                    <span className="text-gray-600 ml-1">({selectedProperty.reviews} avis)</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center"><Bed className="h-4 w-4 mr-1" />{selectedProperty.bedrooms} chambres</span>
                    <span className="flex items-center"><Bath className="h-4 w-4 mr-1" />{selectedProperty.bathrooms} salles de bain</span>
                    <span className="flex items-center"><Users className="h-4 w-4 mr-1" />{selectedProperty.guests} personnes</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Share2 className="h-4 w-4" />
                  <span>Partager</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Heart className="h-4 w-4" />
                  <span>Sauvegarder</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Photos et informations */}
            <div className="lg:col-span-2 space-y-6">
              {/* Galerie photos */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-96 relative">
                  <img 
                    src={selectedProperty.images[selectedImageIndex]} 
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    {selectedProperty.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">À propos de cette propriété</h2>
                <p className="text-gray-700 mb-6">{selectedProperty.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {selectedProperty.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-semibold mb-4">Équipements</h3>
                <div className="grid grid-cols-3 gap-4">
                  {selectedProperty.amenities.map(amenity => {
                    const Icon = amenityIcons[amenity];
                    return Icon ? (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-700 capitalize">{amenity.replace('_', ' ')}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Contact propriétaire */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Contact direct avec le propriétaire</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedProperty.owner.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedProperty.owner.name}</p>
                    <p className="text-gray-600">Propriétaire direct</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-4">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    <Phone className="h-4 w-4" />
                    <span>Appeler</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Mail className="h-4 w-4" />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Formulaire de réservation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">TND {selectedProperty.price}</span>
                    <span className="text-gray-600">/ nuit</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span>{selectedProperty.rating} ({selectedProperty.reviews} avis)</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Arrivée</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Départ</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Voyageurs</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      {[...Array(selectedProperty.guests)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} voyageur{i > 0 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 font-semibold mb-4 transition-colors">
                  Réserver maintenant
                </button>

                <div className="text-center text-sm text-gray-600">
                  <p>Réservation directe - Sans commission</p>
                  <p>Contact direct avec le propriétaire</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Host Page Component  
  const HostPage = () => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
      }
    };

    const handleFiles = (files) => {
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      // En production, utilisez un service de stockage comme Supabase Storage
      // Pour le moment, on utilise des URLs d'exemple
      const placeholderImages = [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400",
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400"
      ];
      
      const imageUrls = imageFiles.length > 0 
        ? imageFiles.map((_, index) => placeholderImages[index % placeholderImages.length])
        : [];
        
      setNewProperty(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
      
      // Notification pour l'utilisateur
      if (imageFiles.length > 0) {
        alert(`${imageFiles.length} image(s) ajoutée(s) avec succès !`);
      }
    };

    const handleSubmit = () => {
      const property = {
        ...newProperty,
        id: Date.now(),
        rating: 0,
        reviews: 0,
        owner: user
      };
      setProperties(prev => [...prev, property]);
      setNewProperty({
        title: '',
        location: '',
        price: '',
        bedrooms: 1,
        bathrooms: 1,
        guests: 2,
        type: 'apartment',
        neighborhood: 'corniche',
        description: '',
        amenities: [],
        images: []
      });
      alert('Propriété ajoutée avec succès !');
    };

    if (!user) {
      return (
        <div className="pt-16 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Connexion requise</h2>
            <p className="text-gray-600 mb-6">Veuillez vous connecter pour ajouter une propriété</p>
            <button 
              onClick={() => navigateTo('login')}
              className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
            >
              Se connecter
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="pt-16 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-8">Ajouter votre propriété</h1>
            
            <div className="space-y-6">
              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre de l'annonce</label>
                  <input
                    type="text"
                    value={newProperty.title}
                    onChange={(e) => setNewProperty(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Villa vue mer - Corniche Bizerte"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emplacement</label>
                  <input
                    type="text"
                    value={newProperty.location}
                    onChange={(e) => setNewProperty(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Corniche de Bizerte"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quartier</label>
                  <select
                    value={newProperty.neighborhood}
                    onChange={(e) => setNewProperty(prev => ({ ...prev, neighborhood: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    {neighborhoods.map(n => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de logement</label>
                  <select
                    value={newProperty.type}
                    onChange={(e) => setNewProperty(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="apartment">Appartement</option>
                    <option value="villa">Villa</option>
                    <option value="house">Maison</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>
              </div>

              {/* Capacité et prix */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chambres</label>
                  <select
                    value={newProperty.bedrooms}
                    onChange={(e) => setNewProperty(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    {[1,2,3,4,5,6].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salles de bain</label>
                  <select
                    value={newProperty.bathrooms}
                    onChange={(e) => setNewProperty(prev => ({ ...prev, bathrooms: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    {[1,2,3,4].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Voyageurs max</label>
                  <select
                    value={newProperty.guests}
                    onChange={(e) => setNewProperty(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix / nuit (TND)</label>
                  <input
                    type="number"
                    value={newProperty.price}
                    onChange={(e) => setNewProperty(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="300"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newProperty.description}
                  onChange={(e) => setNewProperty(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Décrivez votre propriété, ses atouts, sa localisation..."
                  required
                />
              </div>

              {/* Équipements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Équipements</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.keys(amenityIcons).map(amenity => {
                    const Icon = amenityIcons[amenity];
                    const isSelected = newProperty.amenities.includes(amenity);
                    return (
                      <label key={amenity} className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewProperty(prev => ({
                                ...prev,
                                amenities: [...prev.amenities, amenity]
                              }));
                            } else {
                              setNewProperty(prev => ({
                                ...prev,
                                amenities: prev.amenities.filter(a => a !== amenity)
                              }));
                            }
                          }}
                          className="hidden"
                        />
                        <Icon className="h-5 w-5" />
                        <span className="text-sm capitalize">{amenity.replace('_', ' ')}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Upload photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Photos de la propriété</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Glissez-déposez vos photos ici</p>
                  <p className="text-sm text-gray-500">ou</p>
                  <label className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                    <Upload className="h-4 w-4 inline mr-2" />
                    Choisir des fichiers
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFiles(Array.from(e.target.files))}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {newProperty.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-4">
                    {newProperty.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={image} alt={`Photo ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => setNewProperty(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
                          }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-teal-500 text-white py-4 rounded-lg hover:bg-teal-600 font-semibold text-lg transition-colors"
              >
                <Plus className="h-5 w-5 inline mr-2" />
                Publier ma propriété
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard Component
  const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [userProperties] = useState(properties.filter(p => p.owner?.id === user?.id));
    const [bookings] = useState([
      {
        id: 1,
        property: properties[0],
        checkIn: '2024-06-15',
        checkOut: '2024-06-20',
        guests: 4,
        total: 2700,
        status: 'confirmed'
      }
    ]);

    if (!user) {
      return (
        <div className="pt-16 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Connexion requise</h2>
            <button 
              onClick={() => navigateTo('login')}
              className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
            >
              Se connecter
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="pt-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Mon tableau de bord</h1>
          
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'profile', name: 'Profil', icon: Users },
                  { id: 'bookings', name: 'Mes réservations', icon: Calendar },
                  { id: 'properties', name: 'Mes propriétés', icon: Home },
                  { id: 'earnings', name: 'Revenus', icon: BarChart3 }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 ${
                        activeTab === tab.id 
                          ? 'border-teal-500 text-teal-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Informations personnelles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        value={user.email} 
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      <input 
                        type="tel" 
                        placeholder="+216 XX XXX XXX"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                      <input 
                        type="text" 
                        placeholder="Votre nom complet"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                      <input 
                        type="text" 
                        placeholder="Bizerte"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                  <button className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors">
                    Sauvegarder les modifications
                  </button>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Mes réservations</h2>
                  {bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map(booking => (
                        <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex space-x-4">
                              <img 
                                src={booking.property.images[0]} 
                                alt={booking.property.title}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div>
                                <h3 className="font-semibold text-lg">{booking.property.title}</h3>
                                <p className="text-gray-600">{booking.property.location}</p>
                                <p className="text-sm text-gray-500">
                                  {booking.checkIn} → {booking.checkOut} • {booking.guests} voyageurs
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">{booking.total} TND</div>
                              <div className={`px-3 py-1 rounded-full text-sm ${
                                booking.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Aucune réservation pour le moment</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'properties' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Mes propriétés</h2>
                    <button 
                      onClick={() => navigateTo('host')}
                      className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 flex items-center space-x-2 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Ajouter une propriété</span>
                    </button>
                  </div>
                  
                  {userProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userProperties.map(property => (
                        <div key={property.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={property.images[0]} 
                            alt={property.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="font-semibold mb-2">{property.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                            <p className="font-bold">{property.price} TND / nuit</p>
                            <div className="flex justify-between items-center mt-4">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm">{property.rating} ({property.reviews})</span>
                              </div>
                              <div className="flex space-x-2">
                                <button className="p-2 text-gray-600 hover:text-blue-600">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-green-600">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Vous n'avez pas encore de propriétés</p>
                      <button 
                        onClick={() => navigateTo('host')}
                        className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                      >
                        Ajouter votre première propriété
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'earnings' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Revenus</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Ce mois</h3>
                      <p className="text-3xl font-bold text-blue-600">3,250 TND</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-green-900 mb-2">Cette année</h3>
                      <p className="text-3xl font-bold text-green-600">22,750 TND</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-purple-900 mb-2">Total</h3>
                      <p className="text-3xl font-bold text-purple-600">45,420 TND</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Admin Page Component
  const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats] = useState({
      totalProperties: properties.length,
      totalUsers: 156,
      totalBookings: 89,
      revenue: 35750
    });

    if (!user || user.role !== 'admin') {
      return (
        <div className="pt-16 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Accès restreint</h2>
            <p className="text-gray-600">Vous n'avez pas les permissions d'administrateur</p>
          </div>
        </div>
      );
    }

    return (
      <div className="pt-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Panel Administrateur</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Propriétés</p>
                  <p className="text-3xl font-bold">{stats.totalProperties}</p>
                </div>
                <Home className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Utilisateurs</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-12 w-12 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Réservations</p>
                  <p className="text-3xl font-bold">{stats.totalBookings}</p>
                </div>
                <Calendar className="h-12 w-12 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenus</p>
                  <p className="text-3xl font-bold">{stats.revenue} TND</p>
                </div>
                <BarChart3 className="h-12 w-12 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'dashboard', name: 'Tableau de bord' },
                  { id: 'properties', name: 'Propriétés' },
                  { id: 'users', name: 'Utilisateurs' },
                  { id: 'bookings', name: 'Réservations' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 border-b-2 ${
                      activeTab === tab.id 
                        ? 'border-teal-500 text-teal-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'properties' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Gestion des propriétés</h2>
                    <div className="flex space-x-2">
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Filter className="h-4 w-4" />
                        <span>Filtrer</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold">Propriété</th>
                          <th className="text-left py-3 px-4 font-semibold">Propriétaire</th>
                          <th className="text-left py-3 px-4 font-semibold">Prix</th>
                          <th className="text-left py-3 px-4 font-semibold">Note</th>
                          <th className="text-left py-3 px-4 font-semibold">Statut</th>
                          <th className="text-left py-3 px-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {properties.map(property => (
                          <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={property.images[0]} 
                                  alt={property.title}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                                <div>
                                  <p className="font-semibold">{property.title}</p>
                                  <p className="text-sm text-gray-600">{property.location}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">{property.owner?.name || 'N/A'}</td>
                            <td className="py-4 px-4">{property.price} TND/nuit</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                {property.rating}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                Active
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex space-x-2">
                                <button className="p-2 text-gray-600 hover:text-blue-600">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-yellow-600">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Gestion des utilisateurs</h2>
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Interface de gestion des utilisateurs</p>
                  </div>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Gestion des réservations</h2>
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Interface de gestion des réservations</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Auth Components
  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
      const { user } = await supabaseAuth.signIn(email, password);
      if (user) {
        setUser(user);
        navigateTo('dashboard');
      }
    };

    return (
      <div className="pt-16 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Se connecter</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 font-semibold transition-colors"
            >
              Se connecter
            </button>
          </div>
          <p className="text-center mt-4 text-gray-600">
            Pas de compte ? 
            <button 
              onClick={() => navigateTo('register')}
              className="text-blue-600 hover:underline ml-1"
            >
              S'inscrire
            </button>
          </p>
        </div>
      </div>
    );
  };

  const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('guest');

    const handleSubmit = async () => {
      if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas');
        return;
      }
      
      const { user } = await supabaseAuth.signUp(email, password, { role });
      if (user) {
        setUser(user);
        navigateTo('dashboard');
      }
    };

    return (
      <div className="pt-16 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">S'inscrire</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Je souhaite</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="guest">Louer une propriété</option>
                <option value="host">Devenir hôte</option>
              </select>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 font-semibold transition-colors"
            >
              S'inscrire
            </button>
          </div>
          <p className="text-center mt-4 text-gray-600">
            Déjà un compte ? 
            <button 
              onClick={() => navigateTo('login')}
              className="text-blue-600 hover:underline ml-1"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    );
  };

  // Main App Render
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'properties' && <PropertiesPage />}
      {currentPage === 'property' && <PropertyPage />}
      {currentPage === 'host' && <HostPage />}
      {currentPage === 'dashboard' && <DashboardPage />}
      {currentPage === 'admin' && <AdminPage />}
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'register' && <RegisterPage />}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">B</span>
                </div>
                <span className="text-xl font-bold">Bizerta Location</span>
              </div>
              <p className="text-gray-400">
                La plateforme de location de vacances à Bizerte. 
                Réservez directement auprès des propriétaires locaux.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quartiers</h3>
              <ul className="space-y-2 text-gray-400">
                {neighborhoods.map(n => (
                  <li key={n.id}>{n.name}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Centre d'aide</li>
                <li>Sécurité</li>
                <li>Conditions</li>
                <li>Confidentialité</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>+216 XX XXX XXX</li>
                <li>contact@bizerta-location.tn</li>
                <li>Bizerte, Tunisie</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Bizerta Location. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
