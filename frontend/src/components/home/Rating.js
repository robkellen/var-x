import React from "react"
import { makeStyles } from "@material-ui/core/styles"

// images
import fullStar from "../../images/full-star.svg"
import halfStar from "../../images/half-star.svg"
import emptyStar from "../../images/empty-star.svg"

const useStyles = makeStyles(theme => ({
  size: {
    height: ({ size }) => `${size || 2}rem`,
    width: ({ size }) => `${size || 2}rem`,
  },
}))

export default function Rating({ number, size }) {
  // define styles
  const classes = useStyles({ size })

  const diff = 5 - Math.ceil(number)

  return (
    <>
      {[...Array(Math.floor(number))].map((e, i) => (
        <img src={fullStar} alt="full star" key={i} className={classes.size} />
      ))}
      {number % 1 !== 0 ? (
        <img src={halfStar} alt="half star" className={classes.size} />
      ) : null}
      {[...Array(diff)].map((e, i) => (
        <img
          src={emptyStar}
          alt="empty star"
          key={`${i}-empty`}
          className={classes.size}
        />
      ))}
    </>
  )
}
