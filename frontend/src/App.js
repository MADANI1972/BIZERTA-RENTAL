const supabaseUrl = 'https://pxgeckzjsavfzzrwztcd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4Z2Vja3pqc2F2Znp6cnd6dGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MDg5NTEsImV4cCI6MjA3MzI4NDk1MX0.DM3tOiRRMX0pYQa6bxiSqOdH6e6PSPqSzAj8BE3hbco';

import React, { useState } from 'react';
import { Search, MapPin, Star, Users, Bed, ArrowRight, Shield, Heart, Award, Menu, X, Home, Filter, Phone, Mail, Wifi, Car, Utensils, Tv, Coffee, Bath, Waves, Euro, ChevronLeft, ChevronRight, Send, CheckCircle } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'properties':
        return <PropertiesPage setCurrentPage={setCurrentPage} />;
      case 'property-detail':
        return <PropertyDetailPage setCurrentPage={setCurrentPage} />;
      case 'booking':
        return <BookingPage setCurrentPage={setCurrentPage} />;
      case 'host':
        return <HostPage setCurrentPage={setCurrentPage} />;
      case 'about':
        return <AboutPage setCurrentPage={setCurrentPage} />;
      case 'contact':
        return <ContactPage setCurrentPage={setCurrentPage} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>
        {renderPage()}
      </main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}

const Navbar = ({ currentPage, setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => setCurrentPage('home')}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Bizerta_Rental</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setCurrentPage('home')} 
              className={`transition-colors ${currentPage === 'home' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Accueil
            </button>
            <button 
              onClick={() => setCurrentPage('properties')} 
              className={`transition-colors ${currentPage === 'properties' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Propriétés
            </button>
            <button 
              onClick={() => setCurrentPage('host')} 
              className={`transition-colors ${currentPage === 'host' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Devenir hôte
            </button>
            <button 
              onClick={() => setCurrentPage('about')} 
              className={`transition-colors ${currentPage === 'about' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              À propos
            </button>
            <button 
              onClick={() => setCurrentPage('contact')} 
              className={`transition-colors ${currentPage === 'contact' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Contact
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-blue-600 transition-colors">
              Connexion
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Inscription
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => { setCurrentPage('home'); setIsMenuOpen(false); }} 
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 w-full text-left"
              >
                Accueil
              </button>
              <button 
                onClick={() => { setCurrentPage('properties'); setIsMenuOpen(false); }} 
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 w-full text-left"
              >
                Propriétés
              </button>
              <button 
                onClick={() => { setCurrentPage('host'); setIsMenuOpen(false); }} 
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 w-full text-left"
              >
                Devenir hôte
              </button>
              <button 
                onClick={() => { setCurrentPage('about'); setIsMenuOpen(false); }} 
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 w-full text-left"
              >
                À propos
              </button>
              <button 
                onClick={() => { setCurrentPage('contact'); setIsMenuOpen(false); }} 
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 w-full text-left"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const HomePage = ({ setCurrentPage }) => {
  const [searchLocation, setSearchLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const featuredProperties = [
    {
      id: 1,
      name: "Villa Méditerranéenne avec Vue Mer",
      location: "Corniche, Bizerte",
      price: 180,
      originalPrice: 220,
      rating: 4.8,
      reviews: 24,
      guests: 8,
      bedrooms: 4,
      bathrooms: 3,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      amenities: ['wifi', 'car', 'waves', 'utensils'],
      host: "Ahmed Ben Salem"
    },
    {
      id: 2,
      name: "Appartement Centre Historique",
      location: "Médina, Bizerte",
      price: 95,
      originalPrice: 120,
      rating: 4.6,
      reviews: 18,
      guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      amenities: ['wifi', 'tv', 'coffee'],
      host: "Fatma Mejri"
    },
    {
      id: 3,
      name: "Maison de Vacances Ras Jebel",
      location: "Ras Jebel, Bizerte",
      price: 140,
      originalPrice: 180,
      rating: 4.9,
      reviews: 31,
      guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      amenities: ['wifi', 'car', 'utensils', 'waves'],
      host: "Mohamed Trabelsi"
    }
  ];

  const handleSearch = () => {
    setCurrentPage('properties');
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Découvrez Bizerte
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Réservez directement auprès des propriétaires locaux. 
              Pas d'intermédiaires, pas de frais cachés - Juste des expériences authentiques à Bizerte.
            </p>
            
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="Bizerte centre, Corniche, Ras Jebel..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Arrivée</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Départ</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex flex-col md:flex-row items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Voyageurs</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'voyageur' : 'voyageurs'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <button 
                  onClick={handleSearch}
                  className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Rechercher</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Réservation directe - 100% locale</h2>
            <p className="text-lg text-gray-600">Réservez directement auprès des propriétaires de Bizerte</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Euro className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Pas de frais cachés</h3>
              <p className="text-gray-600">
                Prix transparents sans commission d'intermédiaires. Payez directement le propriétaire.
              </p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact direct</h3>
              <p className="text-gray-600">
                Communiquez directement avec votre hôte pour une expérience personnalisée.
              </p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expérience authentique</h3>
              <p className="text-gray-600">
                Découvrez Bizerte avec les conseils authentiques des habitants locaux.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Propriétés en vedette</h2>
            <p className="text-lg text-gray-600">Découvrez nos hébergements les plus populaires à Bizerte</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} setCurrentPage={setCurrentPage} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button 
              onClick={() => setCurrentPage('properties')}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>Voir toutes les propriétés</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quartiers populaires à Bizerte</h2>
            <p className="text-lg text-gray-600">Explorez les différents quartiers de notre belle ville</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Bizerte Centre', properties: 45, image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73ffe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
              { name: 'Corniche', properties: 38, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
              { name: 'Ras Jebel', properties: 22, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
              { name: 'Cap Blanc', properties: 15, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }
            ].map((destination) => (
              <div key={destination.name} className="relative h-64 rounded-lg overflow-hidden group cursor-pointer">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white text-xl font-semibold">{destination.name}</h3>
                  <p className="text-white text-sm">{destination.properties} propriétés</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const PropertyCard = ({ property, setCurrentPage }) => {
  const renderAmenityIcon = (amenity) => {
    const icons = {
      wifi: <Wifi className="w-4 h-4" />,
      car: <Car className="w-4 h-4" />,
      utensils: <Utensils className="w-4 h-4" />,
      tv: <Tv className="w-4 h-4" />,
      coffee: <Coffee className="w-4 h-4" />,
      bath: <Bath className="w-4 h-4" />,
      waves: <Waves className="w-4 h-4" />
    };
    return icons[amenity] || null;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-full">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold">{property.rating}</span>
          </div>
        </div>
        <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          Réservation directe
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.name}</h3>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{property.guests}</span>
            </div>
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          {property.amenities.slice(0, 4).map((amenity, index) => (
            <div key={index} className="text-gray-400">
              {renderAmenityIcon(amenity)}
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            {property.originalPrice > property.price && (
              <span className="text-sm text-gray-400 line-through mr-2">{property.originalPrice}€</span>
            )}
            <span className="text-2xl font-bold text-gray-900">{property.price}€</span>
            <span className="text-gray-600 ml-1">/nuit</span>
          </div>
          <button 
            onClick={() => setCurrentPage('property-detail')}
            className="text-blue-600 hover:text-blue-700"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          Hôte: {property.host}
        </div>
      </div>
    </div>
  );
};

const PropertiesPage = ({ setCurrentPage }) => {
  const [sortBy, setSortBy] = useState('recommended');

  const allProperties = [
    {
      id: 1,
      name: "Villa Méditerranéenne avec Vue Mer",
      location: "Corniche, Bizerte",
      price: 180,
      originalPrice: 220,
      rating: 4.8,
      reviews: 24,
      guests: 8,
      bedrooms: 4,
      bathrooms: 3,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      amenities: ['wifi', 'car', 'waves', 'utensils'],
      host: "Ahmed Ben Salem"
    },
    {
      id: 2,
      name: "Appartement Centre Historique",
      location: "Médina, Bizerte",
      price: 95,
      originalPrice: 120,
      rating: 4.6,
      reviews: 18,
      guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      amenities: ['wifi', 'tv', 'coffee'],
      host: "Fatma Mejri"
    }
  ];

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Propriétés à Bizerte</h1>
          <p className="text-gray-600">Trouvé {allProperties.length} propriétés disponibles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filtres
              </h3>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">{allProperties.length} résultats</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="recommended">Recommandé</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
                <option value="rating">Mieux notés</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allProperties.map((property) => (
                <PropertyCard key={property.id} property={property} setCurrentPage={setCurrentPage} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertyDetailPage = ({ setCurrentPage }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const property = {
    id: 1,
    name: "Villa Méditerranéenne avec Vue Mer",
    location: "Corniche, Bizerte",
    price: 180,
    originalPrice: 220,
    rating: 4.8,
    reviews: 24,
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    surface: 180,
    host: {
      name: "Ahmed Ben Salem",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      joinedYear: 2018,
      responseRate: 98,
      phone: "+216 22 123 456",
      email: "ahmed@bizertarental.com"
    },
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      { icon: 'wifi', name: 'WiFi gratuit' },
      { icon: 'car', name: 'Parking gratuit' }
    ],
    description: "Magnifique villa méditerranéenne située sur la corniche de Bizerte avec une vue imprenable sur la mer."
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button 
            onClick={() => setCurrentPage('properties')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour aux résultats
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={property.images[currentImageIndex]}
                alt={property.name}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">À propos de cette propriété</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>
          </div>

          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold text-gray-900">{property.price}€</span>
                  <span className="text-gray-600 ml-1">/nuit</span>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Réservation directe
                </div>
              </div>

              <button 
                onClick={() => setCurrentPage('booking')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Réserver maintenant
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg mt-6">
              <h3 className="text-lg font-semibold mb-4">Votre hôte</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={property.host.avatar}
                  alt={property.host.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">{property.host.name}</div>
                  <div className="text-sm text-gray-600">Hôte depuis {property.host.joinedYear}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingPage = ({ setCurrentPage }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    paymentMethod: 'online'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button 
            onClick={() => setCurrentPage('property-detail')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour à la propriété
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Finaliser la réservation</h1>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Vos informations</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Continuer
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Mode de paiement</h2>
              <button 
                onClick={() => setStep(3)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Confirmer la réservation
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Réservation confirmée !</h2>
              <button 
                onClick={() => setCurrentPage('home')}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Retour à l'accueil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HostPage = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    propertyType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Votre propriété a été soumise avec succès!');
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Devenez hôte sur Bizerta_Rental</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Partagez votre propriété avec des voyageurs du monde entier et générez des revenus supplémentaires
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Euro className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Revenus directs</h3>
            <p className="text-gray-600">Recevez 100% de vos revenus sans commission d'intermédiaire</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Contrôle total</h3>
            <p className="text-gray-600">Gérez vos prix, disponibilités et conditions de réservation</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Communauté locale</h3>
            <p className="text-gray-600">Rejoignez notre réseau d'hôtes passionnés de Bizerte</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Ajouter votre propriété</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de propriété</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner...</option>
                <option value="apartment">Appartement</option>
                <option value="house">Maison</option>
                <option value="villa">Villa</option>
                <option value="studio">Studio</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Soumettre la propriété
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const AboutPage = ({ setCurrentPage }) => (
  <div className="min-h-screen py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">À propos de Bizerta_Rental</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Votre plateforme locale de confiance pour la location de vacances directe à Bizerte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Mission</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Bizerta_Rental est née d'une passion pour notre magnifique ville côtière et du désir de connecter 
              directement les voyageurs avec les propriétaires locaux de Bizerte.
            </p>
            <p>
              Contrairement aux grandes plateformes internationales qui prennent des commissions importantes, 
              nous facilitons les réservations directes pour que 100% des revenus restent dans notre communauté locale.
            </p>
            <p>
              Nous croyons en l'authenticité, la transparence et l'hospitalité tunisienne traditionnelle.
            </p>
          </div>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1539650116574-75c0c6d73ffe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            alt="Bizerte vue aérienne"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Rejoignez Notre Communauté</h2>
        <p className="text-lg text-gray-600 mb-6">
          Que vous soyez voyageur ou propriétaire, rejoignez notre famille Bizerta_Rental
        </p>
        <div className="space-x-4">
          <button 
            onClick={() => setCurrentPage('properties')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Trouver un logement
          </button>
          <button 
            onClick={() => setCurrentPage('host')}
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Devenir hôte
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ContactPage = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Votre message a été envoyé avec succès!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Contactez-nous</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous sommes là pour vous aider. N'hésitez pas à nous contacter pour toute question
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Nos coordonnées</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Téléphone</h3>
                  <p className="text-gray-600">+216 72 123 456</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">contact@bizertarental.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Adresse</h3>
                  <p className="text-gray-600">
                    Avenue Habib Bourguiba<br />
                    7000 Bizerte, Tunisie
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Envoyez-nous un message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Envoyer le message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = ({ setCurrentPage }) => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <Home className="w-6 h-6 text-blue-600" />
            <span className="text-2xl font-bold">Bizerta_Rental</span>
          </div>
          <p className="text-gray-400 mb-6 max-w-md">
            Votre plateforme locale de confiance pour la location de vacances directe à Bizerte. 
            Découvrez des hébergements authentiques sans intermédiaires.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Navigation</h3>
          <div className="space-y-2">
            <button onClick={() => setCurrentPage('home')} className="block text-gray-400 hover:text-white transition-colors text-left">Accueil</button>
            <button onClick={() => setCurrentPage('properties')} className="block text-gray-400 hover:text-white transition-colors text-left">Propriétés</button>
            <button onClick={() => setCurrentPage('host')} className="block text-gray-400 hover:text-white transition-colors text-left">Devenir hôte</button>
            <button onClick={() => setCurrentPage('about')} className="block text-gray-400 hover:text-white transition-colors text-left">À propos</button>
            <button onClick={() => setCurrentPage('contact')} className="block text-gray-400 hover:text-white transition-colors text-left">Contact</button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <div className="space-y-2">
            <a href="#" className="block text-gray-400 hover:text-white transition-colors">Centre d'aide</a>
            <a href="#" className="block text-gray-400 hover:text-white transition-colors">Conditions</a>
            <a href="#" className="block text-gray-400 hover:text-white transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-8 pt-8 text-center">
        <p className="text-gray-400">© 2024 Bizerta_Rental. Tous droits réservés. Réservation directe sans commission.</p>
      </div>
    </div>
  </footer>
);

export default App;
