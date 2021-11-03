import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import classNames from "classnames";
import ActionButton from "./ActionButton";
import useSWR from "swr";

dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
}

export default function PostCard({
  post: {
    identifier,
    title,
    slug,
    subName,
    created_at,
    body,
    username,
    url,
    voteScore,
    commentCount,
    userVote,
  },
}: PostCardProps) {
  const { data: image } = useSWR(
    `http://localhost:1337/subs/?posts.identifier=${identifier}`
  );
  let imageUrl;
  if (image && image[0] && image[0].ImageUrn && image[0].ImageUrn[0]) {
    imageUrl = image[0].ImageUrn[0].url;
  }
  // console.log("imageUrl:", imageUrl);
  // console.log("image:", image);
  return (
    <div
      key={identifier}
      id={identifier}
      className="flex mb-4 bg-white rounded "
    >
      {/* Vote Section */}
      <div className="w-10 py-3 text-center bg-gray-200 rounded-l ">
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
      {/* Post Data Section  */}
      <div className="w-full p-2">
        <div className="flex items-center">
          <Link href={`/r/${subName}`}>
            {imageUrl ? (
              <img
                src={`http://localhost:1337${imageUrl}`}
                className="w-8 h-8 mr-1 rounded-full cursor-pointer"
              ></img>
            ) : (
              <img
                src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                className="w-8 h-8 mr-1 rounded-full cursor-pointer"
              ></img>
            )}
          </Link>
          <Link href={`/r/${subName}`}>
            <a className="text-xs font-bold hover:underline ">{subName}</a>
          </Link>

          <p className="text-xs text-gray-500">
            <span className="mx-1">•</span> Posted by
            <Link href={`/r/${subName}`}>
              <a className="mx-1 hover:underline">{subName}</a>
            </Link>
            <Link href={`/r/${subName}/${identifier}/${slug}`}>
              <a className="mx-1 hover:underline">
                {dayjs(created_at).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={`/r/${subName}/${identifier}/${slug}`}>
          <div className="my-1 text-lg font-medium cursor-pointer">{title}</div>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}
        <div className="flex">
          <Link href={`/r/${subName}/${identifier}/${slug}`}>
            <a>
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">{commentCount} comments</span>
              </ActionButton>
            </a>
          </Link>
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
  );
}
