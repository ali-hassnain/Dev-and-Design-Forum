import Link from "next/link";
import { useGlobalContext } from "./Context";
import useSWR from "swr";
import Image from "next/image";
import router from "next/router";
// import { useRouter } from "next/router";

const Navbar: React.FC = () => {
  // const router = useRouter();
  const { isLoggedIn, search, HandleSearchSubmit, HandleSearchInput } =
    useGlobalContext();
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
    // router.push("/login");
  };
  const profileLink = () => {
    router.push(`/r/${isLoggedIn.username}`);
  };
  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 bg-white ">
      <div className="flex item-center">
        <Link href="/">
          {/* <img
            className="w-8 h-8 mr-2 cursor-pointer"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Eo_circle_blue_letter-d.svg/512px-Eo_circle_blue_letter-d.svg.png"
            // src="Frontend/dev-and-design/src/images/dev-des logo.png"
            alt="Dev and Design forum"
          ></img> */}
          <i className="w-8 h-8 mr-2 leading-6 text-blue-500 cursor-pointer stroke-current fas fa-code"></i>
        </Link>
        <span className="hidden text-2xl font-semibold text-blue-500 lg:block ">
          <Link href="/">Dev & Design Forum</Link>
        </span>
      </div>
      <div className="max-w-full px-4 w-160">
        <div className="relative flex items-center bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
          <i
            onClick={HandleSearchSubmit}
            className="px-3 text-gray-500 cursor-pointerpl-4 fas fa-search"
          ></i>
          <input
            placeholder="search"
            value={search.query}
            onChange={HandleSearchInput}
            type="text"
            className="py-1 pr-3 bg-transparent rounded focus:outline-none"
          ></input>
          <div
            className="absolute left-0 right-0 bg-white"
            style={{ top: "100%" }}
          >
            {/* {post &&
          post[0] &&
          post[0].sub &&
          post[0].sub.ImageUrn &&
          post[0].sub.ImageUrn[0]
            ? post.map((postOwner) => (
                <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200 ">
                  <Image
                    // src={`http://localhost:1337${postOwner.sub.ImageUrn[0].url}`}
                    src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                    alt="post"
                    className="rounded-full"
                    height={(8 * 16) / 4}
                    width={(8 * 16) / 4}
                  ></Image>
                  <div className="text-sm">
                    <p className="font-medium">
                      {post && post[0]
                        ? post?.map((postOwner) => {
                            postOwner.title;
                          })
                        : ``}
                    </p>
                  </div>
                </div>
              ))
            : ``} */}
          </div>
        </div>
      </div>
      <div className="flex">
        {!isLoggedIn.loading &&
          (isLoggedIn.loggedIn ? (
            <button
              onClick={logout}
              className="w-20 py-1 mr-4 leading-5 lg:w-32 hollow blue button"
            >
              Log out
            </button>
          ) : (
            <Link href="/login">
              <a className="hidden w-20 py-1 mr-4 leading-5 sm:block lg:w-32 hollow blue button">
                Log in
              </a>
            </Link>
          ))}
        {!isLoggedIn.loading &&
          (isLoggedIn.loggedIn ? (
            <>
              <i
                onClick={profileLink}
                className="w-12 py-1 mr-4 leading-5 rounded-full cursor-pointer fas fa-user blue button"
              ></i>
            </>
          ) : (
            <Link href="/register">
              <a className="hidden w-20 py-1 leading-5 sm:block lg:w-32 blue button">
                Sign up
              </a>
            </Link>
          ))}
      </div>
    </div>
  );
};
export default Navbar;
