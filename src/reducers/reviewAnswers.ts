import { produce } from "immer";
import { TextAnnotation } from "../components/annotation/TextAnnotator";
import {
  AdditionalInfo,
  DocumentQuestionAnswer,
  ResultChunk,
  SingleQuestionAnswer,
} from "../types/api";

export type ReviewAnswerState = {
  question: string;
  annotatedTexts: TextAnnotation[];
  resultChunks: ResultChunk[];
  qnaResponse?: DocumentQuestionAnswer;
  currentQuestion: number;
  additionalInfoList: AdditionalInfo[];
  idealAnswer?: string;
};

type ReviewAnswersAction =
  | {
      type: "add-annotated-text";
      payload: {
        newAnnotation: TextAnnotation;
      };
    }
  | {
      type: "delete-annotated-text";
      payload: {
        index: number;
      };
    }
  | {
      type: "select-annotated-text";
      payload: {
        index: number;
      };
    }
  | {
      type: "update-annotations";
      payload: { updatedAnnotations: TextAnnotation[] };
    }
  | {
      type: "update-additional-info-list";
      payload: {
        updatedInfo: AdditionalInfo[];
      };
    }
  | {
      type: "update-current-question";
      payload: {
        questionIndex: number;
      };
    }
  | { type: "update-answer-version"; payload: SingleQuestionAnswer }
  | { type: "update-ideal-answer"; payload: { updatedValue: string } }
  | {
      type: "initialize-state";
      payload: DocumentQuestionAnswer;
    };

export const reviewAnswersReducer = (
  state: ReviewAnswerState,
  action: ReviewAnswersAction
) => {
  const { type, payload } = action;
  switch (type) {
    case "add-annotated-text":
      return produce(state, (draft) => {
        draft.annotatedTexts = draft.annotatedTexts.map((annotatedTex) => {
          return {
            ...annotatedTex,
            isFocused: false,
          };
        });
        draft.annotatedTexts = [...draft.annotatedTexts, payload.newAnnotation];
        return draft;
      });
    case "delete-annotated-text":
      return produce(state, (draft) => {
        draft.annotatedTexts = draft.annotatedTexts.map((annotatedTex) => {
          return {
            ...annotatedTex,
            isFocused: false,
          };
        });
        draft.annotatedTexts.splice(payload.index, 1);
        return draft;
      });
    case "select-annotated-text":
      return produce(state, (draft) => {
        draft.annotatedTexts = draft.annotatedTexts.map((annotatedTex, idx) => {
          return {
            ...annotatedTex,
            isFocused: idx === payload.index,
          };
        });
        return draft;
      });
    case "update-additional-info-list":
      return produce(state, (draft) => {
        draft.additionalInfoList = payload.updatedInfo;
        return draft;
      });
    case "update-annotations":
      return produce(state, (draft) => {
        draft.annotatedTexts = payload.updatedAnnotations;
        return draft;
      });
    case "update-current-question":
      return produce(state, (draft) => {
        const { questionIndex } = payload;
        const currentQnA = draft.qnaResponse?.qna[questionIndex];
        const { chunk_results, answers } = currentQnA!;
        draft.annotatedTexts = answers;
        draft.resultChunks = chunk_results;
        draft.additionalInfoList = currentQnA?.additional_text ?? [];
        draft.question = currentQnA!.query;
        draft.currentQuestion = questionIndex;
        draft.idealAnswer = currentQnA?.generation_response ?? "";
        return draft;
      });
    case "initialize-state":
      return produce(state, (draft) => {
        draft.qnaResponse = payload;
        const { currentQuestion } = draft;
        const currentQnA = draft.qnaResponse?.qna[currentQuestion];
        const { chunk_results, answers } = currentQnA!;
        draft.annotatedTexts = answers;
        draft.resultChunks = chunk_results;
        draft.additionalInfoList = currentQnA?.additional_text ?? [];
        draft.question = currentQnA!.query;
        draft.idealAnswer = currentQnA.generation_response ?? "";
        return draft;
      });
    case "update-answer-version":
      return produce(state, (draft) => {
        const { answers, additional_text, query, generation_response } =
          payload;
        draft.annotatedTexts = answers;
        draft.additionalInfoList = additional_text ?? [];
        draft.question = query;
        draft.idealAnswer = generation_response ?? "";
        return draft;
      });
    case "update-ideal-answer":
      return produce(state, (draft) => {
        draft.idealAnswer = payload.updatedValue;
        return draft;
      });
    default:
      return state;
  }
};
