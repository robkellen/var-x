import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import { makeStyles } from "@material-ui/core/styles"

// images for header icons
import search from "../../images/search.svg"
import cart from "../../images/cart.svg"
import account from "../../images/account-header.svg"

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
}))

export default function Header({ categories }) {
  const classes = useStyles()

  //setting tabs for header
  const routes = [
    ...categories,
    { node: { name: "Contact Us", strapiId: "contact" } },
  ]

  return (
    <AppBar color="transparent" elevation={0}>
      <Toolbar>
        <Button>
          <Typography variant="h1">
            <span className={classes.logoText}>VAR</span> X
          </Typography>
        </Button>
        <Tabs
          value={0}
          classes={{ indicator: classes.coloredIndicator, root: classes.tabs }}
        >
          {routes.map(route => (
            <Tab label={route.node.name} key={route.node.strapiId} />
          ))}
        </Tabs>
        <IconButton>
          <img src={search} alt="Search" title="Search" />
        </IconButton>
        <IconButton>
          <img src={cart} alt="Cart" title="Cart" />
        </IconButton>
        <IconButton>
          <img src={account} alt="Account" title="Account" />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
