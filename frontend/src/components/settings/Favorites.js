import React, { useContext, useState, useEffect } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import Chip from "@material-ui/core/Chip"
import { DataGrid } from "@material-ui/data-grid"
import { makeStyles } from "@material-ui/core/styles"

import Sizes from "../product-list/Sizes"
import Swatches from "../product-list/Swatches"
import QtyButton from "../product-list/QtyButton"

import DeleteIcon from "../../images/Delete"

import { UserContext, FeedbackContext } from "../../contexts"
import { setSnackbar } from "../../contexts/actions"
import Favorite from "../ui/Favorite"

const useStyles = makeStyles(theme => ({
  container: {
    height: "100%",
    width: "100%",
  },
  image: {
    height: "10rem",
    width: "10rem",
  },
  name: {
    color: "#fff",
  },
  chipRoot: {
    height: "3rem",
    width: "10rem",
    borderRadius: 50,
  },
  deleteWrapper: {
    height: "2rem",
    width: "2rem",
  },
}))

export default function Favorites() {
  const classes = useStyles()
  const [products, setProducts] = useState([])
  const [selectedVariants, setSelectedVariants] = useState({})
  const [selectedSizes, setSelectedSizes] = useState({})
  const [selectedColors, setSelectedColors] = useState({})
  const { user } = useContext(UserContext)
  const { dispatchFeedback } = useContext(FeedbackContext)

  // helper function to set selected variants, sizes and colors
  const setSelectedHelper = (selectedFunction, values, value, row) => {
    selectedFunction({ ...values, [row]: value })

    // update selected variant every time someone changes the color/size of product in the data grid
    const { variants } = products.find(favorite => favorite.id === row)
    const selectedVariant = selectedVariants[row]

    let newVariant

    if (value.includes("#")) {
      newVariant = variants.find(
        variant =>
          variant.size === selectedSizes[row] &&
          variant.style === variants[selectedVariant].style &&
          variant.color === value
      )
    } else {
      let newColors = []
      variants.map(variant => {
        if (
          !newColors.includes(variant.color) &&
          variant.size === value &&
          variants[selectedVariant].style === variant.style
        ) {
          newColors.push(variant.color)
        }
      })

      newVariant = variants.find(
        variant =>
          variant.size === value &&
          variant.style === variants[selectedVariant].style &&
          variant.color === newColors[0]
      )
    }
    setSelectedVariants({
      ...selectedVariants,
      [row]: variants.indexOf(newVariant),
    })
  }

  const createData = data =>
    data.map(item => {
      const selectedVariant = selectedVariants[item.id]

      return {
        item: {
          name: item.variants[selectedVariant].product.name.split(" ")[0],
          image: item.variants[selectedVariant].images[0].url,
        },
        variant: {
          all: item.variants,
          current: item.variant,
        },
        quantity: item.variants,
        price: item.variants[selectedVariant].price,
        id: item.id,
      }
    })

  const columns = [
    {
      field: "item",
      headerName: "Item",
      width: 250,
      renderCell: ({ value }) => (
        <Grid container direction="column">
          <Grid item>
            <img
              src={process.env.GATSBY_STRAPI_URL + value.image}
              alt={value.name}
              className={classes.image}
            />
          </Grid>
          <Grid item>
            <Typography variant="h3" classes={{ root: classes.name }}>
              {value.name}
            </Typography>
          </Grid>
        </Grid>
      ),
    },
    {
      field: "variant",
      headerName: "Variant",
      width: 275,
      sortable: false,
      renderCell: ({ value, row }) => {
        let sizes = []
        let colors = []

        value.all.map(variant => {
          sizes.push(variant.size)

          if (
            !colors.includes(variant.color) &&
            variant.size === selectedSizes[row.id] &&
            variant.style === value.current.style
          ) {
            colors.push(variant.color)
          }
        })

        return (
          <Grid container direction="column">
            <Sizes
              sizes={sizes}
              selectedSize={selectedSizes[row.id]}
              setSelectedSize={size =>
                setSelectedHelper(setSelectedSizes, selectedSizes, size, row.id)
              }
            />
            <Swatches
              colors={colors}
              selectedColor={selectedColors[row.id]}
              setSelectedColor={color =>
                setSelectedHelper(
                  setSelectedColors,
                  selectedColors,
                  color,
                  row.id
                )
              }
            />
          </Grid>
        )
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 250,
      sortable: false,
      renderCell: ({ value, row }) => {
        const selectedVariant = selectedVariants[row.id]
        const stock = value.map(variant => ({ qty: variant.qty }))

        return (
          <QtyButton
            variants={value}
            selectedVariant={selectedVariant}
            name={value[selectedVariant].product.name.split(" ")[0]}
            stock={stock}
          />
        )
      },
    },
    {
      field: "price",
      headerName: "Price",
      width: 250,
      renderCell: ({ value }) => (
        <Chip classes={{ root: classes.chipRoot }} label={`$${value}`} />
      ),
    },
    {
      field: "",
      width: 500,
      sortable: false,
      renderCell: ({ value }) => (
        <IconButton>
          <span className={classes.deleteWrapper}>
            <DeleteIcon />
          </span>
        </IconButton>
      ),
    },
  ]

  const rows =
    Object.keys(selectedVariants).length > 0 ? createData(products) : []

  useEffect(() => {
    axios
      .get(process.env.GATSBY_STRAPI_URL + "/favorites/userFavorites", {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      })
      .then(response => {
        setProducts(response.data)

        let newVariants = {}
        let newSizes = {}
        let newColors = {}

        // set selected variant, size and color of each favorited item
        response.data.forEach(favorite => {
          const found = favorite.variants.find(
            variant => variant.id === favorite.variant.id
          )

          const index = favorite.variants.indexOf(found)
          newVariants = { ...newVariants, [favorite.id]: index }
          newSizes = { ...newSizes, [favorite.id]: favorite.variant.size }
          newColors = { ...newColors, [favorite.id]: favorite.variant.color }
        })

        setSelectedVariants(newVariants)
        setSelectedSizes(newSizes)
        setSelectedColors(newColors)
      })
      .catch(error => {
        console.error(error)
        dispatchFeedback(
          setSnackbar({
            status: "error",
            message:
              "There was a probelem getting your favorite products.  Please try again.",
          })
        )
      })
  }, [])

  return (
    <Grid item container classes={{ root: classes.container }}>
      <DataGrid
        hideFooterSelectedRowCount
        rows={rows}
        columns={columns}
        pageSize={5}
      />
    </Grid>
  )
}
