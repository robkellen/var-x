import { gql } from "@apollo/client"

// query for product quantity details
export const GET_DETAILS = gql`
  query getDetails($id: ID!) {
    product(id: $id) {
      variants {
        qty
      }
    }
  }
`
