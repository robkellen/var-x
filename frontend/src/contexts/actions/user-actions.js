import { SET_USER } from "./action-types"

// action creator for setting the current user
export const setUser = user => {
  return {
    type: SET_USER,
    payload: { user },
  }
}
