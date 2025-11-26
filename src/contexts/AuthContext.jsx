/**
 * AuthContext - Gestion de l'authentification utilisateur
 *
 * Ce contexte gère:
 * - L'état de connexion de l'utilisateur
 * - Le profil utilisateur depuis la base de données
 * - Les opérations d'inscription, connexion et déconnexion
 * - La mise à jour du profil utilisateur
 * - L'écoute des changements d'état d'authentification
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

/**
 * Hook pour accéder au contexte d'authentification
 * @returns {Object} Contexte d'authentification
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Provider pour le contexte d'authentification
 * Gère l'état global de l'utilisateur connecté
 */
export const AuthProvider = ({ children }) => {
  // Utilisateur Supabase Auth (contient id, email, etc.)
  const [user, setUser] = useState(null);

  // Profil complet de l'utilisateur depuis la table profiles
  const [profile, setProfile] = useState(null);

  // Indicateur de chargement pendant la vérification de session
  const [loading, setLoading] = useState(true);

  // Effet exécuté au montage pour vérifier la session et écouter les changements
  useEffect(() => {
    // Vérifie si une session existe déjà
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Écoute les changements d'état d'authentification (connexion, déconnexion)
    // Utilise une IIFE pour éviter les deadlocks avec les async callbacks
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (() => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    // Nettoie l'abonnement au démontage
    return () => subscription.unsubscribe();
  }, []);

  /**
   * Récupère le profil utilisateur depuis la base de données
   * @param {string} userId - ID de l'utilisateur
   */
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // maybeSingle() ne lance pas d'erreur si aucun résultat

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inscrit un nouvel utilisateur
   * Crée à la fois un compte Auth et un profil dans la table profiles
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @param {Object} userData - Données du profil (full_name, phone, wilaya, commune)
   * @returns {Object} Données de l'utilisateur créé
   */
  const signUp = async (email, password, userData) => {
    // Crée le compte Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Crée le profil dans la table profiles
    if (data.user) {
      await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email: data.user.email,
          full_name: userData.full_name,
          phone: userData.phone,
          wilaya: userData.wilaya,
          commune: userData.commune,
        },
      ]);
    }

    return data;
  };

  /**
   * Connecte un utilisateur existant
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Object} Données de session
   */
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  /**
   * Déconnecte l'utilisateur actuel
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  /**
   * Met à jour le profil de l'utilisateur
   * @param {Object} updates - Champs à mettre à jour
   * @returns {Object} Profil mis à jour
   */
  const updateProfile = async (updates) => {
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(data);
    return data;
  };

  // Valeur du contexte exposée à tous les composants enfants
  const value = {
    user,           // Utilisateur Auth Supabase
    profile,        // Profil complet depuis la BDD
    loading,        // Indicateur de chargement
    signUp,         // Fonction d'inscription
    signIn,         // Fonction de connexion
    signOut,        // Fonction de déconnexion
    updateProfile,  // Fonction de mise à jour du profil
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
