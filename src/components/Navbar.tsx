import Link from "next/link";
import { useGlobalContext } from "./Context";
import { useEffect } from "react";

const Navbar: React.FC = () => {
  const { isLoggedIn } = useGlobalContext();

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white ">
      <div className="flex item-center">
        <Link href="/">
          <img
            className="w-8 h-8 mr-2"
            src="https://images.pexels.com/photos/9697460/pexels-photo-9697460.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            // src="Frontend/dev-and-design/src/images/dev-des logo.png"
            alt="Dev and Design forum"
          ></img>
        </Link>
        <span className="text-2xl font-semibold ">
          <Link href="/">Dev & Design Forum</Link>
        </span>
      </div>
      <div className="flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
        <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
        <input
          placeholder="search"
          type="text"
          className="py-1 pr-3 bg-transparent rounded w-160 focus:outline-none"
        ></input>
      </div>
      <div className="flex">
        {!isLoggedIn.loading &&
          (isLoggedIn.loggedIn ? (
            <button
              onClick={console.log(localStorage.removeItem("token"))}
              className="w-32 py-1 mr-4 leading-5 hollow blue button"
            >
              Log out
            </button>
          ) : (
            <Link href="/login">
              <a className="w-32 py-1 mr-4 leading-5 hollow blue button">
                Log in
              </a>
            </Link>
          ))}
        {!isLoggedIn.loading &&
          (isLoggedIn.loggedIn ? (
            <>
              <i className="w-12 py-1 mr-4 leading-5 rounded-full fas fa-user blue button"></i>
            </>
          ) : (
            <Link href="/register">
              <a className="w-32 py-1 leading-5 blue button">Sign up</a>
            </Link>
          ))}
      </div>
    </div>
  );
};
export default Navbar;