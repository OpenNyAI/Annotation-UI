import { AdditionalInfo, QueryResult } from "../types/api";
import {
  annotateAnswersReducer,
  AnnotateAnswersState,
} from "./annotateAnswers";

const initialState: AnnotateAnswersState = {
  question: "",
  questionCategory: "",
  questionType: "",
  annotatedTexts: [],
  result: undefined,
  additionalInfoList: [],
};

const queryResult: QueryResult = {
  query: "query",
  chunks: [
    {
      chunk: "chuk-1",
      metadata: {
        file_name: "file-1",
        chunk_id: 1,
      },
      retriever_name: "r-1",
    },
  ],
};

describe("annotate answers reducer", () => {
  it("should update the additional info when action type is update-additional-info", () => {
    const updatedInfo: AdditionalInfo[] = [
      {
        id: "1",
        file_name: "file-1",
        text: "updated info",
      },
    ];
    const expectedState: AnnotateAnswersState = {
      ...initialState,
      additionalInfoList: updatedInfo,
    };

    const state = annotateAnswersReducer(initialState, {
      type: "update-additional-info-list",
      payload: { updatedInfo },
    });

    expect(state).toEqual(expectedState);
  });

  it("should update annotated texts when action type is add annotation", () => {
    const expectedState: AnnotateAnswersState = {
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

    const state = annotateAnswersReducer(initialState, {
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
    const expectedState: AnnotateAnswersState = {
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

    let state = annotateAnswersReducer(initialState, {
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

    state = annotateAnswersReducer(state, {
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
    const expectedState: AnnotateAnswersState = {
      ...initialState,
      annotatedTexts: updatedAnnotations,
    };

    const state = annotateAnswersReducer(initialState, {
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
    const expectedState: AnnotateAnswersState = {
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

    const state = annotateAnswersReducer(
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
    const expectedState: AnnotateAnswersState = {
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

    let state = annotateAnswersReducer(
      { ...initialState, annotatedTexts: updatedAnnotations },
      {
        type: "select-annotated-text",
        payload: {
          index: 1,
        },
      }
    );

    expect(state).toEqual(expectedState);

    state = annotateAnswersReducer(state, {
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

  it("should update the query result to given result result", () => {
    const state = annotateAnswersReducer(initialState, {
      type: "update-query-result",
      payload: { result: queryResult },
    });

    expect(state).toEqual({
      ...initialState,
      result: queryResult,
    });
  });

  it("should update the ideal answer to given text value", () => {
    const expectedState: AnnotateAnswersState = {
      ...initialState,
      idealAnswer: "updated answer",
    };

    const state = annotateAnswersReducer(initialState, {
      type: "update-ideal-answer",
      payload: { updatedValue: "updated answer" },
    });

    expect(state).toEqual(expectedState);
  });

  it("should return prev state if the action type is wrong", () => {
    const state = annotateAnswersReducer(initialState, {
      type: "new-state" as any,
      payload: {} as any,
    });

    expect(state).toEqual(initialState);
  });

  it("should update question type to given value when action is udpate-question-type", () => {
    const expectedState: AnnotateAnswersState = {
      ...initialState,
      questionType: "updated type",
    };

    const state = annotateAnswersReducer(initialState, {
      type: "update-question-type",
      payload: { type: "updated type" },
    });

    expect(state).toEqual(expectedState);
  });

  it("should update question category to given value when action is udpate-question-category", () => {
    const expectedState: AnnotateAnswersState = {
      ...initialState,
      questionCategory: "updated category",
    };

    const state = annotateAnswersReducer(initialState, {
      type: "update-question-category",
      payload: { category: "updated category" },
    });

    expect(state).toEqual(expectedState);
  });
});
