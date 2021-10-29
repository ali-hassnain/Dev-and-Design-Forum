import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Axios from "axios";
import { useRouter } from "next/router";
import InputGroup from "../components/InputGroup";
import { useGlobalContext } from "../components/Context";

export default function Home() {
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

    if (email.length < 1) {
      setError({ ...error, email: "Please enter valid email id." });
      console.log("email:", error.email);
      return;
    }
    if (username.length < 3) {
      setError({
        ...error,
        username: " username must be at least 3 characters.",
        email: null,
      });
      return;
    }

    if (password.length < 6) {
      setError({
        ...error,
        password: "Password should be at least 6 characters.",
        username: null,
      });
      return;
    }
    if (!agree) {
      setError({
        ...error,
        agreement: "You must agree to the Terms and Conditions.",
        password: null,
      });
      console.log("agreement:", error.agreement);
      return;
    }

    try {
      setError({
        email: null,
        password: null,
        username: null,
        agreement: null,
        alreadyUser: null,
      });
      setUsername(username.trim());
      const res = await Axios.post(
        "http://localhost:1337/auth/local/register",
        {
          email,
          password,
          username,
        }
      );
      router.push("/login");
      console.log(res.data);
    } catch (err) {
      console.log(
        "strapi error:",
        err.response.data.message[0].messages[0].message
      );
      setError({
        ...error,
        alreadyUser: err.response.data.message[0].messages[0].message,
        email: null,
        password: null,
        username: null,
        agreement: null,
      });
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>register</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
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
          <h1 className="mb-2 text-lg font-medium">Sign up</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy
          </p>
          <form onSubmit={submitForm}>
            <div className="mb-6">
              <input
                type="checkbox"
                className="mr-1 cursor-pointer"
                id="agreement"
                checked={agree}
                onChange={(e) => {
                  setAgree(e.target.checked);
                }}
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                I agree to get emails about cool stuff on Dev and Design forum.
              </label>
              <small className="block font-medium text-red-600">
                {error.agreement}
              </small>
            </div>
            <InputGroup
              className="mb-2"
              value={email}
              setValue={setEmail}
              placeholder="Email"
              error={error.email}
              type="email"
            />
            <InputGroup
              className="mb-2"
              value={username}
              setValue={setUsername}
              placeholder="Username"
              error={error.username}
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
              Sign up
            </button>
            <small className="block font-medium text-red-600">
              {error.alreadyUser}
            </small>
          </form>
          <small>
            Already a user?{" "}
            <Link href="/login">
              <a className="ml-1 text-blue-500 ">Log in.</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
