import React, { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import Grid from "@material-ui/core/Grid"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"

import ProductFrameGrid from "./ProductFrameGrid"
import ProductFrameList from "./ProductFrameList"

import { GET_DETAILS } from "../../apollo/queries"

const useStyles = makeStyles(theme => ({
  productContainer: {
    width: "95%",
    [theme.breakpoints.only("xl")]: {
      "& > *": {
        marginRight: ({ layout }) =>
          layout === "grid" ? "calc((100% - (25rem * 4)) / 3)" : 0,
        marginBottom: "5rem",
      },
      "& > :nth-child(4n)": {
        marginRight: 0,
      },
    },
    [theme.breakpoints.only("lg")]: {
      "& > *": {
        marginRight: ({ layout }) =>
          layout === "grid" ? "calc((100% - (25rem * 3)) / 2)" : 0,
        marginBottom: "5rem",
      },
      "& > :nth-child(3n)": {
        marginRight: 0,
      },
    },
    [theme.breakpoints.only("md")]: {
      "& > *": {
        marginRight: ({ layout }) =>
          layout === "grid" ? "calc(100% - (25rem * 2))" : 0,
        marginBottom: "5rem",
      },
      "& > :nth-child(2n)": {
        marginRight: 0,
      },
    },
    [theme.breakpoints.only("sm")]: {
      "& > *": {
        marginBottom: "5rem",
      },
    },
  },
}))

export default function ListOfProducts({
  products,
  layout,
  page,
  productsPerPage,
  filterOptions,
  content,
}) {
  const classes = useStyles({ layout })

  //determine if screen size is small to adjust layout of products
  const matchesSM = useMediaQuery(theme => theme.breakpoints.down("sm"))
  // contorls view between grid/list based on selected button
  const FrameHelper = ({ Frame, product, variant }) => {
    // set initial state for selected size/color/quantity/variant of product
    const [selectedSize, setSelectedSize] = useState(null)
    const [selectedColor, setSelectedColor] = useState(null)
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [stock, setStock] = useState(null)
    const [rating, setRating] = useState(0)

    // on page load query for product quantities for each variant
    const { loading, error, data } = useQuery(GET_DETAILS, {
      variables: { id: product.node.strapiId },
    })

    useEffect(() => {
      if (error) {
        setStock(-1)
      } else if (data) {
        setStock(data.product.variants)
        setRating(data.product.rating)
      }
    }, [error, data])

    // if user selects a new size of product default to the first color available in that product
    useEffect(() => {
      // this if statement stops this effect on initial page load.  this useEffect will only fire if selected size is changed from initial variant.size
      if (selectedSize === null) return undefined

      setSelectedColor(null)

      const newVariant = product.node.variants.find(
        item =>
          item.size === selectedSize &&
          item.style === variant.style &&
          item.color === colors[0]
      )

      setSelectedVariant(newVariant)
    }, [selectedSize])

    var sizes = []
    var colors = []
    // map over each variants size/color to display them in info section of QuickView
    product.node.variants.map(item => {
      sizes.push(item.size)
      if (
        !colors.includes(item.color) &&
        item.size === (selectedSize || variant.size) &&
        item.style === variant.style
      ) {
        colors.push(item.color)
      }
    })

    // Determine if selected product has different styles (i.e. shirts)
    const hasStyles = product.node.variants.some(
      variant => variant.style !== null
    )

    return (
      <Frame
        variant={selectedVariant || variant}
        product={product}
        sizes={sizes}
        colors={colors}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        setSelectedSize={setSelectedSize || variant.size}
        setSelectedColor={setSelectedColor}
        hasStyles={hasStyles}
        stock={stock}
        rating={rating}
      />
    )
  }

  return (
    <Grid
      item
      container
      classes={{ root: classes.productContainer }}
      direction={matchesSM ? "column" : "row"}
      alignItems={matchesSM ? "center" : undefined}
    >
      {content
        .slice((page - 1) * productsPerPage, page * productsPerPage)
        .map(item => (
          <FrameHelper
            Frame={layout === "grid" ? ProductFrameGrid : ProductFrameList}
            key={item.variant.id}
            variant={item.variant}
            product={products[item.product]}
          />
        ))}
    </Grid>
  )
}
