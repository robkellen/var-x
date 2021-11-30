import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Chip from "@material-ui/core/Chip"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"

import SettingsGrid from "./SettingsGrid"
import QtyButton from "../product-list/QtyButton"

import DeleteIcon from "../../images/Delete"
import pauseIcon from "../../images/pause.svg"

import { UserContext, FeedbackContext } from "../../contexts"
import { setSnackbar } from "../../contexts/actions"

const useStyles = makeStyles(theme => ({
  bold: {
    fontWeight: 600,
  },
  productImage: {
    height: "10rem",
    width: "10rem",
  },
  method: {
    color: "#fff",
    textTransform: "uppercase",
    marginTop: "1rem",
  },
  lineHeight: {
    lineHeight: 1.1,
  },
  deleteWrapper: {
    height: "3rem",
    width: "2.5rem",
  },
  pause: {
    height: "3rem",
    width: "3rem",
  },
  iconButton: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
}))

export default function Subscriptions({ setSelectedSetting }) {
  const classes = useStyles()
  const { user } = useContext(UserContext)
  const { dispatchFeedback } = useContext(FeedbackContext)
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
    axios
      .get(process.env.GATSBY_STRAPI_URL + "/subscriptions/me", {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      })
      .then(response => {
        setSubscriptions(response.data)
      })
      .catch(error => {
        console.error(error)
        dispatchFeedback(
          setSnackbar({
            status: "error",
            message:
              "There was a problem retrieving your subscriptions.  Please refresh the page and try again.",
          })
        )
      })
  }, [])

  const createData = data =>
    data.map(
      ({
        shippingInfo,
        shippingAddress,
        billingInfo,
        billingAddress,
        paymentMethod,
        name,
        variant,
        quantity,
        frequency,
        next_delivery,
        id,
      }) => ({
        details: {
          shippingInfo,
          shippingAddress,
          billingInfo,
          billingAddress,
          paymentMethod,
        },
        item: {
          name,
          variant,
        },
        quantity: { quantity, variant, name },
        frequency,
        next_delivery,
        total: variant.price * 1.056,
        id,
      })
    )

  const rows = createData(subscriptions)

  const columns = [
    {
      field: "details",
      headerName: "Details",
      width: 350,
      sortable: false,
      renderCell: ({ value }) => (
        <Grid container direction="column">
          <Grid item>
            <Typography
              variant="body2"
              classes={{ root: clsx(classes.lineHeight, classes.bold) }}
            >
              {`${value.shippingInfo.name}`}
              <br />
              {`${value.shippingAddress.street}`}
              <br />
              {`${value.shippingAddress.city}, ${value.shippingAddress.state} ${value.shippingAddress.zip}`}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h3" classes={{ root: classes.method }}>
              {value.paymentMethod.brand} {value.paymentMethod.last4}
            </Typography>
          </Grid>
        </Grid>
      ),
    },
    {
      field: "item",
      headerName: "Item",
      width: 250,
      sortable: false,
      renderCell: ({ value }) => (
        <Grid container alignItems="center" direction="column">
          <Grid item>
            <img
              src={process.env.GATSBY_STRAPI_URL + value.variant.images[0].url}
              alt={value.name}
              className={classes.productImage}
            />
          </Grid>
          <Grid item>
            <Typography variant="body2" classes={{ root: classes.bold }}>
              {value.name}
            </Typography>
          </Grid>
        </Grid>
      ),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 250,
      sortable: false,
      renderCell: ({ value }) => (
        <QtyButton
          stock={[{ qty: value.variant.qty }]}
          variant={value.variant}
          selectedVariant={0}
          name={value.name}
          white
          hideCartButton
          round
        />
      ),
    },
    {
      field: "frequency",
      headerName: "Frequency",
      width: 250,
      sortable: false,
      renderCell: ({ value }) => (
        <Chip
          classes={{ label: classes.bold }}
          label={value.split("_").join(" ")}
        />
      ),
    },
    {
      field: "next_delivery",
      headerName: "Next Delivery",
      width: 250,
      renderCell: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      field: "total",
      headerName: "Total",
      width: 250,
      renderCell: ({ value }) => (
        <Chip
          classes={{ label: classes.bold }}
          label={`$${value.toFixed(2)}`}
        />
      ),
    },
    {
      field: "",
      width: 250,
      sortable: false,
      renderCell: () => (
        <Grid container>
          <Grid item>
            <IconButton classes={{ root: classes.iconButton }}>
              <span className={classes.deleteWrapper}>
                <DeleteIcon />
              </span>
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton classes={{ root: classes.iconButton }}>
              <img
                src={pauseIcon}
                alt="pause subscription"
                className={classes.pause}
              />
            </IconButton>
          </Grid>
        </Grid>
      ),
    },
  ]

  return (
    <SettingsGrid
      setSelectedSetting={setSelectedSetting}
      rows={rows}
      columns={columns}
      rowsPerPage={3}
    />
  )
}
