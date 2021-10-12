import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
} from "../actions/action-types"

export default function cartReducer(state, action) {
  let newCart = [...state]

  let existingIndex

  // find index of item in cart if one exists
  if (action.payload) {
    existingIndex = state.findIndex(
      item => item.variant === action.payload.variant
    )
  }

  // helper function to maintain persistence of data in local storage
  const saveData = cart => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }

  switch (action.type) {
    case ADD_TO_CART:
      if (existingIndex !== -1) {
        let newQty = newCart[existingIndex].qty + action.payload.qty

        // don't allow user to add more items than is available for that current item's stock
        if (newQty > action.payload.stock) {
          newQty = action.payload.stock
        }

        newCart[existingIndex] = { ...newCart[existingIndex], qty: newQty }
      } else {
        newCart.push(action.payload)
      }

      saveData(newCart)

      return newCart

    case REMOVE_FROM_CART:
      const newQty = newCart[existingIndex].qty - action.payload.qty

      if (newQty <= 0) {
        newCart = newCart.filter(
          item => item.variant !== action.payload.variant
        )
      } else {
        newCart[existingIndex] = { ...newCart[existingIndex], qty: newQty }
      }

      saveData(newCart)

      return newCart

    case CLEAR_CART:
      localStorage.removeItem("cart")

      return []

    default:
      return state
  }
}
