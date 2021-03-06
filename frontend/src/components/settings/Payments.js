import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import CircularProgress from "@material-ui/core/CircularProgress"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

import Slots from "./Slots"

import { FeedbackContext, UserContext } from "../../contexts"
import { setSnackbar, setUser } from "../../contexts/actions"

// images
import cardIcon from "../../images/card.svg"

const useStyles = makeStyles(theme => ({
  number: {
    color: "#fff",
    marginBottom: "5rem",
    [theme.breakpoints.down("xs")]: {
      marginBottom: ({ checkout }) => (checkout ? "1rem" : undefined),
      fontSize: ({ checkout }) => (checkout ? "1.5rem" : undefined),
    },
  },
  removeCard: {
    backgroundColor: "#fff",
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: "2rem",
    "&:hover": {
      backgroundColor: "#fff",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: ({ checkout }) => (checkout ? 0 : undefined),
    },
  },
  removeCardText: {
    fontSize: "1rem",
    color: theme.palette.primary.main,
    fontFamily: "Philosopher",
    fontStyle: "italic",
  },
  icon: {
    marginBottom: "3rem",
    [theme.breakpoints.down("xs")]: {
      marginBottom: ({ checkout }) => (checkout ? "3rem" : "1rem"),
    },
  },
  paymentContainer: {
    height: "100%",
    display: ({ selectedStep, stepNumber, checkout }) =>
      checkout && selectedStep !== stepNumber ? "none" : "flex",
    borderLeft: ({ checkout }) => (checkout ? 0 : "4px solid #fff"),
    position: "relative",
    [theme.breakpoints.down("md")]: {
      height: ({ checkout }) => (!checkout ? "30rem" : "100%"),
      borderLeft: 0,
    },
  },
  slotsContainer: {
    position: "absolute",
    bottom: ({ checkout }) => (checkout ? -8 : 0),
  },
  switchWrapper: {
    marginRight: 4,
  },
  switchLabel: {
    color: "#fff",
    fontWeight: 600,
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.25rem",
    },
  },
  form: {
    width: "75%",
    height: "2rem",
    borderBottom: "2px solid #fff",
    marginTop: "-1rem",
    [theme.breakpoints.down("xs")]: {
      width: "85%",
    },
  },
  spinner: {
    marginLeft: "3rem",
  },
  switchItem: {
    width: "100%",
  },
  numberWrapper: {
    marginBotoom: "5rem",
  },
}))

export default function Payments({
  user,
  slot,
  setSlot,
  checkout,
  saveCard,
  setSaveCard,
  setCardError,
  selectedStep,
  stepNumber,
  setCard,
  hasSubscriptionActive,
  hasSubscriptionCart,
}) {
  const classes = useStyles({ checkout, stepNumber, selectedStep })

  const stripe = useStripe()
  const elements = useElements()

  // check screen size to display content appropriately if user is on a small screen
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

  const [loading, setLoading] = useState(false)

  const { dispatchFeedback } = useContext(FeedbackContext)
  const { dispatchUser } = useContext(UserContext)

  const card =
    user.username === "Guest"
      ? { last4: "", brand: "" }
      : user.paymentMethods[slot]

  // allow user to remove card from their account
  const removeCard = () => {
    // check for any remaining saved cards on account
    const remaining = user.paymentMethods.filter(method => method.last4 !== "")

    const subscriptionPayment = user.subscriptions.find(
      subscription => subscription.paymentMethod.last4 === card.last4
    )

    // if user tries to remove the only saved card while they have active subscriptions, or the card they are trying to remove is attached to an active subscription, throw an error to alert user they need to edit any subscriptions before deleting the card info
    if (
      (hasSubscriptionActive && remaining.length === 1) ||
      subscriptionPayment
    ) {
      dispatchFeedback(
        setSnackbar({
          status: "error",
          message:
            "You may not remove your only saved card attached to an active subscription.  Please add another card before continuing.",
        })
      )
      return
    }

    setLoading(true)

    axios
      .post(
        process.env.GATSBY_STRAPI_URL + "/orders/removeCard",
        {
          card: card.last4,
        },
        {
          headers: { Authorization: `Bearer ${user.jwt}` },
        }
      )
      .then(response => {
        setLoading(false)

        dispatchUser(
          setUser({ ...response.data.user, jwt: user.jwt, onboarding: true })
        )
        setCardError(true)
        setCard({ brand: "", last4: "" })
      })
      .catch(error => {
        setLoading(false)
        console.error(error)

        dispatchFeedback(
          setSnackbar({
            status: "error",
            message:
              "There was a problem removing your card.  Please try again.",
          })
        )
      })
  }

  const handleSubmit = async event => {
    event.preventDefault()

    if (!stripe || !elements) return
  }

  const handleCardChange = async event => {
    if (event.complete) {
      const cardElement = elements.getElement(CardElement)
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      })

      setCard({
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
      })
      setCardError(false)
    } else {
      setCardError(true)
    }
  }

  const cardWrapper = (
    <form onSubmit={handleSubmit} className={classes.form}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "20px",
              fontFamily: "Montserrat",
              color: "#fff",
              iconColor: "#fff",
              "::placeholder": {
                color: "#fff",
              },
            },
          },
        }}
        onChange={handleCardChange}
      />
    </form>
  )

  useEffect(() => {
    // if this component is being accessed in Settings or if user is a guest exit this useEffect
    if (!checkout || !user.jwt) return

    if (user.paymentMethods[slot].last4 !== "") {
      setCard(user.paymentMethods[slot])
      setCardError(false)
    } else {
      setCard({ brand: "", last4: "" })
      setCardError(true)
    }
  }, [slot])

  return (
    <Grid
      item
      container
      direction="column"
      lg={checkout ? 12 : 6}
      xs={12}
      alignItems="center"
      justifyContent="center"
      classes={{ root: classes.paymentContainer }}
    >
      <Grid item>
        <img src={cardIcon} alt="payment settings" className={classes.icon} />
      </Grid>
      <Grid
        item
        container
        justifyContent="center"
        classes={{
          root: clsx({
            [classes.numberWrapper]: checkout && matchesXS,
          }),
        }}
      >
        {checkout && !card.last4 ? cardWrapper : null}
        <Grid item>
          <Typography
            align="center"
            variant="h3"
            classes={{ root: classes.number }}
          >
            {card.last4
              ? `${card.brand.toUpperCase()} **** **** **** ${card.last4}`
              : checkout
              ? null
              : "Add A New Card During Checkout"}
          </Typography>
        </Grid>
        {card.last4 && (
          <Grid
            item
            classes={{
              root: clsx({
                [classes.spinner]: loading,
              }),
            }}
          >
            {loading ? (
              <CircularProgress color="secondary" />
            ) : (
              <Button
                onClick={removeCard}
                variant="contained"
                classes={{ root: classes.removeCard }}
              >
                <Typography
                  variant="h6"
                  classes={{ root: classes.removeCardText }}
                >
                  remove card
                </Typography>
              </Button>
            )}
          </Grid>
        )}
      </Grid>
      <Grid
        item
        container
        justifyContent="space-between"
        classes={{ root: classes.slotsContainer }}
      >
        <Slots slot={slot} setSlot={setSlot} noLabel />
        {checkout && user.username !== "Guest" && (
          <Grid
            item
            classes={{
              root: clsx({
                [classes.switchItem]: matchesXS,
              }),
            }}
          >
            <FormControlLabel
              classes={{
                root: classes.switchWrapper,
                label: classes.switchLabel,
              }}
              label="Save Card For Future Use"
              labelPlacement="start"
              control={
                <Switch
                  disabled={
                    user.paymentMethods[slot].last4 !== "" ||
                    hasSubscriptionCart
                  }
                  checked={
                    user.paymentMethods[slot].last4 !== "" ||
                    hasSubscriptionCart
                      ? true
                      : saveCard
                  }
                  onChange={() => setSaveCard(!saveCard)}
                  color="secondary"
                />
              }
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}
