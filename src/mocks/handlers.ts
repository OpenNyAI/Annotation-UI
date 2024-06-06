import { HttpResponse, http } from "msw";

export const handlers = [
  http.post(`/signin`, () => {
    return HttpResponse.json({
      access_token: "access-token",
      refresh_token: "refresh_token",
      token_type: "bearer",
    });
  }),
  http.post(`/signup`, () => {
    return HttpResponse.json({});
  }),
];
