import React, { useState, useRef } from "react"
import Grid from "@material-ui/core/Grid"
import Fab from "@material-ui/core/Fab"
import Pagination from "@material-ui/lab/Pagination"
import { graphql } from "gatsby"
import { makeStyles } from "@material-ui/core/styles"

import Layout from "../components/ui/layout"
import DynamicToolbar from "../components/product-list/DynamicToolbar"
import ListOfProducts from "../components/product-list/ListOfProducts"

const useStyles = makeStyles(theme => ({
  fab: {
    alignSelf: "flex-end",
    marginRight: "2rem",
    marginBottom: "2rem",
    color: "#fff",
    fontFamily: "Montserrat",
    fontSize: "5rem",
    width: "5rem",
    height: "5rem",
  },
  pagination: {
    alignSelf: "flex-end",
    marginRight: "2%",
    marginTop: "-3rem",
    marginBottom: "4rem",
    [theme.breakpoints.down("md")]: {
      marginTop: "1rem",
    },
  },
  "@global": {
    ".MuiPaginationItem-root": {
      fontFamily: "Montserrat",
      fontSize: "2rem",
      color: theme.palette.primary.main,
      "&.Mui-selected": {
        color: "#fff",
      },
    },
  },
}))

export default function ProductList({
  pageContext: { filterOptions: options, name, description },
  data: {
    allStrapiProduct: { edges: products },
  },
}) {
  const classes = useStyles()

  // set initial state for background color of selected button
  const [layout, setLayout] = useState("grid")

  // set initial page for current page
  const [page, setPage] = useState(1)

  // set initial state for how products are filtered
  const [filterOptions, setFilterOptions] = useState(options)

  // determine where on page user is to implement functionality to scroll to top Fab
  const scrollRef = useRef(null)

  // access where user is and scroll back up to top of toolbar when Fab is clicked
  const scroll = () => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" })
  }

  // set how many items are present on page based on number of products
  const productsPerPage = layout === "grid" ? 16 : 6
  let numVariants = 0
  products.map(product => (numVariants += product.node.variants.length))

  const numPages = Math.ceil(numVariants / productsPerPage)

  return (
    <Layout>
      <Grid container direction="column" alignItems="center">
        {/* div to use as reference for Fab button to scroll to top of DynamicToolbar */}
        <div ref={scrollRef} />
        <DynamicToolbar
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          name={name}
          description={description}
          layout={layout}
          setLayout={setLayout}
          setPage={setPage}
        />
        <ListOfProducts
          page={page}
          productsPerPage={productsPerPage}
          products={products}
          layout={layout}
          filterOptions={filterOptions}
        />
        <Pagination
          count={numPages}
          page={page}
          onChange={(e, newPage) => setPage(newPage)}
          color="primary"
          classes={{ root: classes.pagination }}
        />
        <Fab onClick={scroll} color="primary" classes={{ root: classes.fab }}>
          ^
        </Fab>
      </Grid>
    </Layout>
  )
}

export const query = graphql`
  query GetCategoryProducts($id: String!) {
    allStrapiProduct(filter: { category: { id: { eq: $id } } }) {
      edges {
        node {
          strapiId
          name
          category {
            name
          }
          variants {
            color
            id
            price
            size
            style
            colorLabel
            images {
              url
            }
          }
        }
      }
    }
  }
`
