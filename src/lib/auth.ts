// lib/auth.ts
import { supabase } from './supabaseClient';

export const signInWithEmail = async (email: string, password: string) => {
  const { user, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('Sign-in error:', error.message);
    throw new Error(error.message); // Throw error to handle in the UI
  }
  return user;
};

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  if (error) {
    console.error('Google sign-in error:', error.message);
    throw new Error(error.message); // Throw error to handle in the UI
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign-out error:', error.message);
    throw new Error(error.message); // Throw error to handle in the UI
  }
};

export const signUpWithEmail = async (email: string, password: string, username: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  // Store additional user information (like username) in your database
  const { error: profileError } = await supabase
    .from('profiles') // Ensure this table exists
    .insert([{ id: data.user.id, username }]);

  if (profileError) {
    throw new Error(profileError.message);
  }

  return data.user; // Return the user object
};
