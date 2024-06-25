export const documentsListResponse = [
  {
    id: "1",
    file_name: "File1.txt",
    last_edited_by: "user",
    number_of_questions: 2,
    max_questions: 24,
    status: "QueryInProgress",
  },
];

export const myDocumentsWithAnswers = [
  {
    id: "1",
    file_name: "File1 Answered.txt",
    last_edited_by: "Tester",
    number_of_questions: 8,
    max_questions: 24,
    status: "QueryInProgress",
  },
  {
    id: "2",
    file_name: "File2 Answered.txt",
    last_edited_by: "Tester",
    number_of_questions: 6,
    max_questions: 25,
    status: "QueryInProgress",
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

export const answer1Annotations = [
  {
    file_name: "File-1.tx",
    text: "annotated answer 1",
    start_index: 0,
    end_index: 10,
  },
  {
    file_name: "File-2.tx",
    text: "annotated answer 2",
    start_index: 0,
    end_index: 10,
  },
];

export const answer2Annotations = [
  {
    file_name: "File-2.tx",
    text: "annotated answer 3",
    start_index: 0,
    end_index: 10,
  },
  {
    file_name: "File-3.tx",
    text: "annotated answer 4",
    start_index: 0,
    end_index: 10,
  },
];
export const answer1 = {
  id: "doc-1",
  file_name: "File-1.txt",
  query: "Question-1",
  answers: answer1Annotations,
  chunk_results: [],
  additional_text: "answer-1 additional text",
};

export const answer2 = {
  id: "doc-1",
  file_name: "File-1.txt",
  query: "Question-2",
  chunk_results: [],
  answers: answer2Annotations,
};

export const qnaResponse = [answer1, answer2];

export const reviewDocuments = [
  {
    id: "1",
    file_name: "File1 Answered.txt",
    last_edited_by: "Tester",
    number_of_questions: 25,
    max_questions: 25,
    status: "OnReview",
  },
  {
    id: "2",
    file_name: "File2 Answered.txt",
    last_edited_by: "Tester",
    number_of_questions: 25,
    max_questions: 25,
    status: "QueryInProgress",
  },
];
