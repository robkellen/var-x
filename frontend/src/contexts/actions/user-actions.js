import { SET_USER } from "./action-types"

// action creator for setting the current user
export const setUser = user => ({
  type: SET_USER,
  payload: { user },
})
