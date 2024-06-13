export type DocumentInfo = {
  id: string;
  file_name: string;
  last_edited_by: string | null;
  max_questions: number;
  number_of_questions: number;
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

export type SubmitAnswerBody = {
  document_id: string;
  query: string;
  annotated_text: {
    file_name: string;
    text: string;
    start_index: number;
    end_index: number;
    source_text?: string;
  }[];
  additional_answer?: string;
};

export type QueryResult = {
  query: string;
  chunks: ResultChunk[];
};
