import { useContext, useEffect, useState } from "react";
import { SERVER_URL } from "../constants";
import { AuthContextValue, ResponseBody } from "../types/types";
import { AuthContext } from "../context/AuthContext";

const useGetPosts = (
  filterQuery: string | null,
  page: number,
  pageSize = 5
) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [myPosts, setMyposts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const { token, user } = useContext(AuthContext) as AuthContextValue;

  useEffect(() => {
    const apiUrl =
      filterQuery === "my-post" && user
        ? `${SERVER_URL}/post/me/${user.id}`
        : `${SERVER_URL}/post`;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}?page=${page}&pageSize=${pageSize}`,
          {
            signal,
            headers: { authorization: `Bearer ${token}` },
          }
        );
        const result: ResponseBody = await response.json();
        if (!response.ok) {
          setError(result.message);
        } else {
          if (filterQuery === "my-post" && user) {
            setMyposts((prevPosts) => [...prevPosts, ...result.data.posts]);
            setAllPosts([]);
          } else {
            setAllPosts((prevPosts) => [...prevPosts, ...result.data.posts]);
            setMyposts([]);
          }

          setTotalPages(result.data.totalPages);
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted due to component unmount.");
        } else {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup function to cancel the request if the component is unmounted
    return () => {
      controller.abort();
    };
  }, [filterQuery, page, user]);

  const data = filterQuery === "my-post" && user ? myPosts : allPosts;

  return { data, isLoading, error, totalPages };
};

export default useGetPosts;
