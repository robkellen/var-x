import React, { useState, useContext } from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"

import QtyButton from "../product-list/QtyButton"
import SelectFrequency from "./select-frequency"

import { CartContext, FeedbackContext, UserContext } from "../../contexts"
import {
  setSnackbar,
  addToCart,
  toggleSubscription,
} from "../../contexts/actions"

import SubscriptionIcon from "../../images/Subscription"

const useStyles = makeStyles(theme => ({
  iconWrapper: {
    height: ({ size }) => `${size || 2}rem`,
    width: ({ size }) => `${size || 2}rem`,
  },
  row: {
    height: "4rem",
    padding: "0 0.5rem",
    [theme.breakpoints.down("xs")]: {
      height: "auto",
    },
  },
  dark: {
    backgroundColor: theme.palette.secondary.main,
  },
  iconButton: {
    padding: ({ noPadding }) => (noPadding ? 0 : undefined),
  },
  light: {
    backgroundColor: theme.palette.primary.main,
  },
  cartButton: {
    height: "8rem",
    borderRadius: 0,
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      height: "auto",
    },
  },
  cartText: {
    color: "#fff",
    fontSize: "4rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "3.25rem",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "2rem",
    },
  },
  dialog: {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
  },
  buttonWrapper: {
    width: "100%",
  },
}))

export default function Subscription({
  size,
  stock,
  selectedVariant,
  variant,
  name,
  color,
  noPadding,
  isCart,
  cartFrequency,
}) {
  const classes = useStyles({ size, noPadding })
  const [open, setOpen] = useState(false)
  const [frequency, setFrequency] = useState("Month")
  const [qty, setQty] = useState(1)

  const { dispatchFeedback } = useContext(FeedbackContext)
  const { dispatchCart } = useContext(CartContext)
  const { user } = useContext(UserContext)

  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

  const handleCart = () => {
    dispatchCart(
      addToCart(variant, qty, name, stock[selectedVariant].qty, frequency)
    )
    setOpen(false)
    dispatchFeedback(
      setSnackbar({ status: "success", message: "Subscription Added to Cart." })
    )
  }

  const handleOpen = () => {
    // toggle subscription on/off if the icon being clicked is in the cart
    if (isCart) {
      dispatchCart(toggleSubscription(isCart.variant, cartFrequency))
      return
    }

    if (user.username === "Guest") {
      dispatchFeedback(
        setSnackbar({
          status: "error",
          message: "You must be logged in to create a subscription",
        })
      )
    } else {
      setOpen(true)
    }
  }

  return (
    <>
      <IconButton onClick={handleOpen} classes={{ root: classes.iconButton }}>
        <span className={classes.iconWrapper}>
          <SubscriptionIcon color={color} />
        </span>
      </IconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        fullScreen={matchesXS}
        maxWidth="md"
        classes={{ paper: classes.dialog }}
      >
        <Grid container direction="column" alignItems="center">
          <Grid
            item
            container
            justifyContent="space-between"
            alignItems="center"
            classes={{ root: clsx(classes.row, classes.dark) }}
          >
            <Grid item>
              <Typography variant="h4">Quantity</Typography>
            </Grid>
            <Grid item>
              <QtyButton
                stock={stock}
                selectedVariant={selectedVariant}
                white
                hideCartButton
                round
                override={{ value: qty, setValue: setQty }}
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            alignItems={matchesXS ? "flex-start" : "center"}
            justifyContent="space-between"
            classes={{ root: clsx(classes.row, classes.light) }}
            direction={matchesXS ? "column" : "row"}
          >
            <Grid item>
              <Typography variant="h4">Deliver Every</Typography>
            </Grid>
            <Grid item>
              <SelectFrequency value={frequency} setValue={setFrequency} />
            </Grid>
          </Grid>
          <Grid item classes={{ root: classes.buttonWrapper }}>
            <Button
              variant="contained"
              onClick={handleCart}
              color="secondary"
              classes={{ root: classes.cartButton }}
              disabled={qty === 0}
            >
              <Typography variant="h1" classes={{ root: classes.cartText }}>
                Add Subscription to Cart
              </Typography>
            </Button>
          </Grid>
          {matchesXS && (
            <Grid item>
              <Button onClick={() => setOpen(false)}>
                <Typography variant="body2">Cancel</Typography>
              </Button>
            </Grid>
          )}
        </Grid>
      </Dialog>
    </>
  )
}
