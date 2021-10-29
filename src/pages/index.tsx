import Head from "next/head";
import { Fragment } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PostCard from "../components/PostCard";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";

dayjs.extend(relativeTime);

export default function Home() {
  const { data: post } = useSWR(
    "http://localhost:1337/posts/?_sort=created_at:DESC"
  );

  const { data: topPostOwners } = useSWR("http://localhost:1337/subs");
  console.log("topPostOwners:", topPostOwners);
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
      <div className="container flex pt-4">
        {/* post feed */}
        <div className="w-160">
          {post?.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
        {/* side bar */}
        <div className="ml-6 w-80">
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
                    <Image
                      src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                      alt="img"
                      className="rounded-full cursor-pointer "
                      width={(6 * 16) / 4}
                      height={(6 * 16) / 4}
                    />
                  </Link>

                  <Link href="#">
                    <a className="ml-2 font-bold hover:cursor-pointer">
                      naino
                    </a>
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
