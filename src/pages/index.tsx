import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PostCard from "../components/PostCard";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import Submit from "../components/submit";
import { useGlobalContext } from "../components/Context";
import useSWRInfinite from "swr/infinite";

dayjs.extend(relativeTime);

export default function Home() {
  const { isLoggedIn } = useGlobalContext();
  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState([]);
  const { data: numberOfPosts } = useSWR("http://localhost:1337/posts/count");
  // console.log("numberOfPosts:", numberOfPosts);
  const [observedPost, setObservedPost] = useState("");
  const { data, error, isValidating, mutate, size, setSize } = useSWRInfinite(
    () =>
      `http://localhost:1337/posts?_start=${
        size - 1
      }&_limit=5&_sort=created_at:DESC`
  );
  console.log("size1:", size);
  const post = data ? [].concat(...data) : [];
  const isInitialLoading = !data && !error;
  // const !isLoadingInitialData = !data && !error

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const url = "http://localhost:1337/posts";
  //     const queryParams = new URLSearchParams(window.location.search);
  //     let query = queryParams.get("query");
  //     try {
  //       const response = await fetch(url);
  //       const json = await response.json();

  //       if (query) {
  //         console.log("json:", json);
  //         console.log("query:", query);
  //         query = query.toLowerCase();
  //         const filteredData = json.filter((elem) => {
  //           const title = elem.title.toLowerCase();
  //           const body = elem.body.toLowerCase();
  //           const subName = elem.subName.toLowerCase();
  //           console.log("filteredData:", filteredData);
  //           if (
  //             title.indexOf(query) > -1 ||
  //             body.indexOf(query) > -1 ||
  //             subName.indexOf(query) > -1
  //           ) {
  //             console.log(elem);
  //             return elem;
  //           }
  //         });
  //         setData(filteredData);
  //       } else {
  //         setData(json);
  //         console.log("json:", json);
  //       }
  //       setLoading(false);
  //       console.log(data);
  //     } catch (error) {
  //       console.log(error);
  //       setError(error);
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // const { data: post } = useSWR(
  //   "http://localhost:1337/posts/?_sort=created_at:DESC"
  // );
  // console.log("post:", post);
  // const { data: post } = useSWR(
  //   "http://localhost:1337/posts/?_sort=created_at:DESC"
  // );
  console.log("post1:", post);
  const observeElement = (element: HTMLElement) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log("reached bottom of the page");
          setSize(size + 6);
          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );
    observer.observe(element);
    console.log("element:", element);
  };

  useEffect(() => {
    if (!post || post.length === 0) return;
    const id = post[post.length - 1].identifier;
    console.log("id:", id);
    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [post]);

  const { data: topPostOwners } = useSWR("http://localhost:1337/subs");
  // console.log("topPostOwners:", topPostOwners);
  // for (let i = 0; i < topPostOwners.length; i++) {
  //   let user =
  //     // console.log(
  //     topPostOwners[i].user.username;
  //   // )
  // }
  // for (let j = 0; j < topPostOwners.length; j++) {
  //   let count =
  //     // console.log(
  //     topPostOwners[j].posts.length;
  //   // )
  // }

  // // return
  // console.log({ user: count });

  // const [post, setPost] = useState<Post[]>([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const url = "http://localhost:1337/posts";
  //     try {
  //       const response = await fetch(url);
  //       const json = await response.json();
  //       setPost(json);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <Fragment>
      <Head>
        <title>Dev and Design Forum</title>
        <meta
          name="Discussion forum for all the developers and designers"
          content=""
        />
        <link rel="" href="" />
      </Head>
      {isLoggedIn.loggedIn && !isLoggedIn.loading ? (
        <div>
          <Submit />
        </div>
      ) : (
        <div className="py-5 text-center border border-gray-200 rounded ">
          <p className="font-semibold text-red-500">
            Please, log in or Sign Up to create a post.
          </p>
          <div></div>
        </div>
      )}

      <div className="container flex pt-4">
        {/* post feed */}

        <div className="w-full px-4 md:w-160 md:p-0">
          {isInitialLoading && <p className="text-lg text-center">Loading..</p>}
          {post?.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
          {isValidating && post.length > 0 && (
            <p className="text-lg text-center">Loading More..</p>
          )}
        </div>
        {/* side bar */}
        <div className="hidden ml-6 md:block w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Posts made by
              </p>
            </div>
            <div>
              {topPostOwners && topPostOwners.length > 0 ? (
                <div className="flex items-center px-4 py-2 text-xs border-b ">
                  <Link href="#">
                    <a>
                      <Image
                        src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                        alt="img"
                        className="rounded-full cursor-pointer "
                        width={(6 * 16) / 4}
                        height={(6 * 16) / 4}
                      />
                    </a>
                  </Link>

                  <Link href="#">
                    <a className="ml-2 font-bold hover:cursor-pointer">naino</a>
                  </Link>
                  <p className="ml-auto font-medium">{/* "postCount" */} 5</p>
                  {/* {topPostOwners.map((post) => {
                    post.user.map((postOwner) => {
                      postOwner.username;
                    });
                  })} */}
                </div>
              ) : (
                <h1>No top users</h1>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const res = await Axios.get("");

//     return { props: { Posts: res.data } };
//   } catch (error) {
//     return { props: { error: "Something went wrong" } };
//   }
// };
