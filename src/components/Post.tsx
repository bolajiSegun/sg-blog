import { Link } from "react-router-dom";
import { PostType } from "../types/types";
import useGetAUser from "../hooks/useGetAUser";

const Post = ({ data }: { data: PostType }) => {
  const updatedDate = new Date(data.updatedAt);
  const formattedDate = updatedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  /* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
  const { data: user, isLoading } = useGetAUser(data?.authorId!);
  if (isLoading) {
    return <LoadingUiSkeletons />;
  }

  return (
    <>
      <Link
        to={`/post/${data.slug}`}
        className="flex flex-col text-text-dark pt-6 px-6 md:px-4 hover:bg-[#f7f7f7] border-0 ring-inset focus:ring-text-light focus:ring-2 group active:bg-pri active:text-white"
      >
        <div className="text-sm flex items-center mb-2">
          <span className="mr-2">
            {user?.displayPhoto ? (
              <img
                src={user.displayPhoto}
                alt="profile pix"
                width="24"
                height="24"
                className="rounded-full aspect-square bg-[#ebe4e0] object-cover"
              />
            ) : (
              <span className="h-6 w-6 rounded-full text-white bg-purple-600 aspect-square font-bold leading-6 text-[12px] block text-center group-active:bg-white group-active:text-pri">
                {user?.username.slice(0, 2).toUpperCase()}
              </span>
            )}
          </span>
          <p className="capitalize">{user?.username}</p>
          <span className="mx-2 border border-black"></span>
          <span className="text-text-light group-active:text-white">
            {formattedDate}
          </span>
        </div>
        <div className="flex gap-4 md:gap-12">
          <div className="w-full">
            <p className="line-clamp-2 leading-5 font-bold w-full text-ellipsis h-fit md:mb-2">
              {data.title}
            </p>
            <p className="hidden md:!line-clamp-3 leading-6 text-ellipsis h-fit">
              {data.content.replace(/<[^>]+>/g, "")}
            </p>
          </div>
          <span className="flex-none">
            <img
              src={data.image}
              alt="post cover image"
              className="w-20 h-14 md:w-28 md:h-28 object-cover"
            />
          </span>
        </div>
        <div className="flex gap-2 items-center py-4 md:py-8">
          {data.tags.map((tag) => {
            if (tag.length > 0) {
              return (
                <span
                  key={Math.random() + tag + Math.random()}
                  className="inline-block py-[2px] rounded-full bg-gray-200 px-2 text-text-dark text-[0.8125rem]"
                >
                  {tag}
                </span>
              );
            }
          })}
        </div>
      </Link>
      <div className="w-full border group-focus:border-text-light"></div>
    </>
  );
};

const LoadingUiSkeletons = () => {
  return (
    <div className="flex flex-col animate-pulse pt-6 px-6 md:px-0">
      <div className="text-sm flex items-center mb-2">
        <span className="mr-2">
          <span className="h-6 w-6 rounded-full block bg-skeleton text-white font-bold leading-8 text-sm"></span>
        </span>
        <p className=" bg-skeleton w-36 h-4 rounded-md"></p>
        <span className="mx-2 border border-skeleton"></span>
        <span className="bg-skeleton w-32 h-4 rounded-md"></span>
      </div>
      <div className="flex gap-4 md:gap-12">
        <div className="w-full">
          <p className="bg-skeleton w-28 h-5 rounded-md md:mb-2"></p>
          <p className="bg-skeleton w-6/6 h-4 rounded-md mt-2"></p>
          <p className="bg-skeleton w-5/6 h-4 rounded-md mt-2"></p>
        </div>
        <span className="flex-none">
          <span className="w-20 h-14 md:w-28 md:h-28 block bg-skeleton"></span>
        </span>
      </div>
      <div className="flex gap-2 items-center py-4">
        <span className="bg-skeleton w-16 h-4 rounded-md"></span>
        <span className="bg-skeleton w-10 h-4 rounded-md"></span>
      </div>
      <div className="w-full border border-skeleton"></div>
    </div>
  );
};

export default Post;
