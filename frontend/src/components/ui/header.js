import React, { useState } from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import Hidden from "@material-ui/core/Hidden"
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"

import { makeStyles } from "@material-ui/core/styles"

// images for header icons
import search from "../../images/search.svg"
import cart from "../../images/cart.svg"
import account from "../../images/account-header.svg"
import menu from "../../images/menu.svg"

//defining styles for this component
const useStyles = makeStyles(theme => ({
  coloredIndicator: {
    backgroundColor: "#fff",
  },
  logoText: {
    color: theme.palette.common.offBlack,
  },
  tabs: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  icon: {
    height: "3rem",
    width: "3rem",
  },
}))

export default function Header({ categories }) {
  const classes = useStyles()

  // set state for drawer
  const [drawerOpen, setDrawerOpen] = useState(false)

  //useMediaQuery to determine user's screen size and adjust how tabs are rendered accordingly
  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)

  //setting tabs for header
  const routes = [
    ...categories,
    { node: { name: "Contact Us", strapiId: "contact" } },
  ]

  const tabs = (
    <Tabs
      value={0}
      classes={{ indicator: classes.coloredIndicator, root: classes.tabs }}
    >
      {routes.map(route => (
        <Tab label={route.node.name} key={route.node.strapiId} />
      ))}
    </Tabs>
  )

  const drawer = (
    <SwipeableDrawer
      open={drawerOpen}
      onOpen={() => setDrawerOpen(true)}
      onClose={() => setDrawerOpen(false)}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
    >
      <List disablePadding>
        {routes.map(route => (
          <ListItem divider button key={route.node.strapiId}>
            <ListItemText primary={route.node.name} />
          </ListItem>
        ))}
      </List>
    </SwipeableDrawer>
  )

  return (
    <AppBar color="transparent" elevation={0}>
      <Toolbar>
        <Button>
          <Typography variant="h1">
            <span className={classes.logoText}>VAR</span> X
          </Typography>
        </Button>
        {matchesMD ? drawer : tabs}
        <IconButton>
          <img
            classes={{ root: classes.icon }}
            src={search}
            alt="Search"
            title="Search"
          />
        </IconButton>
        <IconButton>
          <img
            classes={{ root: classes.icon }}
            src={cart}
            alt="Cart"
            title="Cart"
          />
        </IconButton>
        <IconButton onClick={() => (matchesMD ? setDrawerOpen(true) : null)}>
          <img
            classes={{ root: classes.icon }}
            src={matchesMD ? menu : account}
            alt={matchesMD ? "Menu" : "Account"}
            title={matchesMD ? "Menu" : "Account"}
          />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
