import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

import ProductFrameGrid from "../product-list/ProductFrameGrid"

const useStyles = makeStyles(theme => ({}))

export default function RecentlyViewed({ products }) {
  const classes = useStyles()

  return (
    <Grid item container>
      {products.map(product => {
        // Determine if selected product has different styles (i.e. shirts)
        const hasStyles = product.node.variants.some(
          variant => variant.style !== null
        )
        return (
          <ProductFrameGrid
            key={product.node.strapiId}
            product={product}
            variant={product.node.variants[0]}
            disableQuickView
            hasStyles={hasStyles}
          />
        )
      })}
    </Grid>
  )
}
