import { JSX, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '../stores/useStore';
import { fetchTasks } from '../api/api';
const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const router = useRouter();
    const isLoggedIn = useStore((state) => state.isLoggedIn);
    const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetchTasks();
          if (response.status == 200) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            router.push('/auth/login');
          }
        } catch (error) {
          setIsLoggedIn(false);
          router.push('/auth/login');
        }
      };
      checkAuth();
    }, [router, setIsLoggedIn]);

    return isLoggedIn ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;