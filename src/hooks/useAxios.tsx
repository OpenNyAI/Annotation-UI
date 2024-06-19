import axios, { AxiosError } from "axios";
import { useEffect, useReducer } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { HttpError } from "../errors/httpError";
import { asyncStateReducer } from "../reducers/asyncState";
import { useAuth } from "./useAuth";

function createErrorFromAxiosError(
  err: AxiosError<any, any>
): HttpError | Error {
  if (err.response) {
    return new HttpError(err.response.data.message, err.response.status);
  } else if (err.request) {
    return new Error("Failed to make a request");
  } else {
    return new Error("Failed to make a request");
  }
}

const useAxios = <T,>() => {
  const [asyncState, dispatch] = useReducer(asyncStateReducer<T>, {
    status: "idle",
  });
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"] && auth.accessToken) {
          config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
        }
        return config;
      }
    );

    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          try {
            prevRequest.sent = true;
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
              {
                withCredentials: true,
              }
            );

            setAuth({ accessToken: response.data.access_token });

            prevRequest.headers["Authorization"] =
              `Bearer ${response.data.access_token}`;
            return axiosInstance(prevRequest);
          } catch (error) {
            setAuth({});
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.response.eject(responseIntercept);
    };
  }, [auth?.accessToken, setAuth]);

  const makeRequest = async <K,>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: K
  ): Promise<T> => {
    dispatch({
      type: "pending",
    });
    try {
      const response = await axiosInstance({
        method,
        url,
        data: body,
      });
      dispatch({
        type: "resolved",
        payload: { data: response.data },
      });
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const updatedErr = createErrorFromAxiosError(err);
        dispatch({ type: "rejected", payload: { error: updatedErr } });
        throw updatedErr;
      } else {
        dispatch({ type: "rejected", payload: { error: err } });
        throw err;
      }
    }
  };

  return { makeRequest, ...asyncState };
};

export type UseAxiosResult = ReturnType<typeof useAxios>;

export default useAxios;
