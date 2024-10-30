import { JSX, useEffect } from "react";
import { useRouter } from "next/router";

const withAuth = (WrappedComponent: JSX.IntrinsicAttributes) => {
  return (props: JSX.IntrinsicAttributes) => {
    const router = useRouter();
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;