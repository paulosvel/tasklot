import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '../stores/useStore';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const isLoggedIn = useStore((state) => state.isLoggedIn);
    const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
      } else {
        setIsLoggedIn(true);
      }
    }, [router, setIsLoggedIn]);

    return isLoggedIn ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;