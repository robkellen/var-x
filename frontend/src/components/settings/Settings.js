import React, { useState, useContext, useEffect } from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { makeStyles } from "@material-ui/core/styles"

// individual settings components
import Details from "./Details"
import Payments from "./Payments"
import Location from "./Location"
import Edit from "./Edit"

import { UserContext } from "../../contexts"

const useStyles = makeStyles(theme => ({
  bottomRow: {
    borderTop: "4px solid #fff",
  },
  sectionContainer: {
    height: "50%",
  },
}))

const stripePromise = loadStripe(`${process.env.GATSBY_STRIPE_PK}`)

export default function Settings({ setSelectedSetting }) {
  const classes = useStyles()

  const { user, dispatchUser } = useContext(UserContext)

  // set state for editing settings
  const [edit, setEdit] = useState(false)
  const [changesMade, setChangesMade] = useState(false)

  const [detailValues, setDetailValues] = useState({
    name: "",
    phone: "",
    email: "",
    password: "********",
  })

  const [detailSlot, setDetailSlot] = useState(0)
  const [detailErrors, setDetailErrors] = useState({})

  const [locationValues, setLocationValues] = useState({
    street: "",
    zip: "",
    city: "",
    state: "",
  })

  const [locationSlot, setLocationSlot] = useState(0)
  const [locationErrors, setLocationErrors] = useState({})

  const [billingSlot, setBillingSlot] = useState(0)

  // handle error validation
  const allErrors = { ...detailErrors, ...locationErrors }
  const isError = Object.keys(allErrors).some(
    error => allErrors[error] === true
  )

  // clear fields if user changes the slot to enter information in
  useEffect(() => {
    setDetailErrors({})
  }, [detailSlot])

  useEffect(() => {
    setLocationErrors({})
  }, [locationSlot])

  return (
    <>
      <Grid container classes={{ root: classes.sectionContainer }}>
        <Details
          user={user}
          edit={edit}
          setChangesMade={setChangesMade}
          values={detailValues}
          setValues={setDetailValues}
          slot={detailSlot}
          setSlot={setDetailSlot}
          errors={detailErrors}
          setErrors={setDetailErrors}
        />
        <Elements stripe={stripePromise}>
          <Payments
            user={user}
            edit={edit}
            slot={billingSlot}
            setSlot={setBillingSlot}
          />
        </Elements>
      </Grid>
      <Grid
        container
        classes={{ root: clsx(classes.bottomRow, classes.sectionContainer) }}
      >
        <Location
          user={user}
          edit={edit}
          setChangesMade={setChangesMade}
          values={locationValues}
          setValues={setLocationValues}
          slot={locationSlot}
          setSlot={setLocationSlot}
          errors={locationErrors}
          setErrors={setLocationErrors}
        />
        <Edit
          user={user}
          setSelectedSetting={setSelectedSetting}
          edit={edit}
          setEdit={setEdit}
          changesMade={changesMade}
          details={detailValues}
          locations={locationValues}
          detailSlot={detailSlot}
          locationSlot={locationSlot}
          dispatchUser={dispatchUser}
          isError={isError}
        />
      </Grid>
    </>
  )
}
