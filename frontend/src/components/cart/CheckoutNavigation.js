import React, { useState, useContext } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from "@material-ui/core/styles"

import { FeedbackContext, UserContext } from "../../contexts"
import { setSnackbar, setUser } from "../../contexts/actions"

// images
import save from "../../images/save.svg"
import Delete from "../../images/Delete"

const useStyles = makeStyles(theme => ({
  navbar: {
    backgroundColor: theme.palette.secondary.main,
    width: "40rem",
    height: "5rem",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
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
  icon: {
    height: "2.25rem",
    width: "2.25rem",
    [theme.breakpoints.down("xs")]: {
      height: "1.75rem",
      width: "1.75rem",
    },
  },
  delete: {
    height: "2rem",
    width: "2rem",
    [theme.breakpoints.down("xs")]: {
      height: "1.5rem",
      width: "1.5rem",
    },
  },
  actions: {
    position: "absolute",
    right: 0,
  },
  iconButton: {
    [theme.breakpoints.down("xs")]: {
      padding: 6,
    },
  },
  text: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.25rem",
    },
  },
  navButtons: {
    minWidth: 0,
    width: "1 rem",
    height: "1.5rem",
  },
}))

export default function CheckoutNavigation({
  steps,
  selectedStep,
  setSelectedStep,
  details,
  setDetails,
  detailSlot,
  location,
  locationSlot,
  setLocation,
  setErrors,
}) {
  const classes = useStyles({ selectedStep, steps })

  const [loading, setLoading] = useState(null)

  const { dispatchFeedback } = useContext(FeedbackContext)
  const { user, dispatchUser } = useContext(UserContext)

  // handle saving/deleting user info to slot
  const handleAction = action => {
    if (steps[selectedStep].error && action !== "delete") {
      dispatchFeedback(
        setSnackbar({
          status: "error",
          message: "All fields must be valid before saving",
        })
      )
      return
    }

    setLoading(action)

    const isDetails = steps[selectedStep].title === "Contact Info"
    const isLocation = steps[selectedStep].title === "Address"

    axios
      .post(
        process.env.GATSBY_STRAPI_URL + "/users-permissions/set-settings",
        {
          details: isDetails && action !== "delete" ? details : undefined,
          detailSlot: isDetails ? detailSlot : undefined,
          location: isLocation && action !== "delete" ? location : undefined,
          locationSlot: isLocation ? locationSlot : undefined,
        },
        {
          headers: { Authorization: `Bearer ${user.jwt}` },
        }
      )
      .then(response => {
        setLoading(null)
        dispatchFeedback(
          setSnackbar({
            status: "success",
            message: `Information ${
              action === "delete" ? "Deleted" : "Saved"
            } Successfully`,
          })
        )
        dispatchUser(
          setUser({ ...response.data, jwt: user.jwt, onboarding: true })
        )

        if (action === "delete") {
          // clear errors if delete is successfull
          setErrors({})
          if (isDetails) {
            setDetails({ name: "", email: "", phone: "" })
          } else if (isLocation) {
            setLocation({ street: "", zip: "", city: "", state: "" })
          }
        }
      })
      .catch(error => {
        setLoading(null)
        console.error(error)
        dispatchFeedback(
          setSnackbar({
            status: "error",
            message: `There was an problem ${
              action === "delete" ? "deleting" : "saving"
            } your information.  Please try again.`,
          })
        )
      })
  }

  return (
    <Grid
      item
      container
      justifyContent="center"
      alignItems="center"
      classes={{ root: classes.navbar }}
    >
      <Grid item classes={{ root: classes.back }}>
        <Button
          classes={{ root: classes.navButtons }}
          onClick={() => setSelectedStep(selectedStep - 1)}
        >
          <Typography variant="h5" classes={{ root: classes.text }}>
            {"<"}
          </Typography>
        </Button>
      </Grid>
      <Grid item>
        <Typography variant="h5" classes={{ root: classes.text }}>
          {steps[selectedStep].title.toUpperCase()}
        </Typography>
      </Grid>
      <Grid item classes={{ root: classes.forward }}>
        <Button
          classes={{ root: classes.navButtons, disabled: classes.disabled }}
          disabled={steps[selectedStep].error}
          onClick={() => setSelectedStep(selectedStep + 1)}
        >
          <Typography variant="h5" classes={{ root: classes.text }}>
            {">"}
          </Typography>
        </Button>
      </Grid>
      {steps[selectedStep].hasActions && user.username !== "Guest" ? (
        <Grid item classes={{ root: classes.actions }}>
          <Grid container>
            <Grid item>
              {loading === "save" ? (
                <CircularProgress />
              ) : (
                <IconButton
                  classes={{ root: classes.iconButton }}
                  onClick={() => handleAction("save")}
                >
                  <img src={save} alt="save" className={classes.icon} />
                </IconButton>
              )}
            </Grid>
            <Grid item>
              {loading === "delete" ? (
                <CircularProgress />
              ) : (
                <IconButton
                  classes={{ root: classes.iconButton }}
                  onClick={() => handleAction("delete")}
                >
                  <span className={classes.delete}>
                    <Delete color="#fff" />
                  </span>
                </IconButton>
              )}
            </Grid>
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  )
}
