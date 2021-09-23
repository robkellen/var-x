import React, { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import Grid from "@material-ui/core/Grid"
import useMediaQuery from "@material-ui/core/useMediaQuery"

import Layout from "../components/ui/layout"
import ProductImages from "../components/product-detail/ProductImages"
import ProductInfo from "../components/product-detail/ProductInfo"
import RecentlyViewed from "../components/product-detail/RecentlyViewed"

import { GET_DETAILS } from "../apollo/queries"

export default function ProductDetail({
  pageContext: { name, id, category, description, variants, product },
}) {
  // set initial state of which variant/image/quantity of the product we want
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [selectedImage, setSelectedImage] = useState(0)
  const [stock, setStock] = useState(null)

  //determine if screen size is medium to adjust layout of product/info
  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))

  const params = new URLSearchParams(window.location.search)
  const style = params.get("style")

  // on page load query for product quantities for each variant
  const { loading, error, data } = useQuery(GET_DETAILS, {
    variables: { id },
  })

  useEffect(() => {
    if (error) {
      setStock(-1)
    } else if (data) {
      setStock(data.product.variants)
    }
  }, [error, data])

  // on page load pull style from url search paramater to determine the style of the product to display and set images equal to
  useEffect(() => {
    const styledVariant = variants.filter(
      variant => variant.style === params.get("style")
    )[0]

    const variantIndex = variants.indexOf(styledVariant)

    // get recently viewed items from local storage
    let recentlyViewed = JSON.parse(
      window.localStorage.getItem("recentlyViewed")
    )
    if (recentlyViewed) {
      // if 10 products exist in recentlyViewed array remove the oldest product and push the new product in
      if (recentlyViewed.length === 10) {
        recentlyViewed.shift()
      }
      if (
        !recentlyViewed.some(
          product =>
            product.node.name === name &&
            product.selectedVariant === variantIndex
        )
      ) {
        recentlyViewed.push({ ...product, selectedVariant: variantIndex })
      }
    } else {
      recentlyViewed = [{ ...product, selectedVariant: variantIndex }]
    }

    window.localStorage.setItem(
      "recentlyViewed",
      JSON.stringify(recentlyViewed)
    )

    setSelectedVariant(variantIndex)
  }, [style])

  return (
    <Layout>
      <Grid container direction="column">
        <Grid item container direction={matchesMD ? "column" : "row"}>
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
            stock={stock}
          />
        </Grid>
        <RecentlyViewed
          products={JSON.parse(window.localStorage.getItem("recentlyViewed"))}
        />
      </Grid>
    </Layout>
  )
}
