// lib/auth.ts
import { supabase } from './supabaseClient';

export const signInWithEmail = async (email: string, password: string) => {
  const { user, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('Sign-in error:', error.message);
    return { error }; // Return the error object
  }
  return { user }; // Return the user object
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

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  console.log(data);
  console.log(error);
  if (error) {
    throw new Error(error.message);

  }

  const { error: profileError } = await supabase
    .from('users') // Ensure this table exists
    .insert([{ id: data.user?.id, email }]);

  if (profileError) {
    throw new Error(profileError.message);
  }

  return data.user; // Return the user object
};
