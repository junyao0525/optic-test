import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_API_KEY || "";

console.log(SUPABASE_URL, SUPABASE_KEY);

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error(
    "Supabase URL or API key is missing in environment variables."
  );
}

// Initialize the Supabase client with environment variables
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
