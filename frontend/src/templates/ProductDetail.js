import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"

import Layout from "../components/ui/layout"
import ProductImages from "../components/product-detail/ProductImages"
import ProductInfo from "../components/product-detail/ProductInfo"

export default function ProductDetail({
  pageContext: { name, id, category, description, variants },
}) {
  // set initial state of which variant/image of the product we want
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [selectedImage, setSelectedImage] = useState(0)

  // on page load pull style from url search paramater to determine the style of the product to display and set images equal to
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const styledVariant = variants.filter(
      variant => variant.style === params.get("style")
    )[0]
    setSelectedVariant(variants.indexOf(styledVariant))
  }, [])

  return (
    <Layout>
      <Grid container direction="column">
        <Grid item container>
          <ProductImages
            images={variants[selectedVariant].images}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
          <ProductInfo
            name={name}
            description={description}
            variants={variants}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
          />
        </Grid>
      </Grid>
    </Layout>
  )
}
