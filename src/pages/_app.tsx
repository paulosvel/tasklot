import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {


  return <Component {...pageProps}/>;
}