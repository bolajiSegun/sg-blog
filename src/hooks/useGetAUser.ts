import { useContext, useEffect, useState } from "react";
import { SERVER_URL } from "../constants";
import { AuthContextValue, ResponseBody, User } from "../types/types";
import { AuthContext } from "../context/AuthContext";

const useGetAUser = (id: string | null) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useContext(AuthContext) as AuthContextValue;

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchData = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/user/${id}`, {
          signal,
        });
        const result: ResponseBody = await response.json();
        setData(result.data);
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

    if (user?.id === id) {
      setData(user);
      setIsLoading(false);
    } else if (id) {
      fetchData();
    }

    // Cleanup function to cancel the request if the component is unmounted
    return () => {
      controller.abort();
    };
  }, [id, user]);
  return { data, isLoading, error };
};

export default useGetAUser;
