import React, { useState, useEffect } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import CircularProgress from "@material-ui/core/CircularProgress"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

import { EmailPassword } from "./Login"
import Fields from "./Fields"

import { setSnackbar } from "../../contexts/actions"

// images
import accountIcon from "../../images/account.svg"

const useStyles = makeStyles(theme => ({
  reset: {
    width: "20rem",
    borderRadius: 50,
    textTransform: "none",
    marginBottom: "4rem",
  },
  icon: {
    marginTop: "2rem",
  },
}))

export default function Reset({ dispatchFeedback, steps, setSelectedStep }) {
  const classes = useStyles()

  // set iniital state
  const [visible, setVisible] = useState(false)
  const [values, setValues] = useState({ password: "", confirmation: "" })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { password } = EmailPassword(classes, true, false, visible, setVisible)
  const fields = {
    password,
    confirmation: {
      ...password,
      placeholder: "Confirm Password",
    },
  }

  const handleReset = () => {
    setLoading(true)
    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")

    axios
      .post(process.env.GATSBY_STRAPI_URL + "/auth/reset-password", {
        code,
        password: values.password,
        passwordConfirmation: values.confirmation,
      })
      .then(response => {
        setLoading(false)
        setSuccess(true)
        dispatchFeedback(
          setSnackbar({
            status: "success",
            message: "Password Successfully Reset!",
          })
        )
      })
      .catch(error => {
        setLoading(false)
        const { message } = error.response.data.message[0].messages[0]
        console.error(error)
        dispatchFeedback(setSnackbar({ status: "error", message }))
      })
  }

  const disabled =
    Object.keys(errors).some(error => errors[error] === true) ||
    Object.keys(errors).length !== Object.keys(values).length ||
    values.password !== values.confirmation

  useEffect(() => {
    if (!success) return

    const timer = setTimeout(() => {
      // replace current URL with only the base URL
      window.history.replaceState(null, null, window.location.pathname)
      // after 6 seconds direct user back to login component
      const login = steps.find(step => step.label === "Login")
      setSelectedStep(steps.indexOf(login))
    }, 6000)

    return () => clearTimeout(timer)
  }, [success])

  return (
    <>
      <Grid item classes={{ root: classes.icon }}>
        <img src={accountIcon} alt="reset password page" />
      </Grid>
      <Fields
        fields={fields}
        errors={errors}
        setErrors={setErrors}
        values={values}
        setValues={setValues}
      />
      <Grid item>
        <Button
          variant="contained"
          color="secondary"
          classes={{ root: classes.reset }}
          onClick={handleReset}
          disabled={disabled}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography variant="h5">reset password</Typography>
          )}
        </Button>
      </Grid>
    </>
  )
}
