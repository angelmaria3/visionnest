import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fxhehvrungfdrgxirfsq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4aGVodnJ1bmdmZHJneGlyZnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5OTI5MjEsImV4cCI6MjA4NjU2ODkyMX0.6tmqj0_R4OHehUppJB9Ws4q_0ABA07H1C0dKvsr1pA8";

export const supabase = createClient(supabaseUrl, supabaseKey);
