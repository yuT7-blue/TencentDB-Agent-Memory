import { describe, expect, it } from "vitest";
import { parseL1Metadata, serializeL1Metadata } from "./l1-provenance.js";

describe("L1 source message provenance", () => {
  it("round-trips source ids alongside episodic metadata", () => {
    const raw = serializeL1Metadata(
      { activity_start_time: "2026-11-01T00:00:00Z" },
      ["message-1", "message-2"],
    );
    expect(parseL1Metadata(raw)).toEqual({
      metadata: { activity_start_time: "2026-11-01T00:00:00Z" },
      sourceMessageIds: ["message-1", "message-2"],
    });
  });

  it("supports legacy records without provenance", () => {
    expect(parseL1Metadata('{"activity_end_time":"yesterday"}')).toEqual({
      metadata: { activity_end_time: "yesterday" },
      sourceMessageIds: [],
    });
  });

  it("ignores malformed stored metadata and invalid source ids", () => {
    expect(parseL1Metadata("{bad")).toEqual({ metadata: {}, sourceMessageIds: [] });
    expect(parseL1Metadata('{"source_message_ids":["valid",42,null]}')).toEqual({
      metadata: {},
      sourceMessageIds: ["valid"],
    });
    expect(parseL1Metadata("null")).toEqual({ metadata: {}, sourceMessageIds: [] });
  });
});
