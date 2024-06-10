import { HttpResponse, http } from "msw";

export const handlers = [
  http.post(`/auth/login`, () => {
    return HttpResponse.json({
      access_token: "access-token",
      token_type: "bearer",
    });
  }),
  http.post(`/auth/signup`, () => {
    return HttpResponse.json({});
  }),
];
