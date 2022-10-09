import { useAppDispatch, useAppSelector } from "store";
import {
  authThunks,
  selectAuthenticatedUser,
  selectAuthIsLoading,
} from "./slice";

export const useAuth = () => {
  const authUser = useAppSelector(selectAuthenticatedUser);
  const authLoading = useAppSelector(selectAuthIsLoading);
  const dispatch = useAppDispatch();

  return {
    user: authUser,
    isLoading: authLoading,
    logout: () => dispatch(authThunks.logOut()),
    register: {
      withEmailAndPassword: (email: string, password: string) =>
        dispatch(authThunks.registerWithEmailAndPassword({ email, password })),
    },
    login: {
      withEmailAndPassword: (email: string, password: string) =>
        dispatch(authThunks.logInWithEmailAndPassword({ email, password })),
    },
  };
};
