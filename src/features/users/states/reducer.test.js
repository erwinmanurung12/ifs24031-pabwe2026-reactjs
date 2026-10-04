import { describe, it, expect } from "vitest";
import * as reducers from "./reducer";
import * as actions from "./action";

describe("users reducers", () => {
  it("users, user, profile", () => {
    expect(reducers.usersReducer(undefined)).toEqual([]);
    expect(reducers.usersReducer([], actions.setUsersActionCreator([1]))).toEqual([1]);
    expect(reducers.usersReducer([2], { type: "x" })).toEqual([2]);

    expect(reducers.userReducer(undefined)).toBeNull();
    expect(reducers.userReducer(null, actions.setUserActionCreator({ id: 1 }))).toEqual({ id: 1 });
    expect(reducers.userReducer({ id: 2 }, { type: "x" })).toEqual({ id: 2 });

    expect(reducers.profileReducer(undefined)).toBeNull();
    expect(reducers.profileReducer(null, actions.setProfileActionCreator({ id: 1 }))).toEqual({ id: 1 });
    expect(reducers.profileReducer({ id: 2 }, { type: "x" })).toEqual({ id: 2 });
  });

  it.each([
    ["isProfileReducer", actions.setIsProfileActionCreator],
    ["isChangeProfileReducer", actions.setIsChangeProfileActionCreator],
    ["isChangeProfilePhotoReducer", actions.setIsChangeProfilePhotoActionCreator],
    ["isChangeProfilePasswordReducer", actions.setIsChangeProfilePasswordActionCreator],
  ])("%s", (name, creator) => {
    const reducer = reducers[name];
    expect(reducer(undefined)).toBe(false);
    expect(reducer(false, creator(true))).toBe(true);
    expect(reducer(true, { type: "x" })).toBe(true);
  });
});
