import { HttpResponse, http } from "msw";
import { QueryResult } from "../types/api";
import {
  documentsListResponse,
  fileContent,
  myDocumentsWithAnswers,
  queryChunksResponse,
} from "./documents";

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

  http.post(`/auth/reset-password`, () => {
    return HttpResponse.json({});
  }),

  http.post(`/auth/update-password`, () => {
    return HttpResponse.json({});
  }),

  http.get(`/user/documents`, () => {
    return HttpResponse.json({
      documents: documentsListResponse,
    });
  }),

  http.get(`/user/documents/file-1`, () => {
    return HttpResponse.json(fileContent);
  }),

  http.get("/user/query", () => {
    return HttpResponse.json<QueryResult>(queryChunksResponse);
  }),

  http.post("/user/submit", () => {
    return HttpResponse.json("Submitted successfully");
  }),

  http.get(`/user/users/documents`, () => {
    return HttpResponse.json({
      documents: myDocumentsWithAnswers,
    });
  }),
];
