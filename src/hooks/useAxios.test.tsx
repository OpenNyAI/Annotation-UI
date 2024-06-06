import { HttpResponse, http } from "msw";
import { HttpError } from "../errors/httpError";
import { server } from "../mocks/server";
import { act, renderHook } from "../utility/test-utils";
import useAxios from "./useAxios";

describe("useAxios", () => {
  it("should return initial async state", () => {
    const initialAsyncState = {
      makeRequest: expect.any(Function),
      status: "idle",
      error: undefined,
      data: undefined,
    };
    const { result } = renderHook(() => useAxios<number>());

    expect(result.current).toEqual(initialAsyncState);
  });

  it("should set resolved when the request resolves", async () => {
    const expectedState = {
      makeRequest: expect.any(Function),
      status: "resolved",
      error: undefined,
      data: 10,
    };

    server.use(
      http.get(`/success`, () => {
        return HttpResponse.json(10);
      })
    );

    const { result } = renderHook(() => useAxios<number>());

    await act(async () => {
      await result.current.makeRequest<number>("/success", "GET");
    });

    expect(result.current).toEqual(expectedState);
  });

  it("should set rejected when the request fails due to error", async () => {
    const expectedState = {
      makeRequest: expect.any(Function),
      status: "error",
      error: expect.any(HttpError),
      data: undefined,
    };

    server.use(
      http.get(`/error`, () => {
        return HttpResponse.json(
          { message: "Something went wrong" },
          { status: 401 }
        );
      })
    );

    const { result } = renderHook(() => useAxios<number>());

    await act(async () => {
      try {
        await result.current.makeRequest<number>("/error", "GET");
      } catch (error) {
        expect(error).toBeInstanceOf(HttpError);
        expect(error).toHaveProperty("message", "Something went wrong");
      }
    });

    expect(result.current).toEqual(expectedState);
  });

  it("should set rejected when the request fails with non http error", async () => {
    const expectedState = {
      makeRequest: expect.any(Function),
      status: "error",
      error: expect.any(Error),
      data: undefined,
    };

    server.use(
      http.get(`/error`, () => {
        return HttpResponse.error();
      })
    );

    const { result } = renderHook(() => useAxios<number>());

    await act(async () => {
      try {
        await result.current.makeRequest<number>("/error", "GET");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty("message", "Failed to make a request");
      }
    });

    expect(result.current).toEqual(expectedState);
  });
});
