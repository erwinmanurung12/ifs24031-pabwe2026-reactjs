import { describe, it, expect } from "vitest";
import * as reducers from "./reducer";
import * as actions from "./action";

describe("lost-found reducers", () => {
  it("lostFounds, lostFound, stats", () => {
    expect(reducers.lostFoundsReducer(undefined)).toEqual([]);
    expect(reducers.lostFoundsReducer([], actions.setLostFoundsActionCreator([1]))).toEqual([1]);
    expect(reducers.lostFoundsReducer([2], { type: "x" })).toEqual([2]);

    expect(reducers.lostFoundReducer(undefined)).toBeNull();
    expect(reducers.lostFoundReducer(null, actions.setLostFoundActionCreator({ id: 1 }))).toEqual({ id: 1 });
    expect(reducers.lostFoundReducer({ id: 2 }, { type: "x" })).toEqual({ id: 2 });

    expect(reducers.lostFoundStatsReducer(undefined)).toBeNull();
    expect(reducers.lostFoundStatsReducer(null, actions.setLostFoundStatsActionCreator({ a: 1 }))).toEqual({ a: 1 });
    expect(reducers.lostFoundStatsReducer({ a: 2 }, { type: "x" })).toEqual({ a: 2 });
  });

  it.each([
    ["isLostFoundReducer", actions.setIsLostFoundActionCreator],
    ["isLostFoundAddReducer", actions.setIsLostFoundAddActionCreator],
    ["isLostFoundAddedReducer", actions.setIsLostFoundAddedActionCreator],
    ["isLostFoundChangeReducer", actions.setIsLostFoundChangeActionCreator],
    ["isLostFoundChangedReducer", actions.setIsLostFoundChangedActionCreator],
    ["isLostFoundChangeCoverReducer", actions.setIsLostFoundChangeCoverActionCreator],
    ["isLostFoundChangedCoverReducer", actions.setIsLostFoundChangedCoverActionCreator],
    ["isLostFoundDeleteReducer", actions.setIsLostFoundDeleteActionCreator],
    ["isLostFoundDeletedReducer", actions.setIsLostFoundDeletedActionCreator],
  ])("%s", (name, creator) => {
    const reducer = reducers[name];
    expect(reducer(undefined)).toBe(false);
    expect(reducer(false, creator(true))).toBe(true);
    expect(reducer(true, { type: "x" })).toBe(true);
  });
});
