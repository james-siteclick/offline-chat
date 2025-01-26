import { describe, expect, it } from "vitest";
import { Mutation, State } from "./interfaces/mutation";
import { reducer } from "./reducer";

type TestRecord = {
  id: string;
  first_name: string;
  created_at: Date;
  deleted_at?: Date;
};

describe("reducer", () => {
  it("should create a record when it does not already exist", () => {
    const initialState: State<TestRecord> = new Map([]);

    const mutation: Mutation<TestRecord> = {
      type: "CREATE",
      data: {
        id: "test-id",
        first_name: "Bob",
        created_at: new Date(),
      },
    };

    const result = reducer(initialState, [mutation]);

    expect(result.appliedMutations).toEqual([mutation]);
    expect(result.nextState).toEqual(
      new Map([[mutation.data.id, mutation.data]])
    );
  });

  it("should not create a record when it already exists", () => {
    const record: TestRecord = {
      id: "test-id",
      first_name: "Bob",
      created_at: new Date(),
    };

    const initialState: State<TestRecord> = new Map([[record.id, record]]);

    const mutation: Mutation<TestRecord> = {
      type: "CREATE",
      data: record,
    };

    const result = reducer(initialState, [mutation]);

    expect(result.appliedMutations).toEqual([]);
    expect(result.nextState).toEqual(initialState);
  });

  it("should delete a record when it exists and is not already deleted", () => {
    const record: TestRecord = {
      id: "test-id",
      first_name: "Bob",
      created_at: new Date(),
    };

    const initialState: State<TestRecord> = new Map([[record.id, record]]);

    const mutation: Mutation<TestRecord> = {
      type: "DELETE",
      data: record,
    };

    const result = reducer(initialState, [mutation]);

    expect(result.appliedMutations).toEqual([mutation]);
    expect(result.nextState).toEqual(new Map());
  });

  it("should not delete a record when it does not exist", () => {
    const initialState: State<TestRecord> = new Map();

    const mutation: Mutation<TestRecord> = {
      type: "DELETE",
      data: {
        id: "test-id",
        first_name: "Bob",
        created_at: new Date(),
      },
    };

    const result = reducer(initialState, [mutation]);

    expect(result.appliedMutations).toEqual([]);
    expect(result.nextState).toEqual(initialState);
  });

  it("should not delete a record when it is already deleted", () => {
    const record: TestRecord = {
      id: "test-id",
      first_name: "Bob",
      created_at: new Date(),
      deleted_at: new Date("2025-01-26T02:41:35Z"),
    };

    const initialState: State<TestRecord> = new Map([[record.id, record]]);

    const mutation: Mutation<TestRecord> = {
      type: "DELETE",
      data: {
        ...record,
        deleted_at: new Date(),
      },
    };

    const result = reducer(initialState, [mutation]);

    expect(result.appliedMutations).toEqual([]);
    expect(result.nextState).toEqual(initialState);
  });
});
