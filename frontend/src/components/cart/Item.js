import React, { useContext, useState } from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Chip from "@material-ui/core/Chip"
import IconButton from "@material-ui/core/IconButton"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles, useTheme } from "@material-ui/core/styles"

import QtyButton from "../product-list/QtyButton"
import SelectFrequency from "../ui/select-frequency"
import SubscriptionIcon from "../ui/Subscription"

import { removeFromCart, changeFrequency } from "../../contexts/actions"
import { CartContext } from "../../contexts"

import DeleteIcon from "../../images/Delete.js"
import FavoriteIcon from "../ui/Favorite"

const useStyles = makeStyles(theme => ({
  productImage: {
    height: "10rem",
    width: "10rem",
  },
  name: {
    color: theme.palette.secondary.main,
  },
  id: {
    color: theme.palette.secondary.main,
    fontSize: "1rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.75rem",
    },
  },
  actionWrapper: {
    height: "3rem",
    width: "3rem",
    [theme.breakpoints.down("xs")]: {
      height: "2rem",
      width: "2rem",
    },
  },
  infoContainer: {
    width: "35rem",
    position: "relative",
    height: ({ subscription }) => (subscription ? "10rem" : "8rem"),
    marginLeft: "1rem",
  },
  chipWrapper: {
    position: "absolute",
    top: ({ subscription }) => (subscription ? "4.25rem" : "3.5rem"),
  },
  itemContainer: {
    margin: "2rem 0 2rem 2rem",
    [theme.breakpoints.down("md")]: {
      margin: "2rem 0",
    },
  },
  actionButton: {
    [theme.breakpoints.down("xs")]: {
      padding: "12px 6px",
    },
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  chipRoot: {
    marginLeft: "1rem",
    "&:hover": {
      cursor: "pointer",
    },
  },
  actionContainer: {
    marginBottom: "-0.5rem",
  },
  favoriteIcon: {
    marginTop: "2px",
  },
  chipLabel: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.25rem",
    },
  },
}))

export default function Item({ item }) {
  const classes = useStyles({ subscription: item.subscription })
  const theme = useTheme()
  const [frequency, setFrequency] = useState(item.subscription || "Month")

  // check screen size to apply styles accordingly
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

  const { dispatchCart } = useContext(CartContext)

  // handle removal of item from cart
  const handleDelete = () => {
    dispatchCart(removeFromCart(item.variant, item.qty))
  }

  // update frequency of subscription for item in cart
  const handleFrequency = newFrequency => {
    dispatchCart(changeFrequency(item.variant, newFrequency))
    setFrequency(newFrequency)
  }

  const actions = [
    {
      component: FavoriteIcon,
      props: {
        color: theme.palette.secondary.main,
        size: matchesXS ? 2 : 3,
        buttonClass: clsx(classes.actionButton, classes.favoriteIcon),
        variant: item.variant.id,
      },
    },
    {
      component: SubscriptionIcon,
      props: {
        color: theme.palette.secondary.main,
        isCart: item,
        size: matchesXS ? 2 : 3,
        cartFrequency: frequency,
      },
    },
    {
      icon: DeleteIcon,
      color: theme.palette.error.main,
      size: matchesXS ? "1.75rem" : "2.5rem",
      onClick: handleDelete,
    },
  ]

  return (
    <Grid item container classes={{ root: classes.itemContainer }}>
      <Grid item>
        <img
          className={classes.productImage}
          src={process.env.GATSBY_STRAPI_URL + item.variant.images[0].url}
          alt={item.variant.id}
        />
      </Grid>
      <Grid
        item
        container
        direction={matchesXS ? "row" : "column"}
        justifyContent="space-between"
        classes={{ root: classes.infoContainer }}
      >
        <Grid item container justifyContent="space-between">
          <Grid item>
            <Typography variant="h5" classes={{ root: classes.name }}>
              {item.name}
            </Typography>
          </Grid>
          <Grid item>
            <QtyButton
              name={item.name}
              selectedVariant={0}
              variants={[item.variant]}
              stock={[{ qty: item.stock }]}
              isCart
              white
              hideCartButton
            />
          </Grid>
        </Grid>
        <Grid
          item
          container
          alignItems="center"
          classes={{ root: classes.chipWrapper }}
        >
          <Grid item>
            <Chip label={`$${item.variant.price}`} />
          </Grid>
          {item.subscription ? (
            <Grid item>
              <SelectFrequency
                chip={
                  <Chip
                    classes={{
                      root: classes.chipRoot,
                      label: classes.chipLabel,
                    }}
                    label={`Every ${frequency}`}
                  />
                }
                value={frequency}
                setValue={handleFrequency}
              />
            </Grid>
          ) : null}
        </Grid>
        <Grid
          item
          container
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Grid item xs={7} sm>
            <Typography variant="body1" classes={{ root: classes.id }}>
              ID: {item.variant.id}
            </Typography>
          </Grid>
          <Grid item container xs={5} sm justifyContent="flex-end">
            {actions.map((action, i) => (
              <Grid item classes={{ root: classes.actionContainer }} key={i}>
                {action.component ? (
                  <action.component {...action.props} />
                ) : (
                  <IconButton
                    disableRipple
                    classes={{ root: classes.actionButton }}
                    onClick={() => action.onClick()}
                  >
                    <span
                      className={classes.actionWrapper}
                      style={{ height: action.size, width: action.size }}
                    >
                      <action.icon color={action.color} />
                    </span>
                  </IconButton>
                )}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
