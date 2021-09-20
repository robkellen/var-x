import React, { useState, useEffect } from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Chip from "@material-ui/core/Chip"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"

import Rating from "../home/Rating"
import Sizes from "../product-list/Sizes"
import Swatches from "../product-list/Swatches"
import QtyButton from "../product-list/QtyButton"
import { colorIndex } from "../product-list/ProductFrameGrid"

// images
import favorite from "../../images/favorite.svg"
import subscription from "../../images/subscription.svg"

const useStyles = makeStyles(theme => ({
  background: {
    backgroundColor: theme.palette.secondary.main,
    height: "45rem",
    width: "35rem",
  },
  center: {
    backgroundColor: theme.palette.primary.main,
    height: "35rem",
    width: "45rem",
    position: "absolute",
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
  },
  detailsContainer: {
    padding: "0.5rem 1rem",
  },
  chipContainer: {
    marginTop: "1rem",
  },
  chipRoot: {
    height: "3rem",
    width: "9rem",
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

export default function ProductInfo({
  name,
  description,
  variants,
  selectedVariant,
  setSelectedVariant,
}) {
  const classes = useStyles()

  // set initial state for size/color of product
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)

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

    if (!colors.includes(variant.color)) {
      colors.push(variant.color)
    }
  })

  useEffect(() => {
    if (imageIndex !== -1) {
      setSelectedVariant(imageIndex)
    }
  }, [imageIndex])

  return (
    <Grid
      item
      container
      justifyContent="center"
      alignItems="flex-end"
      direction="column"
      xs={6}
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
                <Button>
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
          justifyContent="space-between"
          alignItems="center"
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
                  12 Currently in Stock
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <QtyButton />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
