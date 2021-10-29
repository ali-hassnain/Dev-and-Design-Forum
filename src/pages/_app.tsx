import { AppProps } from "next/app";
import "../styles/tailwind.css";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import "../styles/icons.css";
import { AppProvider } from "../components/Context";
import Axios from "axios";
import { SWRConfig } from "swr";

function App({ Component, pageProps }: AppProps) {
  const fetcher = async (url: string) => {
    try {
      const response = await Axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];

  const authRoute = authRoutes.includes(pathname);
  return (
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: 10000,
      }}
    >
      <AppProvider>
        {!authRoute && <Navbar />}
        <div className={authRoute ? null : "pt-12"}>
          <Component {...pageProps} />
        </div>
      </AppProvider>
    </SWRConfig>
  );
}

export default App;
