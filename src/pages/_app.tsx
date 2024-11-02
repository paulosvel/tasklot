import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function App({ Component, pageProps }: AppProps) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.getSession();
    setCurrentUser(session.user);

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setCurrentUser(session?.user);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return <Component {...pageProps} currentUser={currentUser} />;
}