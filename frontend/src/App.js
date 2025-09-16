import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Search, MapPin, Star, Users, Bed, ArrowRight, Shield, Heart, Award, Menu, X, Home } from 'lucide-react';
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Bizerta_Rental</span>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Accueil</a>
            <a href="/properties" className="text-gray-700 hover:text-blue-600 transition-colors">Propriétés</a>
            <a href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">À propos</a>
            <a href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-blue-600 transition-colors">Connexion</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Inscription
            </button>
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile Ouvert */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Accueil</a>
              <a href="/properties" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Propriétés</a>
              <a href="/about" className="block px-3 py-2 text-gray-700 hover:text-blue-600">À propos</a>
              <a href="/contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Contact</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Home Page Component
const HomePage = () => {
  const [searchLocation, setSearchLocation] = React.useState('');
  const [checkIn, setCheckIn] = React.useState('');
  const [checkOut, setCheckOut] = React.useState('');
  const [guests, setGuests] = React.useState(2);

  const featuredProperties = [
    {
      id: 1,
      name: "Villa Méditerranéenne avec Vue Mer",
      location: "Corniche, Bizerte",
      price: 180,
      rating: 4.8,
      reviews: 24,
      guests: 8,
      bedrooms: 4,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 2,
      name: "Appartement Centre Historique",
      location: "Médina, Bizerte",
      price: 95,
      rating: 4.6,
      reviews: 18,
      guests: 4,
      bedrooms: 2,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 3,
      name: "Maison de Vacances Ras Jebel",
      location: "Ras Jebel, Bizerte",
      price: 140,
      rating: 4.9,
      reviews: 31,
      guests: 6,
      bedrooms: 3,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Découvrez Bizerte
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Trouvez l'hébergement parfait pour vos vacances à Bizerte. 
              Appartements, villas et maisons uniques vous attendent dans cette magnifique ville côtière.
            </p>
            
            {/* Formulaire de recherche */}
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
                
                <button className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Rechercher</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Propriétés en vedette */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Propriétés en vedette</h2>
            <p className="text-lg text-gray-600">Découvrez nos hébergements les plus populaires à Bizerte</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
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
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">{property.price}€</span>
                      <span className="text-gray-600 ml-1">/nuit</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a href="/properties" className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              <span>Voir toutes les propriétés</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Pourquoi choisir Bizerta_Rental */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi choisir Bizerta_Rental ?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Votre plateforme de confiance pour découvrir les plus beaux hébergements de Bizerte
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Réservation sécurisée</h3>
              <p className="text-gray-600">
                Réservez en toute confiance avec notre système de paiement sécurisé et nos garanties de protection.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Logements de qualité</h3>
              <p className="text-gray-600">
                Tous nos hébergements sont soigneusement sélectionnés pour vous garantir confort et satisfaction à Bizerte.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expertise locale</h3>
              <p className="text-gray-600">
                Bénéficiez de notre connaissance approfondie de Bizerte pour vivre une expérience authentique et inoubliable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations populaires */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quartiers populaires à Bizerte</h2>
            <p className="text-lg text-gray-600">Explorez les différents quartiers de notre belle ville</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Bizerte Centre', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73ffe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
              { name: 'Corniche', image: 'https://img.cava.tn/cava/items/14eea6b2-c179-4f52-9860-e49cc96c75e9/1747927361248.webpixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
              { name: 'Ras Jebel', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
              { name: 'Cap Blanc', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Pages supplémentaires
const PropertiesPage = () => (
  <div className="min-h-screen py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Toutes les propriétés</h1>
      <p className="text-gray-600">Page des propriétés en cours de développement...</p>
    </div>
  </div>
);

const AboutPage = () => (
  <div className="min-h-screen py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">À propos de Bizerta_Rental</h1>
      <p className="text-gray-600">Votre plateforme de location de vacances spécialisée dans la région de Bizerte.</p>
    </div>
  </div>
);

const ContactPage = () => (
  <div className="min-h-screen py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contactez-nous</h1>
      <p className="text-gray-600">Email: contact@bizertarental.com</p>
    </div>
  </div>
);

// Footer Component
const Footer = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <Home className="w-6 h-6 text-blue-600" />
            <span className="text-2xl font-bold">Bizerta_Rental</span>
          </div>
          <p className="text-gray-400 mb-6 max-w-md">
            Votre plateforme de confiance pour la location de vacances à Bizerte. 
            Découvrez des hébergements uniques dans la plus belle ville côtière de Tunisie.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Navigation</h3>
          <div className="space-y-2">
            <a href="/" className="block text-gray-400 hover:text-white transition-colors">Accueil</a>
            <a href="/properties" className="block text-gray-400 hover:text-white transition-colors">Propriétés</a>
            <a href="/about" className="block text-gray-400 hover:text-white transition-colors">À propos</a>
            <a href="/contact" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <div className="space-y-2">
            <a href="/help" className="block text-gray-400 hover:text-white transition-colors">Centre d'aide</a>
            <a href="/terms" className="block text-gray-400 hover:text-white transition-colors">Conditions</a>
            <a href="/privacy" className="block text-gray-400 hover:text-white transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-8 pt-8 text-center">
        <p className="text-gray-400">© 2024 Bizerta_Rental. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
);

export default App;
