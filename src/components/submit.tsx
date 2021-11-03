import React, { FormEvent } from "react";
import { useState } from "react";
import Axios from "axios";
import router from "next/router";
import { useGlobalContext } from "./Context";
import useSWR from "swr";
import { GetServerSideProps } from "next";

export default function Submit() {
  const { isLoggedIn } = useGlobalContext();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  let identifier =
    Date.now().toString(36) + Math.random().toString(36).substr(2);
  // console.log("identifier:", identifier);

  let url = "dev&desforum";
  let slug = isLoggedIn.username;
  // console.log("slug:", slug);

  const { data: sub, error } = useSWR(
    `http://localhost:1337/subs/?user.username=${isLoggedIn.username}`
  );
  // console.log("sub:", sub);
  const submitPost = async (event: FormEvent) => {
    event.preventDefault();
    if (title.trim() === "") return;
    // console.log("IDDDD:", sub[0].id);
    try {
      if (sub && sub[0]) {
        const { data: post } = await Axios.post("http://localhost:1337/posts", {
          title: title.trim(),
          body,
          identifier,
          url,
          user: isLoggedIn.id,
          subName: isLoggedIn.username,
          sub: sub[0].id,
          slug: `${slug.trim()}=post`,
        });
      }
      setTitle("");
      setBody("");
      // console.log(post);
      router.push(
        `/r/${isLoggedIn.username}/${identifier}/${isLoggedIn.username}=post`
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container flex pt-5">
      <div className="w-full">
        <div className="p-4 bg-white rounded">
          <h1 className="mb-3 text-lg font-semibold text-gray-500">
            Submit your thoughts on Dev and Design Forum
          </h1>
          <form onSubmit={submitPost}>
            <div className="relative mb-2">
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                placeholder="Title"
                maxLength={300}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div
                className="absolute mb-2 text-sm text-gray-500 select-none"
                style={{ top: 11, right: 10 }}
              >
                {title.trim().length}/300
              </div>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Text (optional)"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
            ></textarea>
            <div className="flex justify-end">
              <button
                className="px-3 py-1 blue button"
                type="submit"
                disabled={title.trim().length === 0}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) throw new Error("Missing auth token token");
//     await Axios.get("http://localhost:1337/users/me", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     return { props: {} };
//   } catch (error) {
//     res.writeHead(307, { location: "/login" }).end();
//   }
// };
