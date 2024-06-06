import axios, { AxiosError } from "axios";
import { useReducer } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { HttpError } from "../errors/httpError";
import { asyncStateReducer } from "../reducers/asyncState";

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

  const makeRequest = async <K,>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: K
  ) => {
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

export default useAxios;
