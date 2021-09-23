import React, { useState, useRef, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import Fab from "@material-ui/core/Fab"
import Pagination from "@material-ui/lab/Pagination"
import { graphql } from "gatsby"
import { makeStyles } from "@material-ui/core/styles"

import Layout from "../components/ui/layout"
import DynamicToolbar from "../components/product-list/DynamicToolbar"
import ListOfProducts from "../components/product-list/ListOfProducts"
import {
  alphabetic,
  time,
  price,
} from "../components/product-list/SortFunctions"

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

  // set options for how products can be sorted and their initial state
  const [sortOptions, setSortOptions] = useState([
    { label: "A-Z", active: true, function: data => alphabetic(data, "asc") },
    { label: "Z-A", active: false, function: data => alphabetic(data, "desc") },
    { label: "NEWEST", active: false, function: data => time(data, "asc") },
    { label: "OLDEST", active: false, function: data => time(data, "desc") },
    { label: "PRICE ↑", active: false, function: data => price(data, "asc") },
    { label: "PRICE ↓", active: false, function: data => price(data, "desc") },
    { label: "REVIEWS", active: false, function: data => data },
  ])

  // determine where on page user is to implement functionality to scroll to top Fab
  const scrollRef = useRef(null)

  // access where user is and scroll back up to top of toolbar when Fab is clicked
  const scroll = () => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" })
  }

  // any time the filterOptions changes set the page number back to 1
  useEffect(() => {
    setPage(1)
  }, [filterOptions, layout])

  // set how many items are present on page based on number of products
  const productsPerPage = layout === "grid" ? 16 : 6

  let content = []

  // determine which sort option to apply
  const selectedSort = sortOptions.filter(option => option.active)[0]

  const sortedProducts = selectedSort.function(products)

  sortedProducts.map((product, i) =>
    product.node.variants.map(variant => content.push({ product: i, variant }))
  )

  // set initial status of our items being filtered as false
  let isFiltered = false
  // use this to store list of currently active filters
  let filters = {}
  let filteredProducts = []

  // test if value of item selected is equal to value of variant option and display that item if true
  Object.keys(filterOptions)
    .filter(option => filterOptions[option] !== null)
    .map(option => {
      filterOptions[option].forEach(value => {
        if (value.checked) {
          isFiltered = true
          if (filters[option] === undefined) {
            filters[option] = []
          }
          if (!filters[option].includes(value)) {
            filters[option].push(value)
          }

          content.forEach(item => {
            if (option === "Color") {
              if (
                item.variant.colorLabel === value.label &&
                !filteredProducts.includes(item)
              ) {
                filteredProducts.push(item)
              }
              // filter by style
            } else if (
              item.variant[option.toLowerCase()] === value.label &&
              !filteredProducts.includes(item)
            ) {
              filteredProducts.push(item)
            }
          })
        }
      })
    })

  //Check active filters and for each one get rid of all products that don't match every selected filter category
  Object.keys(filters).forEach(filter => {
    filteredProducts = filteredProducts.filter(item => {
      let valid

      filters[filter].some(value => {
        // check for color if hats are being filtered
        if (filter === "Color") {
          if (item.variant.colorLabel === value.label) {
            valid = item
          }
          // check for size/style if filtering for hats/hoodies
        } else if (item.variant[filter.toLowerCase()] === value.label) {
          valid = item
        }
      })

      return valid
    })
  })

  if (isFiltered) {
    content = filteredProducts
  }

  const numPages = Math.ceil(content.length / productsPerPage)

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
          sortOptions={sortOptions}
          setSortOptions={setSortOptions}
        />
        <ListOfProducts
          page={page}
          productsPerPage={productsPerPage}
          products={products}
          layout={layout}
          filterOptions={filterOptions}
          content={content}
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
          createdAt
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
