import React, { useState } from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import Chip from "@material-ui/core/Chip"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { useStaticQuery, graphql } from "gatsby"
import { makeStyles } from "@material-ui/core/styles"
import Rating from "./Rating"

// images
import featuredAdornment from "../../images/featured-adornment.svg"
import frame from "../../images/product-frame-grid.svg"
import explore from "../../images/explore.svg"

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
  featured: {
    height: "20rem",
    width: "20rem",
    [theme.breakpoints.down("md")]: {
      height: "15rem",
      width: "15rem",
    },
  },
  frame: {
    backgroundImage: `url(${frame})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    borderRadius: 0,
    height: "24.8rem",
    width: "25rem",
    boxSizing: "border-box",
    boxShadow: theme.shadows[5],
    position: "absolute",
    zIndex: 1,
    [theme.breakpoints.down("md")]: {
      height: "19.8rem",
      width: "20rem",
    },
  },
  slide: {
    backgroundColor: theme.palette.primary.main,
    height: "20rem",
    width: "24.5rem",
    transition: "transform 0.5s ease",
    zIndex: 0,
    padding: "1rem 2rem",
    [theme.breakpoints.down("md")]: {
      height: "15.2rem",
      width: "19.5rem",
    },
  },
  slideLeft: {
    transform: "translate(-24.5rem, 0px)",
  },
  slideRight: {
    transform: "translate(24.5rem, 0px)",
  },
  slideDown: {
    transform: "translate(0rem, 17rem)",
  },
  productContainer: {
    margin: "5rem 0",
  },
  exploreContainer: {
    marginTop: "auto",
  },
  exploreButton: {
    textTransform: "none",
  },
  exploreIcon: {
    height: "1.5rem",
    marginLeft: "1rem",
  },
  chipLabel: {
    ...theme.typography.h5,
  },
  chipRoot: {
    backgroundColor: theme.palette.secondary.main,
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
      {data.allStrapiProduct.edges.map(({ node }, i) => {
        const alignment = matchesMD
          ? "center"
          : i === 0 || i === 3
          ? "flex-start"
          : i === 1 || i === 4
          ? "center"
          : "flex-end"
        return (
          <Grid
            item
            container
            justifyContent={alignment}
            key={node.strapiId}
            classes={{ root: classes.productContainer }}
            alignItems="center"
          >
            <IconButton
              onClick={() =>
                expanded === i ? setExpanded(null) : setExpanded(i)
              }
              classes={{ root: classes.frame }}
            >
              <img
                src={
                  process.env.GATSBY_STRAPI_URL + node.variants[0].images[0].url
                }
                alt={node.name}
                className={classes.featured}
              />
            </IconButton>
            <Grid
              container
              direction="column"
              classes={{
                root: clsx(classes.slide, {
                  [classes.slideLeft]:
                    !matchesMD && expanded === i && alignment === "flex-end",
                  [classes.slideRight]:
                    !matchesMD &&
                    expanded === i &&
                    (alignment === "flex-start" || alignment === "center"),
                  [classes.slideDown]: matchesMD && expanded === i,
                }),
              }}
            >
              <Grid item>
                <Typography variant="h4">{node.name.split(" ")[0]}</Typography>
              </Grid>
              <Grid item>
                <Rating number={2.5} />
              </Grid>
              <Grid item>
                <Chip
                  label={`$${node.variants[0].price}`}
                  classes={{ root: classes.chipRoot, label: classes.chipLabel }}
                />
              </Grid>
              <Grid item classes={{ root: classes.exploreContainer }}>
                <Button classes={{ root: classes.exploreButton }}>
                  <Typography variant="h5">Details</Typography>
                  <img
                    src={explore}
                    alt="go to product details"
                    className={classes.exploreIcon}
                  />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )
      })}
    </Grid>
  )
}
