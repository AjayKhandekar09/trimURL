
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
// const supabase = createClient(supabaseUrl, supabaseKey, {
//     auth: {
//       persistSession: true, // Enable session persistence
//     }
//   });
  

export default supabase
        