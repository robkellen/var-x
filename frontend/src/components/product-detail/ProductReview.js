import React, { useContext, useState, useRef } from "react"
import axios from "axios"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from "@material-ui/core/styles"

import Rating from "../home/Rating"
import Fields from "../auth/Fields"

import { FeedbackContext } from "../../contexts"
import { setSnackbar } from "../../contexts/actions"

const useStyles = makeStyles(theme => ({
  light: {
    color: theme.palette.primary.main,
  },
  date: {
    marginTop: "-0.5rem",
  },
  reviewButtonText: {
    color: "#fff",
    fontFamily: "Montserrat",
    fontWeight: 600,
  },
  cancelButtonText: {
    color: theme.palette.primary.main,
    fontFamily: "Montserrat",
    fontWeight: 600,
  },
  buttonContainer: {
    marginTop: "1rem",
  },
  rating: {
    cursor: "pointer",
  },
  review: {
    marginBottom: "3rem",
  },
  delete: {
    backgroundColor: theme.palette.error.main,
    marginLeft: "0.5rem",
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
  "@global": {
    ".MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before":
      {
        borderBottom: `2px solid ${theme.palette.primary.main}`,
      },
    ".MuiInput-underline:after": {
      borderBottom: `2px solid ${theme.palette.secondary.main}`,
    },
  },
}))

export default function ProductReview({
  product,
  reviews,
  setReviews,
  review,
  setEdit,
  user,
}) {
  const classes = useStyles()

  const { dispatchFeedback } = useContext(FeedbackContext)
  const ratingRef = useRef(null)

  // check for existing review from current user
  const found = !review
    ? reviews.find(review => review.user.username === user.username)
    : null

  const [values, setValues] = useState({ message: found ? found.text : "" })
  const [tempRating, setTempRating] = useState(0)
  const [rating, setRating] = useState(
    review ? review.rating : found ? found.rating : null
  )
  const [loading, setLoading] = useState(null)

  const fields = {
    message: {
      helperText: "",
      placeholder: "Write your review.",
    },
  }

  // functionaly to place a review for a product
  const handleReview = option => {
    setLoading(option === "delete" ? "delete-review" : "leave-review")

    const axiosFunction =
      option === "delete" ? axios.delete : found ? axios.put : axios.post
    const route =
      found || option === "delete" ? `/reviews/${found.id}` : "/reviews"

    const auth = {
      Authorization: `Bearer ${user.jwt}`,
    }

    axiosFunction(
      process.env.GATSBY_STRAPI_URL + route,
      {
        text: values.message,
        product,
        rating,
        headers: option === "delete" ? auth : undefined,
      },
      {
        headers: auth,
      }
    )
      .then(response => {
        setLoading(null)

        dispatchFeedback(
          setSnackbar({
            status: "success",
            message: `Review Successfully ${
              option === "delete" ? "Deleted" : "Submitted"
            }!`,
          })
        )

        let newReviews = [...reviews]
        const reviewIndex = newReviews.indexOf(found)

        if (option === "delete") {
          newReviews = newReviews.filter(review => review !== found)
        } else if (found) {
          newReviews[reviewIndex] = response.data
        } else {
          newReviews = [response.data, ...newReviews]
        }

        setReviews(newReviews)
        setEdit(false)
      })
      .catch(error => {
        setLoading(null)
        console.error(error)

        dispatchFeedback(
          setSnackbar({
            status: "error",
            message: `There was a problem ${
              option === "delete" ? "removing" : "leaving"
            } your review.  Please try again.`,
          })
        )
      })
  }

  // conditions to disable leave review button
  const buttonDisabled = found
    ? found.text === values.message && found.rating === rating
    : !rating

  return (
    <Grid item container direction="column" classes={{ root: classes.review }}>
      <Grid item container justifyContent="space-between">
        <Grid item>
          <Typography variant="h4" classes={{ root: classes.light }}>
            {review ? review.user.username : user.username}
          </Typography>
        </Grid>
        <Grid
          item
          classes={{ root: clsx({ [classes.rating]: !review }) }}
          ref={ratingRef}
          onClick={() => (review ? null : setRating(tempRating))}
          onMouseMove={e => {
            if (review) return

            // calculate % of grid item that mouse is over to determine how many stars user is hovering over
            const hoverRating =
              ((ratingRef.current.getBoundingClientRect().left - e.clientX) /
                ratingRef.current.getBoundingClientRect().width) *
              -5

            setTempRating(Math.round(hoverRating * 2) / 2)
          }}
          onMouseLeave={() => {
            if (tempRating > rating) {
              setTempRating(rating)
            }
          }}
        >
          <Rating
            number={rating > tempRating ? rating : tempRating}
            size={2.5}
          />
        </Grid>
      </Grid>
      <Grid item>
        <Typography
          variant="h5"
          classes={{ root: clsx(classes.light, classes.date) }}
        >
          {review
            ? new Date(review.updatedAt).toLocaleString([], {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })
            : new Date().toLocaleDateString()}
        </Typography>
      </Grid>
      <Grid item>
        {review ? (
          <Typography variant="body1">{review.text}</Typography>
        ) : (
          <Fields
            values={values}
            setValues={setValues}
            fields={fields}
            fullWidth
            noError
          />
        )}
      </Grid>
      {review ? null : (
        <Grid item container classes={{ root: classes.buttonContainer }}>
          <Grid item>
            {loading === "leave-review" ? (
              <CircularProgress />
            ) : (
              <Button
                disabled={buttonDisabled}
                onClick={handleReview}
                variant="contained"
                color="primary"
              >
                <span className={classes.reviewButtonText}>
                  {found ? "Edit" : "Leave"} Review
                </span>
              </Button>
            )}
          </Grid>
          {found ? (
            <Grid item>
              {loading === "delete-review" ? (
                <CircularProgress />
              ) : (
                <Button
                  onClick={() => handleReview("delete")}
                  variant="contained"
                  classes={{ root: classes.delete }}
                >
                  <span className={classes.reviewButonText}>Delete</span>
                </Button>
              )}
            </Grid>
          ) : null}
          <Grid item>
            <Button onClick={() => setEdit(false)}>
              <span className={classes.cancelButtonText}>Cancel</span>
            </Button>
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}
