import { describe, expect, it } from "vitest";
import { getLastUpdatedAt, merge, Mergeable } from "./merge";

const dates = {
  older: new Date("2025-01-01T12:00:00Z"),
  newer: new Date("2025-01-02T12:00:00Z"),
};

describe("getLastUpdatedAt", () => {
  it("returns created_at when deleted_at is undefined", () => {
    const result = getLastUpdatedAt({
      id: "test-id",
      created_at: dates.older,
    });

    expect(result).toEqual(dates.older);
  });

  it("returns created_at when deleted_at is older", () => {
    const result = getLastUpdatedAt({
      id: "test-id",
      created_at: dates.newer,
      deleted_at: dates.older,
    });

    expect(result).toEqual(dates.newer);
  });

  it("returns deleted_at when deleted_at is newer", () => {
    const result = getLastUpdatedAt({
      id: "test-id",
      created_at: dates.older,
      deleted_at: dates.newer,
    });

    expect(result).toEqual(dates.newer);
  });
});

describe("merge", () => {
  it("returns items from list a when list b is empty", () => {
    const listA: Mergeable[] = [
      {
        id: "test-id",
        created_at: dates.older,
      },
    ];

    const result = merge(listA, []);

    expect(result).toEqual(listA);
  });

  it("returns items from list b when list a is empty", () => {
    const listA: Mergeable[] = [
      {
        id: "test-id",
        created_at: dates.older,
      },
    ];

    const result = merge(listA, []);

    expect(result).toEqual(listA);
  });

  it("returns items from list a when they are newer than those in list b", () => {
    const listA: Mergeable[] = [
      {
        id: "test-id",
        created_at: dates.newer,
      },
    ];

    const listB: Mergeable[] = [
      {
        id: "test-id",
        created_at: dates.older,
      },
    ];

    const result = merge(listA, listB);

    expect(result).toEqual(listA);
  });

  it("returns items from list b when they are newer than those in list a", () => {
    const listA: Mergeable[] = [
      {
        id: "test-id",
        created_at: dates.older,
      },
    ];

    const listB: Mergeable[] = [
      {
        id: "test-id",
        created_at: dates.older,
        deleted_at: dates.newer,
      },
    ];

    const result = merge(listA, listB);

    expect(result).toEqual(listB);
  });

  it("merges items from both lists", () => {
    const listA: Mergeable[] = [
      {
        id: "test-id-1",
        created_at: dates.older,
      },
      {
        id: "test-id-2",
        created_at: dates.newer,
      },
    ];

    const listB: Mergeable[] = [
      {
        id: "test-id-1",
        created_at: dates.newer,
      },
      {
        id: "test-id-2",
        created_at: dates.older,
      },
      {
        id: "test-id-3",
        created_at: dates.older,
      },
    ];

    const result = merge(listA, listB);

    expect(result).toEqual([listB[0], listA[1], listB[2]]);
  });
});
