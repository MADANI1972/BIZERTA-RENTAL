import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Bizerta_Rental</h1>
        </header>
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const Home = () => (
  <div>
    <h2 className="text-xl mb-4">Bienvenue sur Bizerta_Rental</h2>
    <p>Votre plateforme de location de vacances à Bizerte est prête !</p>
  </div>
);

export default App;
