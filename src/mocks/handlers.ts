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

  http.post(`/auth/reset-password`, () => {
    return HttpResponse.json({});
  }),

  http.post(`/auth/update-password`, () => {
    return HttpResponse.json({});
  }),

  http.get(`/user/documents`, () => {
    return HttpResponse.json({
      documents: [
        {
          id: "1",
          file_name: "File1.txt",
          last_edited_by: "user",
          number_of_questions: 2,
          max_questions: 24,
        },
      ],
    });
  }),

  http.get(`/user/documents/file-1`, () => {
    return HttpResponse.json({
      id: "1",
      file_name: "File1.txt",
      content: "this is file content information",
    });
  }),
];
