import { supabase } from './supabase';
import { hashPassword } from './auth';

export async function createAdminUser(email: string, password: string) {
  const passwordHash = await hashPassword(password);

  const { data, error } = await supabase
    .from('admin_users')
    .insert({
      email,
      password_hash: passwordHash,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
