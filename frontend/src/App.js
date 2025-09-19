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
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "Villa Vue Mer - Corniche Bizerte",
      location: "Corniche de Bizerte",
      price: 180,
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
      title: "Appartement Médina Authentique",
      location: "Médina de Bizerte",
      price: 90,
      rating: 4.6,
      reviews: 18,
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400", "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400"],
      amenities: ['wifi', 'air_conditioning', 'kitchen'],
      bedrooms: 2,
      bathrooms: 1,
      guests: 4,
      type: 'apartment',
      neighborhood: 'medina',
      owner: { id: 2, name: "Fatma Trabelsi", phone: "+216 25 987 654" },
      description: "Charmant appartement traditionnel au cœur de la médina historique de Bizerte. Architecture authentique avec tout le confort moderne.",
      features: ["Centre historique", "Architecture traditionnelle", "Proximité souks", "Calme", "Authentique"]
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

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div 
              onClick={() => setCurrentPage('home')}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Home className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Bizerta Rental</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`${currentPage === 'home' ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`}
            >
              Accueil
            </button>
            {user && (
              <>
                <button 
                  onClick={() => setCurrentPage('host')}
                  className={`${currentPage === 'host' ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`}
                >
                  Devenir Hôte
                </button>
                <button 
                  onClick={() => setCurrentPage('dashboard')}
                  className={`${currentPage === 'dashboard' ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`}
                >
                  Mon Compte
                </button>
                {user.role === 'admin' && (
                  <button 
                    onClick={() => setCurrentPage('admin')}
                    className={`${currentPage === 'admin' ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`}
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
                  onClick={() => { setUser(null); setCurrentPage('home'); }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Se déconnecter
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentPage('login')}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Se connecter
                </button>
                <button 
                  onClick={() => setCurrentPage('register')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
    <div className="pt-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Découvrez Bizerte Autrement
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Louez directement auprès des propriétaires locaux. Villas, appartements et maisons authentiques dans la perle du nord tunisien.
          </p>
          
          {/* Search Form */}
          <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <select className="w-full bg-transparent outline-none text-gray-700">
                  <option>Tous les quartiers</option>
                  {neighborhoods.map(n => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <input 
                  type="date" 
                  className="w-full bg-transparent outline-none text-gray-700"
                  placeholder="Arrivée" 
                />
              </div>
              
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <input 
                  type="date" 
                  className="w-full bg-transparent outline-none text-gray-700"
                  placeholder="Départ" 
                />
              </div>
              
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <Users className="h-5 w-5 text-gray-400" />
                <select className="w-full bg-transparent outline-none text-gray-700">
                  <option>2 voyageurs</option>
                  <option>4 voyageurs</option>
                  <option>6 voyageurs</option>
                  <option>8+ voyageurs</option>
                </select>
              </div>
            </div>
            
            <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
              <Search className="h-5 w-5 inline mr-2" />
              Rechercher
            </button>
          </div>
        </div>
      </div>

      {/* Quartiers de Bizerte */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Quartiers de Bizerte</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {neighborhoods.map(neighborhood => {
            const Icon = neighborhood.icon;
            return (
              <div key={neighborhood.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <Icon className="h-16 w-16 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{neighborhood.name}</h3>
                  <p className="text-gray-600">{neighborhood.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Propriétés en vedette */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Propriétés en Vedette</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} onClick={() => {
                setSelectedProperty(property);
                setCurrentPage('property');
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Property Card Component
  const PropertyCard = ({ property, onClick }) => (
    <div onClick={onClick} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative h-48">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-gray-100">
          <Heart className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{property.title}</h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{property.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {property.location}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span className="flex items-center"><Bed className="h-4 w-4 mr-1" />{property.bedrooms} ch</span>
          <span className="flex items-center"><Bath className="h-4 w-4 mr-1" />{property.bathrooms} sdb</span>
          <span className="flex items-center"><Users className="h-4 w-4 mr-1" />{property.guests} pers</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold text-gray-900">{property.price}€</span>
            <span className="text-gray-600"> / nuit</span>
          </div>
          <span className="text-sm text-gray-500">({property.reviews} avis)</span>
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
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <Phone className="h-4 w-4" />
                    <span>Appeler</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
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
                    <span className="text-2xl font-bold">{selectedProperty.price}€</span>
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
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Départ</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Voyageurs</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {[...Array(selectedProperty.guests)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} voyageur{i > 0 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold mb-4">
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
      const imageUrls = imageFiles.map(file => URL.createObjectURL(file));
      setNewProperty(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
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
              onClick={() => setCurrentPage('login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix / nuit (€)</label>
                  <input
                    type="number"
                    value={newProperty.price}
                    onChange={(e) => setNewProperty(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="150"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg"
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
        total: 900,
        status: 'confirmed'
      }
    ]);

    if (!user) {
      return (
        <div className="pt-16 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Connexion requise</h2>
            <button 
              onClick={() => setCurrentPage('login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
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
                          ? 'border-blue-500 text-blue-600' 
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                      <input 
                        type="text" 
                        placeholder="Votre nom complet"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                      <input 
                        type="text" 
                        placeholder="Bizerte"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
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
                              <div className="text-2xl font-bold">{booking.total}€</div>
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
                      onClick={() => setCurrentPage('host')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
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
                            <p className="font-bold">{property.price}€ / nuit</p>
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
                        onClick={() => setCurrentPage('host')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
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
                      <p className="text-3xl font-bold text-blue-600">1,250€</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-green-900 mb-2">Cette année</h3>
                      <p className="text-3xl font-bold text-green-600">8,750€</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-purple-900 mb-2">Total</h3>
                      <p className="text-3xl font-bold text-purple-600">15,420€</p>
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
      revenue: 12750
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
                  <p className="text-3xl font-bold">{stats.revenue}€</p>
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
                        ? 'border-blue-500 text-blue-600' 
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
                            <td className="py-4 px-4">{property.price}€/nuit</td>
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
        setCurrentPage('dashboard');
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Se connecter
            </button>
          </div>
          <p className="text-center mt-4 text-gray-600">
            Pas de compte ? 
            <button 
              onClick={() => setCurrentPage('register')}
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
        setCurrentPage('dashboard');
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Je souhaite</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="guest">Louer une propriété</option>
                <option value="host">Devenir hôte</option>
              </select>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              S'inscrire
            </button>
          </div>
          <p className="text-center mt-4 text-gray-600">
            Déjà un compte ? 
            <button 
              onClick={() => setCurrentPage('login')}
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
                <Home className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">Bizerta Rental</span>
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
                <li>contact@bizerta-rental.tn</li>
                <li>Bizerte, Tunisie</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Bizerta Rental. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
