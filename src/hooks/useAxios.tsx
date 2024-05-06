import axios from "axios";
import { useState } from "react";

const useAxios = () => {
  const [error, setError] = useState<string | null>(null);

  const makeRequest = async (
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: any
  ) => {
    try {
      const response = await axios({
        method,
        url,
        data: body,
      });

      return response.data;
    } catch (error: any) {
      setError(error.response?.data?.message || "An error occurred");
      throw error;
    }
  };

  return { makeRequest, error };
};

export default useAxios;
