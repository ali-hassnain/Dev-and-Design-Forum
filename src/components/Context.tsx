import { useState, useContext, useEffect, createContext } from "react";
import Axios from "axios";
import { useRouter } from "next/router";

const AppContext = createContext({
  username: null,
  email: null,
  id: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

const AppProvider = ({ children }) => {
  const { pathname } = useRouter();
  const postRoutes = "/posts";
  const subsRoutes = "/subs";
  const [isLoggedIn, setIsLoggedIn] = useState({
    loading: true,
    loggedIn: false,
    email: null,
    username: null,
    id: null,
  });

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState({
    email: null,
    password: null,
    username: null,
    agreement: null,
    alreadyUser: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const checkLogin = async () => {
        const response = await Axios.get("http://localhost:1337/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = response.data;
        // console.log("user:", user);
        try {
          setIsLoggedIn({
            ...isLoggedIn,
            loggedIn: true,
            email: user.email,
            username: user.username,
            loading: false,
            id: user.id,
          });
          setEmail(...email, user.email);
        } catch (error) {
          setIsLoggedIn({
            ...isLoggedIn,
            loading: false,
          });
          console.log(error);
        }
      };
      checkLogin();
      console.log("token:", token);
    } else {
      setIsLoggedIn({
        ...isLoggedIn,
        loading: false,
      });
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        email,
        setEmail,
        username,
        setUsername,
        password,
        setPassword,
        agree,
        setAgree,
        error,
        setError,
        isLoggedIn,
        setIsLoggedIn,
        postRoutes,
        subsRoutes,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useGlobalContext = () => {
  return useContext(AppContext);
};
export { AppContext, AppProvider };
function checkLogin() {
  throw new Error("Function not implemented.");
}
