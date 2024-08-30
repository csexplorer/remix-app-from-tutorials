import { supabase } from "~/services/supabase.server";

export const createUserApi = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const response = await supabase.auth.signUp({
    email,
    password,
  });
  return response;
};

export const loginUserApi = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return response;
};
