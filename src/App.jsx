/**
 * App - Composant racine de l'application
 *
 * Architecture :
 * - Providers imbriqués pour les contextes globaux (Thème, Langue, Auth, Catégories)
 * - Router React pour la navigation SPA
 * - Routes protégées et publiques
 * - Layout wrapper commun pour toutes les pages
 *
 * Ordre des providers (du plus externe au plus interne) :
 * 1. ThemeProvider - Gestion du thème clair/sombre
 * 2. LanguageProvider - Gestion multilingue
 * 3. AuthProvider - Authentification utilisateur
 * 4. Router - Navigation React Router
 * 5. CategoryProvider - Gestion des catégories (nécessite Router)
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CategoryProvider } from './contexts/CategoryContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CreateListing from './pages/CreateListing';
import CreateVehicleListing from './pages/CreateVehicleListing';
import CreateRentalListing from './pages/CreateRentalListing';
import EditListing from './pages/EditListing';
import ListingDetail from './pages/ListingDetail';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import MyListings from './pages/MyListings';
import Favorites from './pages/Favorites';
import './styles/global.css';

function App() {
  return (
    // Thème (clair/sombre) - Premier provider
    <ThemeProvider>
      {/* Langue (FR/EN/AR) - Deuxième provider */}
      <LanguageProvider>
        {/* Authentification utilisateur - Troisième provider */}
        <AuthProvider>
          {/* Router pour la navigation - Quatrième provider */}
          <Router>
            {/* Catégories (nécessite Router pour navigate) - Cinquième provider */}
            <CategoryProvider>
              <Routes>
                {/* Layout commun avec Header et Footer pour toutes les pages */}
                <Route path="/" element={<Layout />}>
                  {/* Page d'accueil avec listings */}
                  <Route index element={<Home />} />

                  {/* Page d'accueil filtrée par catégorie */}
                  <Route path="category/:slug" element={<Home />} />

                  {/* Pages d'authentification */}
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />

                  {/* Pages de création d'annonces */}
                  <Route path="create-listing" element={<CreateListing />} />
                  <Route path="create-vehicle-listing" element={<CreateVehicleListing />} />
                  <Route path="create-rental-listing" element={<CreateRentalListing />} />

                  {/* Page d'édition d'annonce */}
                  <Route path="edit-listing/:id" element={<EditListing />} />

                  {/* Page de détail d'une annonce */}
                  <Route path="listing/:id" element={<ListingDetail />} />

                  {/* Pages utilisateur (profil, messages, annonces, favoris) */}
                  <Route path="profile" element={<Profile />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="my-listings" element={<MyListings />} />
                  <Route path="favorites" element={<Favorites />} />
                </Route>
              </Routes>
            </CategoryProvider>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
