import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your actual Supabase project URL and anon key
const supabaseUrl = 'https://bltyyhpdmkkzddumbzju.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsdHl5aHBkbWtremRkdW1iemp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NDc5NzQsImV4cCI6MjA5MDQyMzk3NH0.fyHCnyfOzAcC3yOfZI3LT4WNfBxttx9niYOYQxFRwx4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
