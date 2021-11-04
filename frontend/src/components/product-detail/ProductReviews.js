import React, { useState, useEffect, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import { useQuery } from "@apollo/client"

import { UserContext } from "../../contexts"

import { StyledPagination } from "../../templates/ProductList"

import ProductReview from "./ProductReview"
import { GET_REVIEWS } from "../../apollo/queries"

const useStyles = makeStyles(theme => ({
  reviews: {
    padding: "0 3rem",
  },
  pagination: {
    marginBottom: "3rem",
  },
}))

export default function ProductReviews({ product, edit, setEdit, review }) {
  const classes = useStyles()
  const { user } = useContext(UserContext)
  const [reviews, setReviews] = useState([])
  const [page, setPage] = useState(1)

  // query for product reviews
  const { data } = useQuery(GET_REVIEWS, { variables: { id: product } })

  useEffect(() => {
    if (data) {
      setReviews(data.product.reviews)
    }
  }, [data])

  // set up pagination for reviews section
  const reviewsPerPage = 15
  const numPages = Math.ceil(reviews.length / reviewsPerPage)

  return (
    <Grid
      id="reviews"
      item
      container
      direction="column"
      classes={{ root: classes.reviews }}
    >
      {edit && (
        <ProductReview
          user={user}
          product={product}
          setEdit={setEdit}
          reviews={reviews}
          setReviews={setReviews}
        />
      )}
      {reviews
        .filter(review =>
          edit ? review.user.username !== user.username : review
        )
        .slice((page - 1) * reviewsPerPage, page * reviewsPerPage)
        .map(review => (
          <ProductReview
            key={review.id}
            product={product}
            review={review}
            reviews={reviews}
          />
        ))}
      <Grid item container justifyContent="flex-end">
        <Grid item>
          <StyledPagination
            classes={{ root: classes.pagination }}
            count={numPages}
            page={page}
            onChange={(e, newPage) => setPage(newPage)}
            color="primary"
          />
        </Grid>
      </Grid>
    </Grid>
  )
}
