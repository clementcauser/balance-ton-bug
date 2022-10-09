import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const onUserCreate = functions.auth.user().onCreate((user) => {
  admin.firestore().collection("users").doc(user.uid).set({
    email: user.email,
    displayName: user.displayName,
    avatarURL: user.photoURL,
  });
});

const onUserDelete = functions.auth.user().onDelete((user) => {
  const userToRemove = admin.firestore().collection("users").doc(user.uid);

  return userToRemove.delete();
});

export default { onUserCreate, onUserDelete };
