import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"

import ProductFrameGrid from "../product-list/ProductFrameGrid"

const useStyles = makeStyles(theme => ({
  recentContainer: {
    margin: "10rem 0",
    "& > :not(:last-child)": {
      marginRight: "2rem",
    },
  },
  arrow: {
    minWidth: 0,
    height: "4rem",
    width: "4rem",
    fontSize: "4rem",
    color: theme.palette.primary.main,
    borderRadius: 50,
    [theme.breakpoints.down("xs")]: {
      height: "1rem",
      width: "1rem",
    },
  },
}))

export default function RecentlyViewed({ products }) {
  const classes = useStyles()

  // set initial state for number of recently viewed products to display
  const [firstIndex, setFirstIndex] = useState(0)

  // determine style if screen size is medium/small
  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))
  const matchesSM = useMediaQuery(theme => theme.breakpoints.down("sm"))

  // determine how many products to display based on user's screen size
  const displayNum = matchesSM ? 1 : matchesMD ? 2 : 4

  // functionality to increment/decrement items shown based on button being clicked
  const handleNavigation = direction => {
    if (firstIndex === 0 && direction === "backward") return null
    if (firstIndex + displayNum === products.length && direction === "forward")
      return null
    setFirstIndex(direction === "forward" ? firstIndex + 1 : firstIndex - 1)
  }

  return (
    <Grid
      item
      container
      alignItems="center"
      justifyContent="center"
      classes={{ root: classes.recentContainer }}
    >
      <Grid item>
        <Button
          onClick={() => handleNavigation("backward")}
          classes={{ root: classes.arrow }}
        >
          {"<"}
        </Button>
      </Grid>
      {products
        ? products.slice(firstIndex, firstIndex + displayNum).map(product => {
            // Determine if selected product has different styles (i.e. shirts)
            const hasStyles = product.node.variants.some(
              variant => variant.style !== null
            )
            return (
              <ProductFrameGrid
                key={product.node.variants[product.selectedVariant].id}
                product={product}
                variant={product.node.variants[product.selectedVariant]}
                disableQuickView
                hasStyles={hasStyles}
                small
              />
            )
          })
        : null}
      <Grid item>
        <Button
          onClick={() => handleNavigation("forward")}
          classes={{ root: classes.arrow }}
        >
          {">"}
        </Button>
      </Grid>
    </Grid>
  )
}
