import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import classNames from "classnames";
import { useGlobalContext } from "../../../../components/Context";
import ActionButton from "../../../../components/ActionButton";
import { FormEvent, useState } from "react";
import Axios from "axios";

dayjs.extend(relativeTime);

function PostPage({
  userVote,
  voteScore,
  title,
  subName,
  created_at,
  updated_at,
  body,
  username,
  url,
  commentCount,
}) {
  const { isLoggedIn } = useGlobalContext();
  {
    /*this will be used in voting section*/
  }
  const [newComment, setNewComment] = useState("");
  const router = useRouter();
  const { identifier, sub, slug } = router.query;
  console.log("router:", router.query);
  const { data: post, error } = useSWR(
    identifier && slug
      ? `http://localhost:1337/posts/?identifier=${identifier}&slug=${slug}`
      : null
  );
  console.log("post:", post);
  const { data: comments, revalidate } = useSWR(
    identifier
      ? `http://localhost:1337/comments/?post.identifier=${identifier}`
      : null
  );
  console.log("comments:", comments);
  //   if (comments) {
  //     for (let i = 0; i < comments.length; i++) {
  //       console.log("comments lines:", comments[i].comment);
  //     }
  //   }
  if (error) router.push("/");
  console.log("post:", post);
  //   console.log(post.id);

  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    if (newComment.trim() === "") return;
    try {
      const response = await Axios.post(
        `http://localhost:1337/comments/?post.identifier=${identifier}`,
        {
          comment: newComment,
          post: post[0].id,
          user: isLoggedIn.id,
        }
      );
      setNewComment("");
      revalidate();
      console.log("response:", response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>
          {post && post[0] ? post[0]?.title : <>Dev and Design Forum</>}
        </title>
      </Head>
      {post && post[0] ? (
        <Link href={`/r/${post[0].subName}`}>
          <a>
            <div className="flex items-center w-full h-20 p-8 bg-blue-500">
              <div className="container flex">
                {post &&
                post[0] &&
                post[0].sub &&
                post[0].sub.ImageUrn &&
                post[0].sub.ImageUrn[0] &&
                post[0].sub.ImageUrn[0].url ? (
                  <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                    <Image
                      src={`http://localhost:1337${post[0].sub.ImageUrn[0].url}`}
                      height={(8 * 16) / 4}
                      width={(8 * 16) / 4}
                    ></Image>
                  </div>
                ) : (
                  <div>
                    <img
                      className="w-8 h-8 mr-2 overflow-hidden rounded-full"
                      src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                    ></img>
                  </div>
                )}
                <p className="text-xl font-bold text-white">{sub}</p>
              </div>
            </div>
          </a>
        </Link>
      ) : (
        ``
      )}
      <div className="container flex pt-5">
        {/* post */}
        <div className="w-200">
          <div className="bg-white rounded">
            {post && (
              <>
                <div className="flex">
                  {/* vote section */}
                  <div className="flex-shrink-0 w-10 py-2 text-center rounded-l ">
                    {/* upvote */}
                    <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500">
                      <i
                        className={classNames("icon-arrow-up", {
                          "text-red-500": userVote === 1,
                        })}
                      ></i>
                    </div>
                    <p className="text-xs font-bold">{voteScore}12</p>
                    {/* downvote */}
                    <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500">
                      <i
                        className={classNames("icon-arrow-down", {
                          "text-blue-500": userVote === -1,
                        })}
                      ></i>
                    </div>
                  </div>
                  {/* post data */}
                  <div className="py-2 pr-2">
                    <div className="flex items-center">
                      <p className="text-xs text-gray-500">
                        Posted by
                        {post && post[0] ? (
                          <Link href={`/r/${post[0].subName}`}>
                            <a className="mx-1 hover:underline">
                              {post[0].subName}
                            </a>
                          </Link>
                        ) : (
                          ""
                        )}
                        <Link href={`/r/${subName}/${identifier}/${slug}`}>
                          <a className="mx-1 hover:underline">
                            {dayjs(created_at).fromNow()}
                          </a>
                        </Link>
                      </p>
                    </div>
                    {/* post title */}
                    <h1 className="my-1 text-xl font-medium">
                      {post && post[0] ? post[0].title : <>No post</>}
                    </h1>
                    {/* post body */}
                    <p className="my-3 text-sm">
                      {post && post[0] ? post[0].body : <>No content</>}
                    </p>
                    <div className="flex">
                      {/* <Link href="/"> */}
                      <a>
                        <ActionButton>
                          <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                          <span className="font-bold">
                            {commentCount} comments
                          </span>
                        </ActionButton>
                      </a>
                      {/* </Link> */}
                      <ActionButton>
                        <i className="mr-1 fas fa-share fa-xs"></i>
                        <span className="font-bold">Share</span>
                      </ActionButton>
                      <ActionButton>
                        <i className="mr-1 fas fa-bookmark fa-xs"></i>
                        <span className="font-bold">Save</span>
                      </ActionButton>
                    </div>
                  </div>
                </div>
                <div>
                  {/* Comment input area */}
                  <div className="pl-10 pr-6 mb-4">
                    {isLoggedIn.loggedIn && !isLoggedIn.loading ? (
                      <div>
                        <p className="mb-1 text-xs">
                          Comment as{" "}
                          <Link href={`/r/${isLoggedIn.username}`}>
                            <a className="font-semibold text-blue-500">
                              {isLoggedIn.username}
                            </a>
                          </Link>
                        </p>
                        <form onSubmit={submitComment}>
                          <textarea
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                            onChange={(e) => setNewComment(e.target.value)}
                            value={newComment}
                          ></textarea>
                          <div className="flex justify-end">
                            <button
                              className="px-3 py-1 blue button"
                              disabled={newComment.trim() === ""}
                            >
                              comment
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                        <p className="font-semibold text-gray-400">
                          Log in or Sign Up to leave a comment
                        </p>
                        <div>
                          <Link href="/login">
                            <a className="px-4 py-1 mr-4 hollow blue button">
                              Login
                            </a>
                          </Link>
                          <Link href="/register">
                            <a className="px-4 py-1 blue button">Sign up</a>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* comments feed */}
                  <hr />
                  {comments ? (
                    comments.map((comment) => (
                      <div className="flex" key={comment.id}>
                        {/* vote section */}
                        <div className="flex-shrink-0 w-10 py-2 text-center rounded-l ">
                          {/* upvote */}
                          <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500">
                            <i
                              className={classNames("icon-arrow-up", {
                                "text-red-500": userVote === 1,
                              })}
                            ></i>
                          </div>
                          <p className="text-xs font-bold">{voteScore}12</p>
                          {/* downvote */}
                          <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500">
                            <i
                              className={classNames("icon-arrow-down", {
                                "text-blue-500": userVote === -1,
                              })}
                            ></i>
                          </div>
                        </div>
                        <div className="py-2 pr-2">
                          <p className="mb-1 text-xs leading-none">
                            <Link href="/">
                              <a className="mr-1 font-bold hover:underline">
                                {comments ? comment.user.username : null}
                              </a>
                            </Link>
                            <span className="text-gray-600">
                              {`
                                        ${comment.voteScore}
                                        5 likes •
                                        ${dayjs(comment.created_at).fromNow()}
                                    `}
                            </span>
                          </p>
                          <p className="">
                            {comments ? comment.comment : null}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <h1>No comments posted</h1>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        {/* sidebar */}
      </div>
    </>
  );
}

export default PostPage;
