import { User } from "firebase/auth";
import { IUser } from "interfaces";

export const transformFirebaseUserIntoIUser = (
  userFromFirebase: User
): IUser => {
  return {
    uid: userFromFirebase.uid,
    email: userFromFirebase.email!,
    avatarURL: userFromFirebase.photoURL,
    displayName: userFromFirebase.displayName,
  };
};
