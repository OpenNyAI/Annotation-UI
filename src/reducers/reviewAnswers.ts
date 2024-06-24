import { produce } from "immer";
import { TextAnnotation } from "../components/annotation/TextAnnotator";
import { AnswersResult } from "../types/api";

type ResultChunk = { chunk: string; metadata: { file_name: string } };

function getAnnotatedTextsAndResults(
  qnaResponse: AnswersResult[],
  index: number
) {
  const results = qnaResponse[index].answers
    .map((answer) => {
      if (answer.source_text) {
        return {
          chunk: answer.source_text,
          metadata: {
            file_name: answer.file_name,
          },
        };
      }
    })
    .filter((item) => item !== undefined) as ResultChunk[];
  const answers = qnaResponse[index].answers;

  return { results, answers };
}

export type ReviewAnswerState = {
  question: string;
  annotatedTexts: TextAnnotation[];
  resultChunks: ResultChunk[];
  qnaResponse?: { qna: AnswersResult[] };
  currentQuestion: number;
  additionalInfo?: string;
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
      type: "update-additional-info";
      payload: {
        updatedInfo: string;
      };
    }
  | {
      type: "update-current-question";
      payload: {
        questionIndex: number;
      };
    }
  | { type: "update-answer-version"; payload: AnswersResult }
  | {
      type: "initialize-state";
      payload: { qna: AnswersResult[] };
    };

export const reviewAnswersReducer = (
  state: ReviewAnswerState,
  action: ReviewAnswersAction
) => {
  console.log("Action", action);
  const { type, payload } = action;
  switch (type) {
    case "add-annotated-text":
      return produce(state, (draft) => {
        draft.annotatedTexts = [...draft.annotatedTexts, payload.newAnnotation];
        return draft;
      });
    case "delete-annotated-text":
      return produce(state, (draft) => {
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
    case "update-additional-info":
      return produce(state, (draft) => {
        draft.additionalInfo = payload.updatedInfo;
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
        const { results, answers } = getAnnotatedTextsAndResults(
          draft.qnaResponse?.qna ?? [],
          questionIndex
        );
        draft.annotatedTexts = answers;
        draft.resultChunks = results;
        draft.additionalInfo =
          draft.qnaResponse?.qna[questionIndex].additional_text ?? "";
        draft.question = draft.qnaResponse?.qna[questionIndex].query ?? "";
        draft.currentQuestion = questionIndex;
        return draft;
      });
    case "initialize-state":
      return produce(state, (draft) => {
        draft.qnaResponse = payload;
        const { currentQuestion } = draft;
        const { results, answers } = getAnnotatedTextsAndResults(
          payload.qna,
          currentQuestion
        );
        draft.annotatedTexts = answers;
        draft.resultChunks = results;
        draft.additionalInfo =
          draft.qnaResponse?.qna[currentQuestion].additional_text ?? "";
        draft.question = draft.qnaResponse?.qna[currentQuestion].query ?? "";
        return draft;
      });
    case "update-answer-version":
      return produce(state, (draft) => {
        const { results, answers } = getAnnotatedTextsAndResults([payload], 0);
        draft.annotatedTexts = answers;
        draft.resultChunks = results;
        draft.additionalInfo = payload.additional_text;
        draft.question = payload.query;
        return draft;
      });
    default:
      return state;
  }
};
