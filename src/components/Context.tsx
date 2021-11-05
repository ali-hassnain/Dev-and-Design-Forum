import { useState, useContext, useEffect, createContext } from "react";
import axios from "axios";
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
  // const postRoutes = "/posts";
  // const subsRoutes = "/subs";
  const [search, setSearch] = useState({ query: null, category: null });
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

  const HandleSearchInput = (e) => {
    const query = e.target.value;
    setSearch({ ...search, query });
    console.log(query);
  };

  const HandleSearchSubmit = (e) => {
    e.preventDefault();
    const searchURL = `/posts?query=${search.query}`;
    window.location.href = searchURL;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const checkLogin = async () => {
        const response = await axios.get("http://localhost:1337/users/me", {
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
        search,
        setSearch,
        HandleSearchInput,
        HandleSearchSubmit,
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
