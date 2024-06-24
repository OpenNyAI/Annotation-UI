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

type AnnotatedText = {
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

export type AnswersResult = {
  id: string;
  file_name: string;
  query: string;
  version_number: number;
  answers: AnnotatedText[];
  chunk_results: ResultChunk[];
  additional_text?: string;
};
