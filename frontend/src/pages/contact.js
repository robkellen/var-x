import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import clsx from "clsx"
import { makeStyles, useTheme } from "@material-ui/core/styles"

//images
import address from "../images/address.svg"
import Email from "../images/EmailAdornment"
import send from "../images/send.svg"
import nameAdornment from "../images/name-adornment.svg"
import PhoneAdornment from "../images/PhoneAdornment"

import Layout from "../components/ui/layout"
import validate from "../components/ui/validate"

const useStyles = makeStyles(theme => ({
  mainContainer: {
    height: "45rem",
    backgroundColor: theme.palette.primary.main,
    marginBottom: "10rem",
    [theme.breakpoints.down("md")]: {
      marginTop: "8rem",
      height: "90rem",
    },
  },
  formWrapper: {
    height: "100%",
    [theme.breakpoints.down("md")]: {
      height: "50%",
      marginTop: "-8rem",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  formContainer: {
    height: "100%",
  },
  blockContainer: {
    backgroundColor: theme.palette.secondary.main,
    height: "8rem",
    width: "40rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      width: "30rem",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  titleContainer: {
    marginTop: "-4rem",
  },
  buttonContainer: {
    marginBottom: "-4rem",
    textTransform: "none",
    borderRadius: 0,
    "&:hover": {
      backgroundColor: theme.palette.secondary.light,
    },
  },
  sendIcon: {
    marginLeft: "2rem",
  },
  contactInfo: {
    fontSize: "1.5rem",
    marginLeft: "1rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.75rem",
    },
  },
  contactIcon: {
    height: "3rem",
    width: "3rem",
    [theme.breakpoints.down("xs")]: {
      height: "2rem",
      width: "2rem",
    },
  },
  contactEmailIcon: {
    height: "2.25rem",
    width: "3rem",
    [theme.breakpoints.down("xs")]: {
      height: "1.25rem",
      width: "2rem",
    },
  },
  infoContainer: {
    height: "21.25rem",
    [theme.breakpoints.down("xs")]: {
      height: "15.25rem",
    },
  },
  middleInfo: {
    borderTop: "2px solid #fff",
    borderBottom: "2px solid #fff",
  },
  iconContainer: {
    borderRight: "2px solid #fff",
    height: "7rem",
    width: "8rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      width: "6rem",
      height: "5rem",
    },
  },
  textField: {
    width: "30rem",
    [theme.breakpoints.down("sm")]: {
      width: "20rem",
    },
  },
  input: {
    color: "#fff",
  },
  fieldContainer: {
    marginBottom: "1rem",
  },
  multilineContainer: {
    marginTop: "1rem",
  },
  emailAdornment: {
    height: 17,
    width: 22,
    marginBottom: "10px",
  },
  phoneAdornment: {
    height: 25.122,
    width: 25.173,
  },
  multiline: {
    border: "2px solid #fff",
    borderRadius: 10,
    padding: "1rem",
  },
  multilineError: {
    border: `2px solid ${theme.palette.error.main}`,
  },
  buttonDisabled: {
    backgroundColor: theme.palette.grey[500],
  },
  sendMessage: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "2.5rem",
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

const ContactPage = () => {
  const classes = useStyles()
  const theme = useTheme()

  // check screen size for sizing elements properly
  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

  // set initial state for form inputs
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState({})

  return (
    <Layout>
      <Grid
        container
        justifyContent="space-around"
        alignItems="center"
        classes={{ root: classes.mainContainer }}
        direction={matchesMD ? "column" : "row"}
      >
        {/*Contact Form  */}
        <Grid item classes={{ root: classes.formWrapper }}>
          <Grid
            container
            direction="column"
            justifyContent="space-between"
            alignItems="center"
            classes={{ root: classes.formContainer }}
          >
            <Grid
              item
              classes={{
                root: clsx(classes.titleContainer, classes.blockContainer),
              }}
            >
              <Typography variant="h4">Contact Us</Typography>
            </Grid>
            <Grid item>
              <Grid container direction="column">
                <Grid item classes={{ root: classes.fieldContainer }}>
                  <TextField
                    value={name}
                    onChange={e => {
                      if (errors.name) {
                        const valid = validate({ name: e.target.value })
                        setErrors({ ...errors, name: !valid.name })
                      }
                      setName(e.target.value)
                    }}
                    onBlur={e => {
                      // validate input of name, return error if invalid
                      const valid = validate({ name })
                      setErrors({ ...errors, name: !valid.name })
                    }}
                    error={errors.name}
                    helperText={errors.name && "Please enter a name"}
                    classes={{ root: classes.textField }}
                    placeholder="Name"
                    InputProps={{
                      classes: { input: classes.input },
                      startAdornment: (
                        <InputAdornment position="start">
                          <img src={nameAdornment} alt="Name Adornment" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item classes={{ root: classes.fieldContainer }}>
                  <TextField
                    value={email}
                    onChange={e => {
                      if (errors.email) {
                        const valid = validate({ email: e.target.value })
                        setErrors({ ...errors, email: !valid.email })
                      }
                      setEmail(e.target.value)
                    }}
                    onBlur={e => {
                      // validate input of name, return error if invalid
                      const valid = validate({ email })
                      setErrors({ ...errors, email: !valid.email })
                    }}
                    error={errors.email}
                    helperText={errors.email && "Please enter a valid email"}
                    classes={{ root: classes.textField }}
                    placeholder="Email"
                    InputProps={{
                      classes: { input: classes.input },
                      startAdornment: (
                        <InputAdornment position="start">
                          <div className={classes.emailAdornment}>
                            <Email color={theme.palette.secondary.main} />
                          </div>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item classes={{ root: classes.fieldContainer }}>
                  <TextField
                    value={phoneNumber}
                    onChange={e => {
                      if (errors.phone) {
                        const valid = validate({ phone: e.target.value })
                        setErrors({ ...errors, phone: !valid.phone })
                      }
                      setPhoneNumber(e.target.value)
                    }}
                    onBlur={e => {
                      // validate input of name, return error if invalid
                      const valid = validate({ phone: phoneNumber })
                      setErrors({ ...errors, phone: !valid.phone })
                    }}
                    error={errors.phone}
                    helperText={
                      errors.phone && "Please enter a valid phone number"
                    }
                    classes={{ root: classes.textField }}
                    placeholder="Phone Number"
                    InputProps={{
                      classes: { input: classes.input },
                      startAdornment: (
                        <InputAdornment position="start">
                          <div className={classes.phoneAdornment}>
                            <PhoneAdornment
                              color={theme.palette.secondary.main}
                            />
                          </div>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item classes={{ root: classes.multilineContainer }}>
                  <TextField
                    value={message}
                    onChange={e => {
                      if (errors.message) {
                        const valid = validate({ message: e.target.value })
                        setErrors({ ...errors, message: !valid.message })
                      }
                      setMessage(e.target.value)
                    }}
                    onBlur={e => {
                      // validate input of name, return error if invalid
                      const valid = validate({ message })
                      setErrors({ ...errors, message: !valid.message })
                    }}
                    error={errors.message}
                    helperText={errors.message && "Please enter a message"}
                    classes={{ root: classes.textField }}
                    placeholder="Message"
                    multiline
                    rows={8}
                    InputProps={{
                      disableUnderline: true,
                      classes: {
                        input: classes.input,
                        multiline: classes.multiline,
                        error: classes.multilineError,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              classes={{
                root: clsx(classes.buttonContainer, classes.blockContainer, {
                  [classes.buttonDisabled]:
                    Object.keys(errors).some(error => errors[error] === true) ||
                    Object.keys(errors).length !== 4,
                }),
              }}
              component={Button}
              disabled={
                Object.keys(errors).some(error => errors[error] === true) ||
                Object.keys(errors).length !== 4
              }
            >
              <Typography variant="h4" classes={{ root: classes.sendMessage }}>
                Send Message
              </Typography>
              <img src={send} alt="Send Message" className={classes.sendIcon} />
            </Grid>
          </Grid>
        </Grid>
        {/* Contact Info*/}
        <Grid item>
          <Grid
            container
            direction="column"
            justifyContent="space-between"
            classes={{ root: classes.infoContainer }}
          >
            <Grid item container alignItems="center">
              <Grid item classes={{ root: classes.iconContainer }}>
                <img
                  src={address}
                  alt="Address"
                  className={classes.contactIcon}
                />
              </Grid>
              <Grid item>
                <Typography
                  variant="h2"
                  classes={{ root: classes.contactInfo }}
                >
                  1060 W. Addison St. {matchesXS ? <br /> : null} Chicago, IL
                  60613
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              container
              alignItems="center"
              classes={{ root: classes.middleInfo }}
            >
              <Grid item classes={{ root: classes.iconContainer }}>
                <div className={classes.contactIcon}>
                  <PhoneAdornment />
                </div>
              </Grid>
              <Grid item>
                <Typography
                  variant="h2"
                  classes={{ root: classes.contactInfo }}
                >
                  (555)-555-5555
                </Typography>
              </Grid>
            </Grid>
            <Grid item container alignItems="center">
              <Grid item classes={{ root: classes.iconContainer }}>
                <div className={classes.contactEmailIcon}>
                  <Email color="#fff" />
                </div>
              </Grid>
              <Grid item>
                <Typography
                  variant="h2"
                  classes={{ root: classes.contactInfo }}
                >
                  robkellen.developer@gmail.com
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default ContactPage
