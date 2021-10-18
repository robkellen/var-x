import React, { useState, useEffect } from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import { makeStyles } from "@material-ui/core/styles"
import { useMediaQuery } from "@material-ui/core"

import Slots from "./Slots"
import Fields from "../auth/Fields"
import { EmailPassword } from "../auth/Login"

// images
import fingerprint from "../../images/fingerprint.svg"
import NameAdornment from "../../images/NameAdornment"
import PhoneAdornment from "../../images/PhoneAdornment"

const useStyles = makeStyles(theme => ({
  phoneAdornment: {
    height: 25.122,
    width: 25.173,
  },
  visibleIcon: {
    padding: 0,
  },
  emailAdornment: {
    height: 17,
    width: 22,
    marginBottom: 10,
  },
  icon: {
    marginTop: ({ checkout }) => (checkout ? "-2rem" : undefined),
    marginBottom: ({ checkout }) => (checkout ? "1rem" : "3rem"),
    [theme.breakpoints.down("xs")]: {
      marginBottom: "1rem",
    },
  },
  fieldContainer: {
    marginBottom: "2rem",
    "& > :not(:first-child)": {
      marginLeft: "5rem",
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: "1rem",
      "& > :not(:first-child)": {
        marginLeft: 0,
        marginTop: "1rem",
      },
    },
  },
  detailsContainer: {
    position: "relative",
    [theme.breakpoints.down("md")]: {
      borderBottom: "4px solid #fff",
      height: "30rem",
    },
  },
  slotsContainer: {
    position: "absolute",
    bottom: ({ checkout }) => (checkout ? -8 : 0),
  },
  fieldContainerCart: {
    "& > *": {
      marginBottom: "1rem",
    },
  },
  switchWrapper: {
    marginRight: 4,
  },
  switchLabel: {
    color: "#fff",
    fontWeight: 600,
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

export default function Details({
  user,
  edit,
  setChangesMade,
  values,
  setValues,
  slot,
  setSlot,
  errors,
  setErrors,
  checkout,
  billing,
  setBilling,
  noSlots,
}) {
  const classes = useStyles({ checkout })

  // define styles based on screen size
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

  // set inital state of component
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // exit useEffect if noSlots prop is present
    if (noSlots) return

    // when slot changes, update values with new slot settings
    if (checkout) {
      setValues(user.contactInfo[slot])
    } else {
      setValues({ ...user.contactInfo[slot], password: "********" })
    }
  }, [slot])

  // listen to changes to values of fields in a given slot and update state
  useEffect(() => {
    // exit this effect if this component is being used in CheckoutPortal
    if (checkout) return

    const changed = Object.keys(user.contactInfo[slot]).some(
      field => values[field] !== user.contactInfo[slot][field]
    )

    setChangesMade(changed)
  }, [values])

  const email_password = EmailPassword(false, false, visible, setVisible, true)
  const name_phone = {
    name: {
      helperText: "you must enter a name",
      placeholder: "Name",
      startAdornment: <NameAdornment color="#fff" />,
    },
    phone: {
      helperText: "invalid phone number",
      placeholder: "Phone",
      startAdornment: (
        <div className={classes.phoneAdornment}>
          <PhoneAdornment />
        </div>
      ),
    },
  }

  let fields = [name_phone, email_password]

  // edit fields if in the CheckoutPortal component
  if (checkout) {
    fields = [
      {
        name: name_phone.name,
        email: email_password.email,
        phone: name_phone.phone,
      },
    ]
  }

  return (
    <Grid
      item
      container
      direction="column"
      lg={checkout ? 12 : 6}
      xs={12}
      alignItems="center"
      justifyContent="center"
      classes={{ root: classes.detailsContainer }}
    >
      <Grid item>
        <img
          src={fingerprint}
          alt="details settings"
          className={classes.icon}
        />
      </Grid>
      {fields.map((pair, i) => (
        <Grid
          container
          direction={matchesXS || checkout ? "column" : "row"}
          key={i}
          justifyContent="center"
          alignItems={matchesXS || checkout ? "center" : undefined}
          classes={{
            root: clsx({
              [classes.fieldContainer]: !checkout,
              [classes.fieldContainerCart]: checkout,
            }),
          }}
        >
          <Fields
            fields={pair}
            values={values}
            setValues={setValues}
            errors={errors}
            setErrors={setErrors}
            isWhite
            disabled={checkout ? false : !edit}
            settings={!checkout}
          />
        </Grid>
      ))}
      {noSlots ? null : (
        <Grid
          item
          container
          justifyContent={checkout ? "space-between" : undefined}
          classes={{ root: classes.slotsContainer }}
        >
          <Slots slot={slot} setSlot={setSlot} checkout={checkout} />
          {checkout && (
            <Grid item>
              <FormControlLabel
                classes={{
                  root: classes.switchWrapper,
                  label: classes.switchLabel,
                }}
                label="Billing"
                labelPlacement="start"
                control={
                  <Switch
                    checked={billing}
                    onChange={() => setBilling(!billing)}
                    color="secondary"
                  />
                }
              />
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  )
}
