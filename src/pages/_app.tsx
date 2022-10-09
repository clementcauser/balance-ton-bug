import AuthGate from "components/auth/AuthGate";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "store";
import "../../styles/globals.css";

const persistor = persistStore(store);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <AuthGate>
          <Component {...pageProps} />
        </AuthGate>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
