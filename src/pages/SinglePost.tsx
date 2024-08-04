import useGetAPost from "../hooks/useGetAPost";
import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import useGetAUser from "../hooks/useGetAUser";
import { AuthContext } from "../context/AuthContext";
import { AuthContextValue } from "../types/types";
import DeletePost from "../components/modals/DeletePost";
import Error from "../components/Error";
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

const SinglePost = () => {
  const { slug } = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const { data, isLoading, error } = useGetAPost(slug!);
  const { user } = useContext(AuthContext) as AuthContextValue;

  const { data: author } = useGetAUser(data?.authorId!);
  if (isLoading) {
    return <LoadingUiSkeletons />;
  }
  if (error) {
    return <Error />;
  }
  return (
    <>
      <Helmet>
        <title>{data?.title}</title>
      </Helmet>
      <section className="px-6 md:px-0">
        {data?.authorId === user?.id && (
          <div className="justify-end flex items-center gap-1">
            <Link
              to={`/post/${data?.slug}/edit`}
              className="px-3 py-1.5 rounded-md ring-1 ring-transparent ring-inset hover:underline hover:text-pri-hover focus:ring-2 focus:ring-pri-hover active:bg-pri active:text-white transition-all duration-300"
            >
              Edit
            </Link>
            <button
              className="px-3 py-1.5 rounded-md border-0 ring-1 text-red-300 ring-red-300 hover:ring-red-400 hover:text-red-400 focus:ring-2 active:bg-red-400 active:text-white transition-all duration-300"
              onClick={() => setOpen(true)}
            >
              Delete
            </button>
          </div>
        )}
        <h1 className="mt-8 mb-6 leading-[2.375rem] text-[2rem] font-bold text-text-dark md:leading-[3.25rem] md:mb-8 md:mt-12 md:text-[2.75rem]">
          {data?.title}
        </h1>
        <div className="flex gap-3">
          {author?.displayPhoto ? (
            <img
              src={author.displayPhoto}
              alt="display photo"
              width="44"
              height="44"
              className="rounded-full aspect-square object-cover bg-[#ebe4e0]"
            />
          ) : (
            <span className="h-11 w-11 rounded-full text-white font-bold leading-8 text-sm">
              {author?.username.slice(0, 2).toUpperCase()}
            </span>
          )}
          <div>
            <p className="leading-6 text-text-dark text-base capitalize">
              {author?.username}
            </p>
            {data && (
              <span className="text-text-light text-sm flex items-center">
                <span> {data?.readTime} min read </span>
                <span className="mx-4 border border-text-light"></span>
                <span className="capitalize">
                  {data?.updatedAt &&
                    new Date(data?.updatedAt!).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                </span>
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3 items-center flex-wrap mt-10 md:border-b md:pb-4">
          {data?.tags.map((tag) => (
            <span
              key={Math.random() + tag + Math.random()}
              className="inline-block h-9 rounded-3xl border px-4 leading-8"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-8 w-full aspect-video">
          {data?.image && (
            <img
              src={data.image}
              alt="cover photo"
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div
          className="tiptap"
          dangerouslySetInnerHTML={{
            __html: data?.content!,
          }}
        ></div>
      </section>

      <DeletePost open={open} setOpen={setOpen} dataId={data?.id} />
    </>
  );
};

const LoadingUiSkeletons = () => {
  return (
    <>
      <div className="px-6 md:px-0">
        <h1 className="mt-8 md:mt-6 h-8 rounded-md animate-pulse bg-[#ebe4e0]"></h1>

        <h1 className="mt-2 mb-6 md:mb-8 h-8 w-8/12 rounded-md animate-pulse bg-[#ebe4e0]"></h1>
        <div className="flex gap-3 animate-pulse">
          <div className="w-11 h-11 rounded-full bg-[#ebe4e0]"></div>
          <div className="flex flex-col w-full gap-2">
            <p className="h-4 bg-[#ebe4e0] w-3/12"></p>
            <p className="h-3 bg-[#ebe4e0] w-2/12"></p>
          </div>
        </div>
        <div className="animate-pulse flex w-full gap-3 items-center mt-10 md:pb-4">
          <span className="inline-block h-9 rounded-3xl bg-[#ebe4e0] w-20"></span>
          <span className="inline-block h-9 rounded-3xl bg-[#ebe4e0] w-16"></span>
        </div>
        <div className="mt-8 w-full aspect-video animate-pulse">
          <div className="h-full w-full bg-[#ebe4e0] rounded-md"></div>
        </div>
        <div className="mt-8 animate-pulse">
          <p className="h-6 mb-3 bg-[#ebe4e0] rounded-md w-10/12"></p>
          <p className="h-4 mb-2 bg-[#ebe4e0] rounded-md w-full"></p>
          <p className="h-4 mb-2 bg-[#ebe4e0] rounded-md w-full"></p>
          <p className="h-4 mb-5 bg-[#ebe4e0] rounded-md w-3/12"></p>
          <p className="h-6 mb-3 bg-[#ebe4e0] rounded-md w-10/12"></p>
          <p className="h-4 mb-2 bg-[#ebe4e0] rounded-md w-full"></p>
          <p className="h-4 mb-2 bg-[#ebe4e0] rounded-md w-full"></p>
          <p className="h-4 mb-2 bg-[#ebe4e0] rounded-md w-3/12"></p>
        </div>
      </div>
    </>
  );
};

export default SinglePost;
