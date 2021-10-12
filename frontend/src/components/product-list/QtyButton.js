import React, { useState, useEffect, useContext } from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import Badge from "@material-ui/core/Badge"
import { makeStyles } from "@material-ui/core/styles"

import { CartContext } from "../../contexts"
import { addToCart } from "../../contexts/actions"

//images
import Cart from "../../images/Cart"

const useStyles = makeStyles(theme => ({
  qtyText: {
    color: "#fff",
  },
  mainGroup: {
    height: "3rem",
  },
  editButtons: {
    height: "1.525rem",
    borderRadius: 0,
    backgroundColor: theme.palette.secondary.main,
    borderLeft: "2px solid #fff",
    borderRight: "2px solid #fff",
    borderBottom: "none",
    borderTop: "none",
  },
  endButtons: {
    borderRadius: 50,
    backgroundColor: theme.palette.secondary.main,
    border: "none",
  },
  cartButton: {
    marginLeft: "0 !important",
    transition: "background-color 1s ease",
  },
  minusButton: {
    borderTop: "2px solid #fff",
  },
  minus: {
    marginTop: "-0.25rem",
  },
  qtyButton: {
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  badge: {
    color: "#fff",
    fontSize: "1.5rem",
    backgroundColor: theme.palette.secondary.main,
    padding: 0,
  },
  success: {
    backgroundColor: theme.palette.success.main,
    "&:hover": {
      backgroundColor: theme.palette.success.main,
    },
  },
}))

export default function QtyButton({ stock, variants, selectedVariant, name }) {
  const classes = useStyles()

  // set initial state to hold quantity of items
  const [qty, setQty] = useState(1)

  // state to select what to display for button
  const [success, setSuccess] = useState(false)

  // reducer to add items to the cart
  const { cart, dispatchCart } = useContext(CartContext)

  // handler to determine quantity of items to add/subtract in cart
  const handleChange = direction => {
    // disable add button if number of items user wants to add is at the max number of stock
    if (qty === stock[selectedVariant].qty && direction === "up") {
      return null
    }

    // disable subtract button if number of items user wants to add is at 1
    if (qty === 1 && direction === "down") {
      return null
    }

    const newQty = direction === "up" ? qty + 1 : qty - 1
    setQty(newQty)
  }

  // functionality to add items to the cart
  const handleCart = () => {
    setSuccess(true)
    
    dispatchCart(
      addToCart(
        variants[selectedVariant],
        qty,
        name,
        stock[selectedVariant].qty
      )
    )
  }

  // set selected qty value back to 1 whenever user changes variant of item displayed
  useEffect(() => {
    if (stock === null || stock === -1) {
      return undefined
    } else if (qty > stock[selectedVariant].qty) {
      setQty(stock[selectedVariant].qty)
    }
  }, [stock, selectedVariant])

  // switch back to cart icon from check mark icon after user has added item to cart
  useEffect(() => {
    let timer

    if (success) {
      timer = setTimeout(() => setSuccess(false), 1500)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [success])

  return (
    <Grid item>
      <ButtonGroup classes={{ root: classes.mainGroup }}>
        <Button classes={{ root: clsx(classes.endButtons, classes.qtyButton) }}>
          <Typography variant="h3" classes={{ root: classes.qtyText }}>
            {qty}
          </Typography>
        </Button>
        <ButtonGroup orientation="vertical">
          <Button
            onClick={() => handleChange("up")}
            classes={{ root: classes.editButtons }}
          >
            <Typography variant="h3" classes={{ root: classes.qtyText }}>
              +
            </Typography>
          </Button>
          <Button
            onClick={() => handleChange("down")}
            classes={{ root: clsx(classes.editButtons, classes.minusButton) }}
          >
            <Typography
              variant="h3"
              classes={{ root: clsx(classes.qtyText, classes.minus) }}
            >
              -
            </Typography>
          </Button>
        </ButtonGroup>
        <Button
          classes={{
            root: clsx(classes.endButtons, classes.cartButton, {
              [classes.success]: success,
            }),
          }}
          onClick={handleCart}
        >
          {success ? (
            <Typography variant="h3" classes={{ root: classes.qtyText }}>
              ✓
            </Typography>
          ) : (
            <Badge
              overlap="circular"
              badgeContent="+"
              classes={{ badge: classes.badge }}
            >
              <Cart color="#fff" />
            </Badge>
          )}
        </Button>
      </ButtonGroup>
    </Grid>
  )
}
