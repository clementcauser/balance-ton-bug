import AuthGate from "components/auth/AuthGate";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "store";
import "../../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthGate>
        <Component {...pageProps} />
      </AuthGate>
    </Provider>
  );
}

export default MyApp;
