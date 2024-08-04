import { useEffect, useState } from "react";
import { SERVER_URL } from "../constants";
import { PostType, ResponseBody } from "../types/types";

const useGetAPost = (slug: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<PostType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchData = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/post/${slug}`, {
          signal,
        });
        const result: ResponseBody = await response.json();
        if (!response.ok) {
          setError(result.message);
        } else {
          setData(result.data);
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted due to component unmount");
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
  }, [slug]);
  return { data, isLoading, error };
};

export default useGetAPost;
