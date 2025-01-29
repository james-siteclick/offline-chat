import { describe, expect, it } from "vitest";
import { getMaxDate } from "./date";

describe("getMaxDate", () => {
  it("gets the max date from a list of dates", () => {
    const dates: Date[] = [
      new Date("2025-01-01T00:00:00Z"),
      new Date("2025-01-03T00:00:00Z"),
      new Date("2025-01-02T00:00:00Z"),
    ];

    expect(getMaxDate(dates)).toEqual(dates[1]);
  });
});
