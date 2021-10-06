import React, { useEffect, useReducer, createContext } from "react"
import axios from "axios"
import userReducer from "../reducers/user-reducer"
import { setUser } from "../actions"

export const UserContext = createContext()
const UserProvider = UserContext.Provider

export function UserWrapper({ children }) {
  const defaultUser = { username: "Guest" }
  const storedUser = JSON.parse(localStorage.getItem("user"))
  const [user, dispatchUser] = useReducer(
    userReducer,
    storedUser || defaultUser
  )

  // handle JWT expiration.
  useEffect(() => {
    // if local storage has user info and it is valid, set the user to the stored user
    if (storedUser) {
      setTimeout(() => {
        axios
          .get(process.env.GATSBY_STRAPI_URL + "/users/me", {
            headers: {
              Authorization: `Bearer ${storedUser.jwt}`,
            },
          })
          .then(response => {
            dispatchUser(
              setUser({
                ...response.data,
                jwt: storedUser.jwt,
                onboarding: true,
              })
            )
          })
          .catch(error => {
            // if token is expired set the user to the default user of "Guest" and force user to sign in again to create new valid token
            console.error(error)
            dispatchUser(setUser(defaultUser))
          })
      }, 3000)
    }
  }, [])

  return (
    <UserProvider value={{ user, dispatchUser, defaultUser }}>
      {children}
    </UserProvider>
  )
}
