import { HttpError } from "../errors/httpError";

export type AsyncState<T> = {
  status: "idle" | "pending" | "resolved" | "error";
  error?: HttpError | Error;
  data?: T;
};

export type AsyncStateActionTypes<T> =
  | {
      type: "pending";
    }
  | {
      type: "resolved";
      payload: {
        data: T;
      };
    }
  | {
      type: "rejected";
      payload: {
        error: AsyncState<T>["error"];
      };
    };

const initialState: AsyncState<any> = { status: "idle" };

export const asyncStateReducer = <T>(
  state: AsyncState<T> = initialState,
  action: AsyncStateActionTypes<T>
): AsyncState<T> => {
  switch (action.type) {
    case "pending":
      return { ...state, status: "pending" };
    case "resolved":
      return { status: "resolved", data: action.payload.data };
    case "rejected":
      return { ...state, status: "error", error: action.payload.error };
    default:
      return state;
  }
};
