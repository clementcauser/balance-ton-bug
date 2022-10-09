import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authReducer } from "features/auth";
import { PersistConfig, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// all reducer names we want to persist in local storage
const whiteList = ["auth"];

const persistConfig = {
  key: "@balance-ton-bug",
  storage,
  whiteList,
};

const reducers = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: { users: UsersState}
type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
