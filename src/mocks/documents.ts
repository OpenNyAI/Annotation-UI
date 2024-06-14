export const documentsListResponse = [
  {
    id: "1",
    file_name: "File1.txt",
    last_edited_by: "user",
    number_of_questions: 2,
    max_questions: 24,
  },
];

export const myDocumentsWithAnswers = [
  {
    id: "1",
    file_name: "File1 Answered.txt",
    last_edited_by: "Tester",
    number_of_questions: 8,
    max_questions: 24,
  },
  {
    id: "2",
    file_name: "File2 Answered.txt",
    last_edited_by: "Tester",
    number_of_questions: 6,
    max_questions: 25,
  },
];

export const chunks = [
  {
    chunk: "chunk-1",
    metadata: { chunk_id: 1, file_name: "file-1" },
  },
  {
    chunk: "chunk-2",
    metadata: { chunk_id: 2, file_name: "file-2" },
  },
  {
    chunk: "chunk-3",
    metadata: { chunk_id: 3, file_name: "file-3" },
  },
];

export const queryChunksResponse = {
  query: "test-query",
  chunks,
};

export const fileContent = {
  id: "1",
  file_name: "File1.txt",
  content: "this is file content information",
};
