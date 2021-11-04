import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { useStaticQuery, graphql } from "gatsby"
import { useQuery } from "@apollo/client"
import { makeStyles } from "@material-ui/core/styles"

import FeaturedProduct from "./FeaturedProduct"

// images
import featuredAdornment from "../../images/featured-adornment.svg"

const useStyles = makeStyles(theme => ({
  background: {
    backgroundImage: `url(${featuredAdornment})`,
    backgroundPosition: "top",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "180rem",
    padding: "0 2.5rem",
    [theme.breakpoints.down("md")]: {
      height: "220rem",
    },
  },
}))

export default function FeaturedProducts() {
  // definine classes for styling
  const classes = useStyles()

  //define state for which product slide will expand from behind product
  const [expanded, setExpanded] = useState(null)

  //determine screen size to adjust elements accordingly if smaller than medium
  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))

  // query db for featured products
  const data = useStaticQuery(graphql`
    query getFeatured {
      allStrapiProduct(filter: { featured: { eq: true } }) {
        edges {
          node {
            name
            strapiId
            variants {
              price
              images {
                url
              }
            }
          }
        }
      }
    }
  `)

  return (
    <Grid
      container
      direction="column"
      justifyContent={matchesMD ? "space-between" : "center"}
      classes={{ root: classes.background }}
    >
      {data.allStrapiProduct.edges.map(({ node }, i) => (
        <FeaturedProduct
          expanded={expanded}
          setExpanded={setExpanded}
          node={node}
          key={node.strapiId}
          i={i}
          matchesMD={matchesMD}
        />
      ))}
    </Grid>
  )
}
