/**
 * Configuration du client Supabase
 *
 * Ce fichier initialise le client Supabase utilisé dans toute l'application pour :
 * - L'authentification des utilisateurs
 * - Les requêtes à la base de données
 * - Le stockage de fichiers
 * - Les subscriptions en temps réel
 *
 * Les variables d'environnement sont chargées depuis .env :
 * - VITE_SUPABASE_URL : URL du projet Supabase
 * - VITE_SUPABASE_ANON_KEY : Clé publique anonyme
 */

import { createClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Création et export du client Supabase (singleton)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
