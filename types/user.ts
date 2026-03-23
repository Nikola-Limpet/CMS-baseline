export type UserProfile = {
  id: string; // Corresponds to Supabase auth.users.id
  full_name?: string;
  role: 'student' | 'admin';
  bio?: string;
  avatar_url?: string;
  created_at?: string; // Supabase often returns this as string, ensure to parse if using as Date
};
