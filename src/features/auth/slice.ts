import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import { firebaseAuth, googleProvider } from "configuration/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { IUser } from "interfaces";
import { RootState } from "store";
import { transformFirebaseUserIntoIUser } from "utils";

type AuthState = {
  user: IUser | null;
  isLoading: boolean;
  error: SerializedError | null;
};

type AuthPayload = {
  email: string;
  password: string;
};

const logInWithEmailAndPassword = createAsyncThunk(
  "auth/signUpWithEmailAndPassword",
  async ({ email, password }: AuthPayload) => {
    const results = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    const user = results.user;

    return { user };
  }
);

const registerWithEmailAndPassword = createAsyncThunk(
  "auth/signInWithEmailAndPassword",
  async ({ email, password }: AuthPayload) =>
    signInWithEmailAndPassword(firebaseAuth, email, password)
);

const logOut = createAsyncThunk("auth/signOut", async () =>
  signOut(firebaseAuth)
);

const signInWithGoogle = createAsyncThunk("auth/signInWithGoogle", async () => {
  const results = await signInWithPopup(firebaseAuth, googleProvider);
  const credentials = GoogleAuthProvider.credentialFromResult(results);
  const token = credentials?.accessToken;
  const userInfo = results.user;

  return {
    token,
    user: userInfo,
  };
});

export const authThunks = {
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logOut,
};

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      if (action.payload) {
        return {
          ...state,
          user: transformFirebaseUserIntoIUser(action.payload),
        };
      } else {
        return { ...state, user: null };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logInWithEmailAndPassword.pending, (state) => {
        state = {
          ...state,
          isLoading: true,
          error: null,
        };
      })
      .addCase(logInWithEmailAndPassword.fulfilled, (state, { payload }) => {
        state = {
          ...state,
          error: null,
          isLoading: false,
          user: transformFirebaseUserIntoIUser(payload.user),
        };
      })
      .addCase(logInWithEmailAndPassword.rejected, (state, { error }) => {
        state = {
          ...state,
          user: null,
          isLoading: false,
          error,
        };
      })
      .addCase(registerWithEmailAndPassword.pending, (state) => {
        state = { ...state, isLoading: true, error: null };
      })
      .addCase(registerWithEmailAndPassword.fulfilled, (state) => {
        state = {
          ...state,
          error: null,
          isLoading: false,
        };
      })
      .addCase(registerWithEmailAndPassword.rejected, (state, { error }) => {
        state = {
          ...state,
          error,
          isLoading: false,
          user: null,
        };
      })
      .addCase(logOut.pending, (state) => {
        state = { ...state, isLoading: true, error: null };
      })
      .addCase(logOut.fulfilled, (state) => {
        state = {
          user: null,
          isLoading: false,
          error: null,
        };
      })
      .addCase(logOut.rejected, (state, { error }) => {
        state = { ...state, error, isLoading: false };
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state = {
          error: null,
          isLoading: false,
          user: transformFirebaseUserIntoIUser(action.payload.user),
        };
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state = { ...state, isLoading: true, error: null };
      })
      .addCase(signInWithGoogle.rejected, (state, { error }) => {
        state = { ...state, error, isLoading: false };
      });
  },
});

// reducer
export const authReducer = authSlice.reducer;
// actions
export const { setUser } = authSlice.actions;
// selectors
export const selectAuthenticatedUser = ({ auth }: RootState) => auth.user;
export const selectAuthIsLoading = ({ auth }: RootState) => auth.isLoading;
