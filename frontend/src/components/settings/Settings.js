import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

// individual settings components
import Details from "./Details"
import Payments from "./Payments"
import Location from "./Location"

const useStyles = makeStyles(theme => ({}))

export default function Settings() {
  const classes = useStyles()

  return (
    <>
      <Grid container>
        <Details />
        <Payments />
      </Grid>
      <Grid container>
        <Location />
      </Grid>
    </>
  )
}
