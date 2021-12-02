import React, { useState, useEffect, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import CheckoutNavigation from "./CheckoutNavigation"
import Shipping from "./Shipping"
import Confirmation from "./Confirmation"
import BillingConfirmation from "./BillingConfirmation"
import ThankYou from "./ThankYou"
import Details from "../settings/Details"
import Location from "../settings/Location"
import Payments from "../settings/Payments"
import validate from "../ui/validate"

import { CartContext } from "../../contexts"

const useStyles = makeStyles(theme => ({
  stepContainer: {
    width: "40rem",
    height: "25rem",
    backgroundColor: theme.palette.primary.main,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  container: {
    [theme.breakpoints.down("md")]: {
      marginBottom: "5rem",
    },
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

// connect stripe account to the application
const stripePromise = loadStripe(`${process.env.GATSBY_STRIPE_PK}`)

export default function CheckoutPortal({ user }) {
  const classes = useStyles()

  const { cart } = useContext(CartContext)

  // check screen size to apply styles accordingly
  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))

  // check cart for any new subscriptions
  const hasSubscriptionCart = cart.some(item => item.subscription)
  // verify that user has active subscriptions
  const hasSubscriptionActive = user.subscriptions?.length > 0

  // set initial state for steps of checkout
  const [selectedStep, setSelectedStep] = useState(0)
  const [detailValues, setDetailValues] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [detailSlot, setDetailSlot] = useState(0)
  const [detailForBilling, setDetailForBilling] = useState(false)

  const [locationValues, setLocationValues] = useState({
    street: "",
    zip: "",
    city: "",
    state: "",
  })
  const [billingLocation, setBillingLocation] = useState({
    street: "",
    zip: "",
    city: "",
    state: "",
  })
  const [locationSlot, setLocationSlot] = useState(0)
  const [locationForBilling, setLocationForBilling] = useState(false)

  const [errors, setErrors] = useState({})

  const [order, setOrder] = useState(null)

  const [selectedShipping, setSelectedShipping] = useState(null)

  const [cardSlot, setCardSlot] = useState(0)
  const [cardError, setCardError] = useState(true)
  const [saveCard, setSaveCard] = useState(hasSubscriptionCart)
  const [card, setCard] = useState({ brand: "", last4: "" })

  const shippingOptions = [
    { label: "FREE SHIPPING", price: 0 },
    { label: "2-DAY SHIPPING", price: 9.99 },
    { label: "OVERNIGHT SHIPPING", price: 29.99 },
  ]

  // handle info validation for each step
  const errorHelper = (values, forBilling, billingValues, slot) => {
    const valid = validate(values)

    // if there is a slot marked for billing
    if (forBilling !== false && forBilling !== undefined) {
      // validate billing values
      const billingValid = validate(billingValues)

      // if shipping and billing slot are the same...
      if (forBilling === slot) {
        //...only validate one set of values because they're the same
        return Object.keys(billingValid).some(value => !billingValid[value])
      } else {
        // otherwise if shipping slot is not the slot marked for billing then both billing values and shipping values need to be validated
        return (
          Object.keys(billingValid).some(value => !billingValid[value]) ||
          Object.keys(valid).some(value => !valid[value])
        )
      }
    } else {
      // if no slots marked for billing validate current slot
      return Object.keys(valid).some(value => !valid[value])
    }
  }

  // steps involved in checkout out with the items in the cart
  let steps = [
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
          billing={detailForBilling}
          setBilling={setDetailForBilling}
          billingValues={billingDetails}
          setBillingValues={setBillingDetails}
          selectedStep={selectedStep}
        />
      ),
      hasActions: true,
      error: errorHelper(
        detailValues,
        detailForBilling,
        billingDetails,
        detailSlot
      ),
    },
    {
      title: "Billing Info",
      component: (
        <Details
          values={billingDetails}
          setValues={setBillingDetails}
          errors={errors}
          setErrors={setErrors}
          checkout
          noSlots
          selectedStep={selectedStep}
        />
      ),
      error: errorHelper(billingDetails),
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
          billing={locationForBilling}
          setBilling={setLocationForBilling}
          errors={errors}
          setErrors={setErrors}
          billingValues={billingLocation}
          setBillingValues={setBillingLocation}
          checkout
          selectedStep={selectedStep}
        />
      ),
      hasActions: true,
      error: errorHelper(
        locationValues,
        locationForBilling,
        billingLocation,
        locationSlot
      ),
    },
    {
      title: "Billing Address",
      component: (
        <Location
          values={billingLocation}
          setValues={setBillingLocation}
          errors={errors}
          setErrors={setErrors}
          checkout
          noSlots
          selectedStep={selectedStep}
        />
      ),
      error: errorHelper(billingLocation),
    },
    {
      title: "Shipping",
      component: (
        <Shipping
          shippingOptions={shippingOptions}
          selectedShipping={selectedShipping}
          setSelectedShipping={setSelectedShipping}
          selectedStep={selectedStep}
        />
      ),
      error: selectedShipping === null,
    },
    {
      title: "Payment",
      component: (
        <Payments
          setCard={setCard}
          slot={cardSlot}
          setSlot={setCardSlot}
          user={user}
          saveCard={saveCard}
          setSaveCard={setSaveCard}
          setCardError={setCardError}
          checkout
          selectedStep={selectedStep}
          hasSubscriptionActive={hasSubscriptionActive}
          hasSubscriptionCart={hasSubscriptionCart}
        />
      ),
      error: cardError,
    },
    {
      title: "Confirmation",
      component: (
        <Confirmation
          user={user}
          order={order}
          card={card}
          cardSlot={cardSlot}
          saveCard={saveCard}
          setOrder={setOrder}
          detailValues={detailValues}
          billingDetails={billingDetails}
          detailForBilling={detailForBilling}
          locationValues={locationValues}
          billingLocation={billingLocation}
          locationForBilling={locationForBilling}
          shippingOptions={shippingOptions}
          selectedShipping={selectedShipping}
          selectedStep={selectedStep}
          setSelectedStep={setSelectedStep}
        />
      ),
    },
    {
      title: `Thanks, ${user.username.split(" ")[0]}!`,
      component: (
        <ThankYou
          selectedShipping={selectedShipping}
          order={order}
          selectedStep={selectedStep}
        />
      ),
    },
  ]

  // determine with step to show if detailsForBilling/locationForBilling has been established with the toggle switch
  if (detailForBilling !== false) {
    steps = steps.filter(step => step.title !== "Billing Info")
  }
  if (locationForBilling !== false) {
    steps = steps.filter(step => step.title !== "Billing Address")
  }

  // reset errors if user changes slots or selectedStep for info in any of the fields to recheck validation
  useEffect(() => {
    setErrors({})
  }, [detailSlot, locationSlot, selectedStep])

  return (
    <Grid
      item
      container
      direction="column"
      lg={6}
      alignItems={matchesMD ? "flex-start" : "flex-end"}
      classes={{ root: classes.container }}
    >
      <CheckoutNavigation
        steps={steps}
        selectedStep={selectedStep}
        setSelectedStep={setSelectedStep}
        details={detailValues}
        detailSlot={detailSlot}
        setDetails={setDetailValues}
        location={locationValues}
        locationSlot={locationSlot}
        setLocation={setLocationValues}
        setErrors={setErrors}
      />
      <Grid
        item
        container
        classes={{ root: classes.stepContainer }}
        alignItems="center"
        direction="column"
      >
        <Elements stripe={stripePromise}>
          {steps.map((step, i) =>
            React.cloneElement(step.component, {
              stepNumber: i,
              key: i,
            })
          )}
        </Elements>
      </Grid>
      {steps[selectedStep].title === "Confirmation" && (
        <BillingConfirmation
          detailForBilling={detailForBilling}
          billingDetails={billingDetails}
          detailSlot={detailSlot}
          locationForBilling={locationForBilling}
          billingLocation={billingLocation}
          locationSlot={locationSlot}
        />
      )}
    </Grid>
  )
}
