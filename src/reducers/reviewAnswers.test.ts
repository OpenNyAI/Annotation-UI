import { AnswersResult } from "../types/api";
import { ReviewAnswerState, reviewAnswersReducer } from "./reviewAnswers";

const initialState: ReviewAnswerState = {
  question: "",
  annotatedTexts: [],
  resultChunks: [],
  qnaResponse: { qna: [] },
  currentQuestion: 0,
};

const updatedAnswerVersionResult = {
  answers: [
    { end_index: 4, start_index: 0, text: "hello", file_name: "file1.txt" },
  ],
  chunk_results: [
    {
      chunk: "chunk result v2",
      metadata: { file_name: "file3.txt", chunk_id: 1 },
    },
  ],
  file_name: "file1.txt",
  id: "id-1",
  version_number: 2,
  query: "Greet me? Version 2",
  additional_text: "additional-text version 2",
};

const qnaResponse: { qna: AnswersResult[] } = {
  qna: [
    {
      answers: [
        { end_index: 4, start_index: 0, text: "hello", file_name: "file1.txt" },
        {
          end_index: 4,
          start_index: 0,
          text: "hello",
          file_name: "file3.txt",
          source_text: "hello this is from source",
        },
      ],
      chunk_results: [
        {
          chunk: "hello this is from source",
          metadata: { file_name: "file3.txt", chunk_id: 1 },
        },
      ],
      file_name: "file1.txt",
      id: "id-1",
      version_number: 1,
      query: "Greet me?",
      additional_text: "additional-text",
    },
    {
      answers: [
        { end_index: 4, start_index: 0, text: "there", file_name: "file1.txt" },
      ],
      file_name: "file1.txt",
      id: "id-2",
      version_number: 1,
      chunk_results: [
        {
          chunk: "chunk-result-2",
          metadata: { file_name: "file1.txt", chunk_id: 1 },
        },
      ],
      query: "Where is the answer?",
    },
  ],
};

describe("review answers reducer", () => {
  it("should update the additional info when action type is update-additional-info", () => {
    const updatedInfo = "updated info";
    const expectedState: ReviewAnswerState = {
      ...initialState,
      additionalInfo: updatedInfo,
    };

    const state = reviewAnswersReducer(initialState, {
      type: "update-additional-info",
      payload: { updatedInfo },
    });

    expect(state).toEqual(expectedState);
  });

  it("should initialize annotated texts and result texts for the current question when action type is initialize-state", () => {
    const expectedState: ReviewAnswerState = {
      question: "Greet me?",
      additionalInfo: "additional-text",
      annotatedTexts: [
        { end_index: 4, start_index: 0, text: "hello", file_name: "file1.txt" },
        {
          end_index: 4,
          start_index: 0,
          text: "hello",
          file_name: "file3.txt",
          source_text: "hello this is from source",
        },
      ],
      qnaResponse,
      resultChunks: [
        {
          chunk: "hello this is from source",
          metadata: { file_name: "file3.txt", chunk_id: 1 },
        },
      ],
      currentQuestion: 0,
    };

    let state = reviewAnswersReducer(initialState, {
      type: "initialize-state",
      payload: qnaResponse,
    });

    expect(state).toEqual(expectedState);

    state = reviewAnswersReducer(state, {
      type: "update-current-question",
      payload: { questionIndex: 1 },
    });

    expect(state).toEqual({
      question: "Where is the answer?",
      additionalInfo: "",
      annotatedTexts: [
        { end_index: 4, start_index: 0, text: "there", file_name: "file1.txt" },
      ],
      qnaResponse,
      resultChunks: [
        {
          chunk: "chunk-result-2",
          metadata: {
            chunk_id: 1,
            file_name: "file1.txt",
          },
        },
      ],
      currentQuestion: 1,
    });
  });

  it("should update annotated texts when action type is add annotation", () => {
    const expectedState: ReviewAnswerState = {
      ...initialState,
      annotatedTexts: [
        {
          end_index: 4,
          start_index: 0,
          text: "hello",
          file_name: "file1.txt",
        },
      ],
    };

    const state = reviewAnswersReducer(initialState, {
      type: "add-annotated-text",
      payload: {
        newAnnotation: {
          end_index: 4,
          start_index: 0,
          text: "hello",
          file_name: "file1.txt",
        },
      },
    });

    expect(state).toEqual(expectedState);
  });

  it("should remove annotated text when action type is remove annotation", () => {
    const expectedState: ReviewAnswerState = {
      ...initialState,
      annotatedTexts: [
        {
          end_index: 4,
          start_index: 0,
          text: "hello",
          file_name: "file1.txt",
        },
      ],
    };

    let state = reviewAnswersReducer(initialState, {
      type: "add-annotated-text",
      payload: {
        newAnnotation: {
          end_index: 4,
          start_index: 0,
          text: "hello",
          file_name: "file1.txt",
        },
      },
    });

    expect(state).toEqual(expectedState);

    state = reviewAnswersReducer(state, {
      type: "delete-annotated-text",
      payload: {
        index: 0,
      },
    });

    expect(state).toEqual(initialState);
  });

  it("should update annotated texts when action type is update annotations", () => {
    const updatedAnnotations = [
      {
        end_index: 4,
        start_index: 0,
        text: "hello",
        file_name: "file1.txt",
      },
      {
        end_index: 1,
        start_index: 0,
        text: "Hi",
        file_name: "file2.txt",
      },
      {
        end_index: 6,
        start_index: 0,
        text: "welcome",
        file_name: "file3.txt",
      },
    ];
    const expectedState: ReviewAnswerState = {
      ...initialState,
      annotatedTexts: updatedAnnotations,
    };

    const state = reviewAnswersReducer(initialState, {
      type: "update-annotations",
      payload: {
        updatedAnnotations,
      },
    });

    expect(state).toEqual(expectedState);
  });

  it("should mark the annotated text as selected when action type is select annotated text", () => {
    const updatedAnnotations = [
      {
        end_index: 4,
        start_index: 0,
        text: "hello",
        file_name: "file1.txt",
      },
      {
        end_index: 1,
        start_index: 0,
        text: "Hi",
        file_name: "file2.txt",
      },
      {
        end_index: 6,
        start_index: 0,
        text: "welcome",
        file_name: "file3.txt",
      },
    ];
    const expectedState: ReviewAnswerState = {
      ...initialState,
      annotatedTexts: [
        {
          end_index: 4,
          start_index: 0,
          text: "hello",
          file_name: "file1.txt",
          isFocused: false,
        },
        {
          end_index: 1,
          start_index: 0,
          text: "Hi",
          file_name: "file2.txt",
          isFocused: false,
        },
        {
          end_index: 6,
          start_index: 0,
          text: "welcome",
          file_name: "file3.txt",
          isFocused: true,
        },
      ],
    };

    const state = reviewAnswersReducer(
      { ...initialState, annotatedTexts: updatedAnnotations },
      {
        type: "select-annotated-text",
        payload: {
          index: 2,
        },
      }
    );

    expect(state).toEqual(expectedState);
  });

  it("should un-mark already selected item when a new text annotated", () => {
    const updatedAnnotations = [
      {
        end_index: 1,
        start_index: 0,
        text: "Hi",
        file_name: "file2.txt",
      },
      {
        end_index: 6,
        start_index: 0,
        text: "welcome",
        file_name: "file3.txt",
      },
    ];
    const expectedState: ReviewAnswerState = {
      ...initialState,
      annotatedTexts: [
        {
          end_index: 1,
          start_index: 0,
          text: "Hi",
          file_name: "file2.txt",
          isFocused: false,
        },
        {
          end_index: 6,
          start_index: 0,
          text: "welcome",
          file_name: "file3.txt",
          isFocused: true,
        },
      ],
    };

    let state = reviewAnswersReducer(
      { ...initialState, annotatedTexts: updatedAnnotations },
      {
        type: "select-annotated-text",
        payload: {
          index: 1,
        },
      }
    );

    expect(state).toEqual(expectedState);

    state = reviewAnswersReducer(state, {
      type: "add-annotated-text",
      payload: {
        newAnnotation: {
          end_index: 4,
          start_index: 0,
          text: "hello",
          file_name: "file1.txt",
        },
      },
    });

    expect(state).toEqual({
      ...expectedState,
      annotatedTexts: [
        {
          end_index: 1,
          start_index: 0,
          text: "Hi",
          file_name: "file2.txt",
          isFocused: false,
        },
        {
          end_index: 6,
          start_index: 0,
          text: "welcome",
          file_name: "file3.txt",
          isFocused: false,
        },
        {
          end_index: 4,
          start_index: 0,
          text: "hello",
          file_name: "file1.txt",
        },
      ],
    });
  });

  it("should update the answer to given version of answer result", () => {
    const expectedState: ReviewAnswerState = {
      question: "Greet me? Version 2",
      additionalInfo: "additional-text version 2",
      annotatedTexts: [
        { end_index: 4, start_index: 0, text: "hello", file_name: "file1.txt" },
      ],
      qnaResponse: { qna: [] },
      resultChunks: [
        {
          chunk: "chunk result v2",
          metadata: { file_name: "file3.txt", chunk_id: 1 },
        },
      ],
      currentQuestion: 0,
    };

    const state = reviewAnswersReducer(initialState, {
      type: "update-answer-version",
      payload: updatedAnswerVersionResult,
    });

    expect(state).toEqual(expectedState);
  });

  it("should return prev state if the action type is wrong", () => {
    const state = reviewAnswersReducer(initialState, {
      type: "new-state" as any,
      payload: {} as any,
    });

    expect(state).toEqual(initialState);
  });
});
