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
