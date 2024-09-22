import { JSX, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '../stores/useStore';

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const router = useRouter();
    const isLoggedIn = useStore((state) => state.isLoggedIn);
    const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          await fetch('/users/me', { credentials: 'include' });
          setIsLoggedIn(true);
        } catch (error) {
          router.push('/auth/login');
        }
      };
      checkAuth();
    }, [router, setIsLoggedIn]);

    return isLoggedIn ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;