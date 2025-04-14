import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

const withAdminAuth = (WrappedComponent) => {
  return function WithAdminAuthComponent(props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAdminAuth = () => {
        const token = localStorage.getItem('adminToken');
        if (!token || isTokenExpired(token)) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('admin');
          router.push("/components/admin/login");
          return;
        }
        setIsLoading(false);
      };

      checkAdminAuth();
    }, [router]);

    if (isLoading) {
      return <CircularProgress />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;