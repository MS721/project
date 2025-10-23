import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://twnpddkqfniiirohpkok.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3bnBkZGtxZm5paWlyb2hwa29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTQxNTcsImV4cCI6MjA3NDk3MDE1N30.7bCBYhZal0PIi0X0yR5XtO8au1yvj-f9zCbq2SjU2KQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
