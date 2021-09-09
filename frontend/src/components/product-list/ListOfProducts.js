import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"

import ProductFrameGrid from "./ProductFrameGrid"
import ProductFrameList from "./ProductFrameList"

const useStyles = makeStyles(theme => ({
  productContainer: {
    width: "95%",
    "& > *": {
      marginRight: ({ layout }) =>
        layout === "grid" ? "calc((100% - (25rem * 4)) / 3)" : 0,
      marginBottom: "5rem",
    },
    "& > :nth-child(4n)": {
      marginRight: 0,
    },
  },
}))

export default function ListOfProducts({ products, layout }) {
  const classes = useStyles({ layout })

  // contorls view between grid/list based on selected button
  const FrameHelper = ({ Frame, product, variant }) => {
    // set initial state for selected size/color of product
    const [selectedSize, setSelectedSize] = useState(null)
    const [selectedColor, setSelectedColor] = useState(null)

    var sizes = []
    var colors = []
    // map over each variants size/color to display them in info section of QuickView
    product.node.variants.map(variant => {
      sizes.push(variant.size)
      colors.push(variant.color)
    })

    return (
      <Frame
        variant={variant}
        product={product}
        sizes={sizes}
        colors={colors}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        setSelectedSize={setSelectedSize}
        setSelectedColor={setSelectedColor}
      />
    )
  }

  return (
    <Grid item container classes={{ root: classes.productContainer }}>
      {products.map(product =>
        product.node.variants.map(variant => (
          <FrameHelper
            Frame={layout === "grid" ? ProductFrameGrid : ProductFrameList}
            key={variant.id}
            variant={variant}
            product={product}
          />
        ))
      )}
    </Grid>
  )
}
