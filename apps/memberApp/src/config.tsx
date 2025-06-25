import { BACKEND_API_URL, SUPABASE_ANON_KEY, SUPABASE_URL } from '@env'; // Ensure @env is properly configured in your project
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

export const BackendApiUrl = BACKEND_API_URL;
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// console.log(supabase);
