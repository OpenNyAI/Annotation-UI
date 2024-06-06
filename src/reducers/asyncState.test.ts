import { AsyncState, asyncStateReducer } from "./asyncState";

describe("async state reducer", () => {
  it("should change status to pending when the action type is pending", () => {
    const expectedState: AsyncState<number> = { status: "pending" };

    const state = asyncStateReducer(undefined, { type: "pending" });

    expect(state).toEqual(expectedState);
  });

  it("should change status to resolved and set data to given value", () => {
    const expectedState: AsyncState<number> = { status: "resolved", data: 20 };

    const state = asyncStateReducer(undefined, {
      type: "resolved",
      payload: { data: 20 },
    });

    expect(state).toEqual(expectedState);
  });

  it("should update the status to error with given error value", () => {
    const err = new Error("Something went wrong");
    const expectedState: AsyncState<number> = {
      status: "error",
      error: err,
    };

    const state = asyncStateReducer(undefined, {
      type: "rejected",
      payload: { error: err },
    });

    expect(state).toEqual(expectedState);
  });

  it("should return prev state if the action type is wrong", () => {
    const prevState: AsyncState<unknown> = { status: "pending" };

    const state = asyncStateReducer(prevState, {
      type: "new-state" as any,
    });

    expect(state).toEqual(prevState);
  });
});
