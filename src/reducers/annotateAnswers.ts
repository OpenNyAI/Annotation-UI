import { produce } from "immer";
import { TextAnnotation } from "../components/annotation/TextAnnotator";
import { AdditionalInfo, QueryResult } from "../types/api";

export type AnnotateAnswersState = {
  question: string;
  questionType: string;
  questionCategory: string;
  annotatedTexts: TextAnnotation[];
  result?: QueryResult;
  additionalInfoList: AdditionalInfo[];
  idealAnswer?: string;
};

export type AnnotateAnswersAction =
  | {
      type: "update-question";
      payload: {
        updatedQuestion: string;
      };
    }
  | {
      type: "update-question-type";
      payload: {
        type: string;
      };
    }
  | {
      type: "update-question-category";
      payload: {
        category: string;
      };
    }
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
  | { type: "update-ideal-answer"; payload: { updatedValue: string } }
  | { type: "update-query-result"; payload: { result: QueryResult } }
  | { type: "reset"; payload: { annotateAnswerState: AnnotateAnswersState } };

export const annotateAnswersReducer = (
  state: AnnotateAnswersState,
  action: AnnotateAnswersAction
): AnnotateAnswersState => {
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
    case "update-ideal-answer":
      return produce(state, (draft) => {
        draft.idealAnswer = payload.updatedValue;
        return draft;
      });
    case "update-query-result":
      return produce(state, (draft) => {
        draft.result = payload.result;
        draft.annotatedTexts = draft.annotatedTexts.filter((text) => {
          !text.source_text;
        });
        return draft;
      });
    case "update-question":
      return produce(state, (draft) => {
        draft.question = payload.updatedQuestion;
        return draft;
      });
    case "update-question-type":
      return produce(state, (draft) => {
        draft.questionType = payload.type;
        return draft;
      });
    case "update-question-category":
      return produce(state, (draft) => {
        draft.questionCategory = payload.category;
        return draft;
      });
    case "reset":
      return payload.annotateAnswerState;
    default:
      return state;
  }
};
