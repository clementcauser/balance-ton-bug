import { firebaseAuth } from "configuration/firebase";
import { protectedRoutes, Routes } from "constants/routes";
import { setUser } from "features/auth";
import { useAuth } from "features/auth/useAuth";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";
import { useAppDispatch } from "store";

const AuthGate = ({ children }: PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const { replace, pathname } = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      dispatch(setUser(user));
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (!user && protectedRoutes.includes(pathname as Routes)) {
      replace(Routes.LOGIN);
    }
  }, [user, pathname, replace]);

  return <>{children}</>;
};

export default AuthGate;
