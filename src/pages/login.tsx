import Head from "next/head";
import Link from "next/link";
import Axios from "axios";
import { useRouter } from "next/router";
import InputGroup from "../components/InputGroup";
import { useGlobalContext } from "../components/Context";

export default function Login() {
  const {
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
  } = useGlobalContext();

  const router = useRouter();

  if (isLoggedIn.loggedIn) router.push("/");

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        identifier: email || username,
        password: password,
      };
      // console.log(userData);
      const res = await Axios.post(
        "http://localhost:1337/auth/local",
        userData
      );
      const token = res.data.jwt;
      // console.log("token:", token);
      localStorage.setItem("token", token);
      window.location.href = "/";

      // router.push("/");
      // console.log("res.data:", res.data.jwt);
    } catch (err) {
      setError({
        ...error,
        email: null,
        password: null,
        userDetail: "Invalid credentials!",
      });
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>login</title>
        <meta
          name="dev and design forum"
          content="Generated by create next app"
        />
      </Head>
      <div
        className="h-screen bg-center bg-cover w-36"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1227511/pexels-photo-1227511.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')",
        }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-72">
          <h1 className="mb-2 text-lg font-medium">Login</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy
          </p>
          <form onSubmit={submitForm}>
            <InputGroup
              className="mb-2"
              value={email}
              setValue={setEmail}
              placeholder="Email or username"
              error={error.email}
              type="text"
            />

            <InputGroup
              className="mb-2"
              value={password}
              setValue={setPassword}
              placeholder="Password"
              error={error.password}
              type="password"
            />
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
              Login
            </button>
            <small className="block font-medium text-red-600">
              {error.userDetail}
            </small>
          </form>
          <small>
            New to dev and design forum?{" "}
            <Link href="/register">
              <a className="ml-1 text-blue-500 ">Sign up.</a>
            </Link>
            <Link href="#">
              <a className="block text-blue-500">Forgot password?</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
