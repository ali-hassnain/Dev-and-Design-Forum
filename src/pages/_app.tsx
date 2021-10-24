import { AppProps } from "next/app";
import "../styles/tailwind.css";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import "../styles/icons.css";
import { AppProvider } from "../components/Context";

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);
  return (
    <AppProvider>
      {" "}
      {!authRoute && <Navbar />}
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default App;
