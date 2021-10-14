import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

import CheckoutNavigation from "./CheckoutNavigation"
import Details from "../settings/Details"

const useStyles = makeStyles(theme => ({
  stepContainer: {
    width: "40rem",
    height: "25rem",
    backgroundColor: theme.palette.primary.main,
  },
}))

export default function CheckoutPortal({ user }) {
  const classes = useStyles()

  // set initial state for steps of checkout
  const [selectedStep, setSelectedStep] = useState(0)
  const [detailValues, setDetailValues] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [detailSlot, setDetailSlot] = useState(0)
  const [detailBilling, setDetailBilling] = useState(false)
  const [errors, setErrors] = useState({})

  // steps involved in checkout out with the items in the cart
  const steps = [
    {
      title: "Contact Info",
      component: (
        <Details
          user={user}
          values={detailValues}
          setValues={setDetailValues}
          slot={detailSlot}
          setSlot={setDetailSlot}
          errors={errors}
          setErrors={setErrors}
          checkout
          billing={detailBilling}
          setBilling={setDetailBilling}
        />
      ),
    },
    { title: "Address" },
    { title: "Shipping" },
    { title: "Payment" },
    { title: "Confirmation" },
    { title: `Thanks, ${user.username}!` },
  ]

  return (
    <Grid item container direction="column" xs={6} alignItems="flex-end">
      <CheckoutNavigation
        steps={steps}
        selectedStep={selectedStep}
        setSelectedStep={setSelectedStep}
      />
      <Grid
        item
        container
        classes={{ root: classes.stepContainer }}
        alignItems="center"
        direction="column"
      >
        {steps[selectedStep].component}
      </Grid>
    </Grid>
  )
}
