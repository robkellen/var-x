import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

import CheckoutNavigation from "./CheckoutNavigation"
import Shipping from "./Shipping"
import Details from "../settings/Details"
import Location from "../settings/Location"
import Payments from "../settings/Payments"

const useStyles = makeStyles(theme => ({
  stepContainer: {
    width: "40rem",
    height: "25rem",
    backgroundColor: theme.palette.primary.main,
  },
  "@global": {
    ".MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before":
      {
        borderBottom: "2px solid #fff",
      },
    ".MuiInput-underline:after": {
      borderBottom: `2px solid ${theme.palette.secondary.main}`,
    },
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

  const [locationValues, setLocationValues] = useState({
    street: "",
    zip: "",
    city: "",
    state: "",
  })
  const [locationSlot, setLocationSlot] = useState(0)
  const [locationBilling, setLocationBilling] = useState(false)

  const [errors, setErrors] = useState({})

  const [selectedShipping, setSelectedShipping] = useState(null)

  const [billingSlot, setBillingSlot] = useState(0)
  const [saveCard, setSaveCard] = useState(false)

  const shippingOptions = [
    { label: "FREE SHIPPING", price: 0 },
    { label: "2-DAY SHIPPING", price: 9.99 },
    { label: "OVERNIGHT SHIPPING", price: 29.99 },
  ]

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
    {
      title: "Address",
      component: (
        <Location
          user={user}
          values={locationValues}
          setValues={setLocationValues}
          slot={locationSlot}
          setSlot={setLocationSlot}
          billing={locationBilling}
          setBilling={setLocationBilling}
          errors={errors}
          setErrors={setErrors}
          checkout
        />
      ),
    },
    {
      title: "Shipping",
      component: (
        <Shipping
          shippingOptions={shippingOptions}
          selectedShipping={selectedShipping}
          setSelectedShipping={setSelectedShipping}
        />
      ),
    },
    {
      title: "Payment",
      component: (
        <Payments
          slot={billingSlot}
          setSlot={setBillingSlot}
          user={user}
          saveCard={saveCard}
          setSaveCard={setSaveCard}
          checkout
        />
      ),
    },
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
