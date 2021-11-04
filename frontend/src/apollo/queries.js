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

// query for product reviews
export const GET_REVIEWS = gql`
  query getReviews($id: ID!) {
    product(id: $id) {
      reviews {
        id
        text
        rating
        updatedAt
        user {
          username
        }
      }
    }
  }
`
