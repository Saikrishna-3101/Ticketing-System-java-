'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { token, user } = useAuth();

  useEffect(() => {
    if (token === undefined) return; // wait for hydration

    if (token && user) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [token, user, router]);

  return (
    <div style={{ padding: 20 }}>
      Redirecting...
    </div>
  );
}
