import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import Axios from "axios";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PostCard from "../components/PostCard";
import { Post } from "../types";

dayjs.extend(relativeTime);

export default function Home() {
  const [post, setPost] = useState<Post[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const url = "http://localhost:1337/posts";
      try {
        const response = await fetch(url);
        const json = await response.json();
        setPost(json);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="pt-12">
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
          {post.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
        {/* side bar */}
      </div>
    </div>
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
