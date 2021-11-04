import React, { useState, useEffect, useContext } from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import Chip from "@material-ui/core/Chip"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"

import Rating from "../home/Rating"
import Sizes from "../product-list/Sizes"
import Swatches from "../product-list/Swatches"
import QtyButton from "../product-list/QtyButton"
import { colorIndex } from "../product-list/ProductFrameGrid"

import { UserContext, FeedbackContext } from "../../contexts"
import { setSnackbar } from "../../contexts/actions"

// images
import favorite from "../../images/favorite.svg"
import subscription from "../../images/subscription.svg"

const useStyles = makeStyles(theme => ({
  background: {
    backgroundColor: theme.palette.secondary.main,
    height: "45rem",
    width: "35rem",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      height: "58rem",
    },
  },
  center: {
    backgroundColor: theme.palette.primary.main,
    height: "35rem",
    width: "45rem",
    position: "absolute",
    [theme.breakpoints.down("lg")]: {
      width: "40rem",
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      height: "48rem",
    },
  },
  icon: {
    height: "4rem",
    width: "4rem",
    margin: "0.5rem 1rem",
  },
  sectionContainer: {
    height: "calc(100% / 3)",
  },
  descriptionContainer: {
    backgroundColor: theme.palette.secondary.main,
    overflowY: "auto",
    padding: "0.5rem 1rem",
  },
  name: {
    color: "#fff",
  },
  reviewButton: {
    textTransform: "none",
    marginLeft: "-8px",
  },
  detailsContainer: {
    padding: "0.5rem 1rem",
  },
  chipContainer: {
    marginTop: "1rem",
    [theme.breakpoints.down("xs")]: {
      marginTop: 0,
      marginBottom: "1rem",
    },
  },
  chipRoot: {
    height: "3rem",
    width: "auto",
    borderRadius: 50,
  },
  chipLabel: {
    fontSize: "2rem",
  },
  stock: {
    color: "#fff",
  },
  sizesAndSwatches: {
    maxWidth: "13rem",
  },
  actionsContainer: {
    padding: "0 1rem",
  },
  "@global": {
    ".MuiButtonGroup-groupedOutlinedVertical:not(:first-child)": {
      marginTop: 0,
    },
  },
}))

// handle displaying stock quantity
export const getStockDisplay = (stock, variant) => {
  switch (stock) {
    case undefined:
    case null:
      return "Loading Inventory..."

    case -1:
      return "Error Loading Inventory"

    default:
      if (stock[variant].qty === 0) {
        return "Currently Out Of Stock"
      } else {
        return `${stock[variant].qty} Currently In Stock`
      }
  }
}

export default function ProductInfo({
  name,
  description,
  variants,
  selectedVariant,
  setSelectedVariant,
  stock,
  setEdit,
}) {
  const classes = useStyles()
  const { user } = useContext(UserContext)
  const { dispatchFeedback } = useContext(FeedbackContext)

  // set initial state for size/color of product
  const [selectedSize, setSelectedSize] = useState(
    variants[selectedVariant].size
  )
  const [selectedColor, setSelectedColor] = useState(null)

  // determine styling for product info section if screen size is extra small
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

  // define list of available colors to select from
  const imageIndex = colorIndex(
    { node: { variants } },
    variants[selectedVariant],
    selectedColor
  )

  const sizes = []
  const colors = []
  variants.map(variant => {
    sizes.push(variant.size)

    if (
      !colors.includes(variant.color) &&
      variant.size === selectedSize &&
      variant.style === variants[selectedVariant].style
    ) {
      colors.push(variant.color)
    }
  })

  // if user selects a new size of product default to the first color available in that product
  useEffect(() => {
    setSelectedColor(null)

    const newVariant = variants.find(
      variant =>
        variant.size === selectedSize &&
        variant.style === variants[selectedVariant].style &&
        variant.color === colors[0]
    )

    setSelectedVariant(variants.indexOf(newVariant))
  }, [selectedSize])

  // set the image of the product to the selected variant when the page loads
  useEffect(() => {
    if (imageIndex !== -1) {
      setSelectedVariant(imageIndex)
    }
  }, [imageIndex])

  // handle displaying stock quantity
  const stockDisplay = getStockDisplay(stock, selectedVariant)

  // scroll user down to review section of the page when "Leave A Review" button is clicked
  const handleEdit = () => {
    if (user.username === "Guest") {
      dispatchFeedback(
        setSnackbar({
          status: "error",
          message: "You must be logged in to leave a review.",
        })
      )
      return
    }

    setEdit(true)

    const reviewRef = document.getElementById("reviews")
    reviewRef.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <Grid
      item
      container
      justifyContent="center"
      alignItems="flex-end"
      direction="column"
      lg={6}
    >
      <Grid
        item
        container
        justifyContent="flex-end"
        classes={{ root: classes.background }}
      >
        <Grid item>
          <img
            src={favorite}
            alt="add item to favorites"
            className={classes.icon}
          />
        </Grid>
        <Grid item>
          <img
            src={subscription}
            alt="add item to subscriptions"
            className={classes.icon}
          />
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction="column"
        classes={{ root: classes.center }}
      >
        <Grid
          item
          container
          justifyContent="space-between"
          direction={matchesXS ? "column" : "row"}
          classes={{
            root: clsx(classes.sectionContainer, classes.detailsContainer),
          }}
        >
          <Grid item>
            <Grid container direction="column">
              <Grid item>
                <Typography variant="h1" classes={{ root: classes.name }}>
                  {name.split(" ")[0]}
                </Typography>
              </Grid>
              <Grid item>
                <Rating number={4.5} />
              </Grid>
              <Grid item>
                <Button onClick={handleEdit}>
                  <Typography
                    variant="body2"
                    classes={{ root: classes.reviewButton }}
                  >
                    Leave a Review {">"}
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item classes={{ root: classes.chipContainer }}>
            <Chip
              classes={{ root: classes.chipRoot, label: classes.chipLabel }}
              label={`$${variants[selectedVariant].price}`}
            />
          </Grid>
        </Grid>
        <Grid
          item
          container
          classes={{
            root: clsx(classes.sectionContainer, classes.descriptionContainer),
          }}
        >
          <Grid item>
            <Typography variant="h5">Description</Typography>
            <Typography variant="body2">{description}</Typography>
          </Grid>
        </Grid>
        <Grid
          item
          container
          justifyContent={matchesXS ? "space-around" : "space-between"}
          alignItems={matchesXS ? "flex-start" : "center"}
          direction={matchesXS ? "column" : "row"}
          classes={{
            root: clsx(classes.actionsContainer, classes.sectionContainer),
          }}
        >
          <Grid item>
            <Grid container direction="column">
              <Grid item classes={{ root: classes.sizesAndSwatches }}>
                <Sizes
                  sizes={sizes}
                  selectedSize={selectedSize}
                  setSelectedSize={setSelectedSize}
                />
                <Swatches
                  colors={colors}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                />
              </Grid>
              <Grid item>
                <Typography variant="h3" classes={{ root: classes.stock }}>
                  {stockDisplay}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <QtyButton
              stock={stock}
              selectedVariant={selectedVariant}
              name={name}
              variants={variants}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
