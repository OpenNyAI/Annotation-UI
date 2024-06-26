export type DocumentStatus =
  | "QueryInProgress"
  | "QueryFinished"
  | "OnReview"
  | "Reviewed"
  | "OnExpertReview"
  | "Completed";

export type DocumentInfo = {
  id: string;
  file_name: string;
  last_edited_by: string | null;
  max_questions: number;
  number_of_questions: number;
  status: DocumentStatus;
};

export type DocumentWithContent = {
  id: string;
  file_name: string;
  content: string;
};

export type ResultChunk = {
  chunk: string;
  metadata: { chunk_id: number; file_name: string };
};

export type AnnotatedText = {
  file_name: string;
  text: string;
  start_index: number;
  end_index: number;
  source_text?: string;
};

export type SubmitAnswerBody = {
  document_id: string;
  query: string;
  annotated_text: AnnotatedText[];
  additional_answer?: string;
  chunk_result: ResultChunk[];
};

export type QueryResult = {
  query: string;
  chunks: ResultChunk[];
};

export type SingleQuestionAnswer = {
  query: string;
  file_name: string;
  version_number: number;
  answers: AnnotatedText[];
  additional_text?: string;
};

export type QuestionAnswer = SingleQuestionAnswer & {
  id: string;
  flag: boolean;
  chunk_results: ResultChunk[];
};

export type DocumentQuestionAnswer = {
  qna: QuestionAnswer[];
};

export type QuestionAnswerVersionListResponse = {
  id: string;
  flag: boolean;
  chunk_results: ResultChunk[];
  qna: SingleQuestionAnswer[];
};

export type FlagQueryRequest = {
  qna_id: string;
  is_flagged: boolean;
};
