import {
  AnnotatedText,
  DocumentBaseInfo,
  DocumentInfo,
  DocumentQuestionAnswer,
  DocumentWithContent,
  QueryResult,
  QuestionAnswer,
  QuestionConfigResponse,
  ResultChunk,
} from "../types/api";

export const documentsListResponse: DocumentInfo[] = [
  {
    id: "1",
    file_name: "File1.txt",
    last_edited_by: "user",
    number_of_questions: 2,
    max_questions: 24,
    status: "QueryInProgress",
  },
];

export const myDocumentsWithAnswers: DocumentInfo[] = [
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

export const chunks: ResultChunk[] = [
  {
    chunk: "chunk-1",
    metadata: { chunk_id: 1, file_name: "file-1" },
    retriever_name: "retriever-1",
  },
  {
    chunk: "chunk-2",
    metadata: { chunk_id: 2, file_name: "file-2" },
    retriever_name: "retriever-1",
  },
  {
    chunk: "chunk-3",
    metadata: { chunk_id: 3, file_name: "file-3" },
    retriever_name: "retriever-2",
  },
];

export const queryChunksResponse: QueryResult = {
  query: "test-query",
  chunks,
};

export const fileContent: DocumentWithContent = {
  id: "1",
  file_name: "File1.txt",
  content: "this is file content information",
};

export const answer1Annotations: AnnotatedText[] = [
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

export const answer2Annotations: AnnotatedText[] = [
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
export const answer1: QuestionAnswer = {
  id: "doc-1",
  flag: false,
  file_name: "File-1.txt",
  query: "Question-1",
  query_type: "small",
  query_category: "category-1",
  version_number: 1,
  answers: answer1Annotations,
  chunk_results: [],
  additional_text: [
    {
      id: "id-1",
      file_name: "file_1",
      text: "answer-1 additional text",
    },
  ],
  generation_response: "generated response",
};

export const answer2: QuestionAnswer = {
  id: "doc-1",
  flag: false,

  file_name: "File-1.txt",
  query: "Question-2",
  query_type: "small",
  query_category: "category-1",
  version_number: 1,

  chunk_results: [],
  answers: answer2Annotations,
};

export const qnaResponse: DocumentQuestionAnswer = { qna: [answer1, answer2] };

export const reviewDocuments: DocumentInfo[] = [
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

export const titleDocuments: DocumentBaseInfo[] = [
  {
    id: "1",
    file_name: "file-1.txt",
  },
  {
    id: "2",
    file_name: "file-2.txt",
  },
  {
    id: "3",
    file_name: "file-3.txt",
  },
];

export const questionConfig: QuestionConfigResponse = {
  question_category: [
    {
      label: "Category 1",
      value: "category-1",
    },
    {
      label: "Category 2",
      value: "category-2",
    },
  ],
  question_type: [
    {
      label: "Small",
      value: "small",
    },
    {
      label: "Medium",
      value: "medium",
    },
  ],
};

export const mockDatasets = [
  {
    id: 1,
    name: "Dataset 1",
    created_at: "2023-10-26",
    created_by: "John Doe",
    status: "Active",
  },
  {
    id: 2,
    name: "Dataset 2",
    created_at: "2023-10-27",
    created_by: "Jane Doe",
    status: "Inactive",
  },
];
