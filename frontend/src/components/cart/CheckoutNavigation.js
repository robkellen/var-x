import React from "react"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  navbar: {
    backgroundColor: theme.palette.secondary.main,
    width: "40rem",
    height: "5rem",
  },
  back: {
    //hide back button if on first step or the confirmation/thank you step
    visibility: ({ selectedStep, steps }) =>
      selectedStep === 0 || selectedStep === steps.length - 1
        ? "hidden"
        : "visible",
  },
  forward: {
    // hide forward button if on the confirmation or thank you step
    visibility: ({ selectedStep, steps }) =>
      selectedStep >= steps.length - 2 ? "hidden" : "visible",
  },
  disabled: {
    opacity: 0.5,
  },
}))

export default function CheckoutNavigation({
  steps,
  selectedStep,
  setSelectedStep,
}) {
  const classes = useStyles({ selectedStep, steps })

  return (
    <Grid
      item
      container
      justifyContent="center"
      alignItems="center"
      classes={{ root: classes.navbar }}
    >
      <Grid item classes={{ root: classes.back }}>
        <Button onClick={() => setSelectedStep(selectedStep - 1)}>
          <Typography variant="h5">{"<"}</Typography>
        </Button>
      </Grid>
      <Grid item>
        <Typography variant="h5">
          {steps[selectedStep].title.toUpperCase()}
        </Typography>
      </Grid>
      <Grid item classes={{ root: classes.forward }}>
        <Button
          classes={{ disabled: classes.disabled }}
          disabled={steps[selectedStep].error}
          onClick={() => setSelectedStep(selectedStep + 1)}
        >
          <Typography variant="h5">{">"}</Typography>
        </Button>
      </Grid>
    </Grid>
  )
}
