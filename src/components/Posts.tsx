import { createRef, useContext, useEffect, useState } from "react";
import Post from "./Post";
import useGetPosts from "../hooks/useGetPosts";
import { AuthContext } from "../context/AuthContext";
import { AuthContextValue } from "../types/types";
import { Link, useSearchParams } from "react-router-dom";
import Error from "./Error";

const Posts = () => {
  const [searchParams] = useSearchParams();
  const filterQuery = searchParams.get("q");
  const [page, setPage] = useState(1);

  const containerRef = createRef<HTMLInputElement>();

  const { data, isLoading, error, totalPages } = useGetPosts(filterQuery, page);
  const { user } = useContext(AuthContext) as AuthContextValue;

  const handleScroll = () => {
    const container = containerRef.current;
    if (
      container &&
      container.scrollTop + container.clientHeight === container.scrollHeight &&
      totalPages > page
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filterQuery]);

  if (isLoading) {
    return (
      <>
        <LoadingUiSkeletons />
        <LoadingUiSkeletons />
        <LoadingUiSkeletons />
      </>
    );
  }

  if (error) {
    return <Error />;
  }

  return (
    <>
      <main className="mx-auto max-w-7xl h-screen overflow-hidden pt-6 sticky top-0 left-0 flex flex-col">
        <div className="flex relative gap-4 px-6 text-sm text-text-light">
          <Link
            to={"/"}
            className={`pb-4 border-b cursor-pointer transition-all ${
              !filterQuery
                ? "border-b-text-dark text-text-dark"
                : "border-b-transparent"
            }`}
          >
            <p className="hover:text-text-dark">All Post</p>
          </Link>
          {user && (
            <Link
              to={"/?q=my-post"}
              className={`pb-4 border-b cursor-pointer transition-all ${
                filterQuery === "my-post"
                  ? "border-b-text-dark text-text-dark"
                  : "border-b-transparent"
              }`}
            >
              <p className="hover:text-text-dark">My Post</p>
            </Link>
          )}
          <div className="border-b w-full absolute bottom-0 -z-[1] left-0"></div>
        </div>
        <section
          ref={containerRef}
          onScroll={handleScroll}
          className="overflow-hidden overflow-y-auto post-container relative"
        >
          {data.length > 0 &&
            data?.map((item) => (
              <div key={item.id}>
                <Post data={item} />
              </div>
            ))}
        </section>
        {totalPages === page && (
          <p className="text-text-light text-center py-2 text-sm">
            No More Posts
          </p>
        )}
      </main>
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

export default Posts;
