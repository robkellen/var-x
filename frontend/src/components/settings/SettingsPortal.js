import React, { useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

import { UserContext } from "../../contexts"

// images
import accountIcon from "../../images/account.svg"
import settingsIcon from "../../images/settings.svg"
import orderHistoryIcon from "../../images/order-history.svg"
import favoritesIcon from "../../images/favorite.svg"
import subscriptionIcon from "../../images/subscription.svg"
import background from "../../images/toolbar-background.svg"

const useStyles = makeStyles(theme => ({
  name: {
    color: theme.palette.secondary.main,
  },
  dashboard: {
    width: "100%",
    height: "30rem",
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    borderTop: `0.5rem solid ${theme.palette.primary.main}`,
    borderBottom: `0.5rem solid ${theme.palette.primary.main}`,
    margin: "5rem 0",
  },
  icon: {
    height: "12rem",
    width: "12rem",
  },
  button: {
    height: "22rem",
    width: "22rem",
    borderRadius: 25,
  },
}))

export default function SettingsPortal() {
  const classes = useStyles()

  const { user } = useContext(UserContext)

  const buttons = [
    { label: "Settings", icon: settingsIcon },
    { label: "Order History", icon: orderHistoryIcon },
    { label: "Favorites", icon: favoritesIcon },
    { label: "Subscriptions", icon: subscriptionIcon },
  ]

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item>
        <img src={accountIcon} alt="settings page" />
      </Grid>
      <Grid item>
        <Typography variant="h4" classes={{ root: classes.name }}>
          Welcome back, {user.username}
        </Typography>
      </Grid>
      <Grid
        item
        container
        alignItems="center"
        justifyContent="space-around"
        classes={{ root: classes.dashboard }}
      >
        {buttons.map(button => (
          <Grid item key={button.label}>
            <Button
              classes={{ root: classes.button }}
              variant="contained"
              color="primary"
            >
              <Grid container direction="column">
                <Grid item>
                  <img
                    src={button.icon}
                    alt={button.label}
                    className={classes.icon}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h5">{button.label}</Typography>
                </Grid>
              </Grid>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}
