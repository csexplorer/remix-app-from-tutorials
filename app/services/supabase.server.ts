import { createClient } from "@supabase/supabase-js";
import { getEnv } from "~/config/environment";

export const supabaseUrl = getEnv(process.env).supabaseUrl;

const supabaseKey = getEnv(process.env).supabaseKey;

export const supabase = createClient(supabaseUrl, supabaseKey);
