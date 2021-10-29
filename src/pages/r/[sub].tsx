import { useRouter } from "next/router";
import useSWR from "swr";
import PostCard from "../../components/PostCard";
import Head from "next/head";
import Image from "next/image";
import { createRef, Fragment, useState, useEffect, ChangeEvent } from "react";
import { useGlobalContext } from "../../components/Context";
import classNames from "classnames";
import Axios from "axios";

export default function Sub() {
  const { isLoggedIn } = useGlobalContext();
  const [ownSub, setOwnSub] = useState(false);
  const fileInputRef = createRef<HTMLInputElement>();
  const router = useRouter();
  console.log("router:", router);
  const subName = router.query.sub;
  console.log("subName:", subName);

  const openFileInput = (type: string) => {
    if (!ownSub) return;
    fileInputRef.current.name = type;
    fileInputRef.current.click();
  };
  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    // console.log("file:", file);
    const data = new FormData();
    data.append("file", file);
    data.append("file", fileInputRef.current.name);
    // console.log("data:", FormData);

    try {
      await Axios.post("http://localhost:1337/upload", data);
      revalidate();
    } catch (error) {
      console.log(error);
    }
  };

  const { data: postOwner } = useSWR(
    `http://localhost:1337/subs?user.username=${subName}`
  );
  // console.log("postOwner:", postOwner[0].posts);

  const {
    data: userPost,
    error,
    revalidate,
  } = useSWR(`http://localhost:1337/posts/?subName=${subName}`);
  console.log("userpost:", userPost);

  if (userPost) {
    // console.log("sub:", sub[0].user.username);
    console.log("isLoggedIn.username:", isLoggedIn.username);
  }

  console.log("error:", error);
  // ${subName}` : null);

  if (error) {
    router.push("/");
  }

  // let postsMarkup;
  // if (userPost) {
  //   postsMarkup = <p className="text-center text-lg-bold">Loading..</p>;
  // } else if (userPost.length === 0) {
  //   postsMarkup = <p className="text-lg text-center">No posts submitted yet</p>;
  // }
  // let title;
  // if (userPost) {
  //   title = userPost[0].title;
  //   console.log("title:", title);
  // }
  useEffect(() => {
    if (!userPost) return;
    setOwnSub(
      isLoggedIn.loggedIn && isLoggedIn.username === userPost[0].user.username
    );
  }, [userPost]);

  return (
    <div>
      <Head>
        <title>
          {postOwner && postOwner[0] ? (
            postOwner[0].title
          ) : (
            <>Dev and Design Forum</>
          )}
        </title>
      </Head>
      <Fragment>
        <input
          type="file"
          name="files"
          hidden={true}
          ref={fileInputRef}
          onChange={uploadImage}
        />
        <div>
          {/* Banner image */}

          <div className="bg-blue-500 ">
            {postOwner && postOwner[0] ? (
              <div
                className={classNames("h-56 bg-blue-500 ", {
                  "cursor-pointer": ownSub,
                })}
                onClick={() => openFileInput("banner")}
                style={{
                  backgroundImage: `url(http://localhost:1337${postOwner[0].bannerUrn[0].url})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            ) : (
              <div
                className={classNames("h-56 bg-blue-500 ", {
                  "cursor-pointer": ownSub,
                })}
              ></div>
            )}
          </div>
          <div className="h-20 bg-white">
            <div className="container relative flex">
              <div className="absolute" style={{ top: -10 }}>
                {postOwner && postOwner[0] ? (
                  <Image
                    src={`http://localhost:1337${postOwner[0].ImageUrn[0].url}`}
                    alt={""}
                    className={classNames("rounded-full ring-4", {
                      "cursor-pointer": ownSub,
                    })}
                    onClick={() => openFileInput("image")}
                    width={87}
                    height={87}
                  />
                ) : (
                  <div>
                    <img
                      className={classNames("rounded-full ring-4", {
                        "cursor-pointer": ownSub,
                      })}
                      src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                    ></img>
                  </div>
                )}
              </div>
              <div className="pt-1 pl-24">
                <div className="flex items-center">
                  <h1 className="mb-1 text-3xl font-bold">
                    {postOwner && postOwner[0] ? postOwner[0].title : <>User</>}
                  </h1>
                </div>
                <p className="text-sm font-bold text-gray-500">
                  {postOwner && postOwner[0] ? (
                    postOwner[0].description
                  ) : (
                    <>No details</>
                  )}
                </p>
              </div>
            </div>
          </div>
          {/* sub-meta data */}
        </div>
      </Fragment>

      <div className="container pt-5">
        <div className="container pt-5">
          {postOwner && postOwner[0] && postOwner[0].posts ? (
            postOwner[0].posts?.map((post) => (
              <div>{<PostCard post={post} key={post.identifier} />}</div>
            ))
          ) : (
            <h1 className="text-center text-lg-bold">No posts yet to show</h1>
          )}
        </div>
      </div>
    </div>
  );
}
