import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setSession, setLoading } = useAuthStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setLoading]);

  return <>{children}</>;
}

export function useSession(): Session | null {
  const session = useAuthStore((state) => state.session);
  return session;
}

export function useUser() {
  const user = useAuthStore((state) => state.user);
  return user;
}

export function useAuthLoading() {
  const isLoading = useAuthStore((state) => state.isLoading);
  return isLoading;
} 