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
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [errors, setErrors] = useState({})

  const fields = {
    name: {
      helperText: "Please enter a name",
      placeholder: "Name",
      adornment: <img src={nameAdornment} alt="Name Adornment" />,
    },
    email: {
      helperText: "Please enter a valid email address",
      placeholder: "Email",
      adornment: (
        <div className={classes.emailAdornment}>
          <Email color={theme.palette.secondary.main} />
        </div>
      ),
    },
    phone: {
      helperText: "Please enter a 10-digit phone number",
      placeholder: "Phone #",
      adornment: (
        <div className={classes.phoneAdornment}>
          <PhoneAdornment color={theme.palette.secondary.main} />
        </div>
      ),
    },
    message: {
      helperText: "Please enter a message",
      placeholder: "Message",
      inputClasses: {
        multiline: classes.multiline,
        error: classes.multilineError,
      },
    },
  }

  const info = [
    {
      label: (
        <span>
          {" "}
          1060 W. Addison St. {matchesXS ? <br /> : null} Chicago, IL 60613
        </span>
      ),
      icon: <img src={address} alt="Address" className={classes.contactIcon} />,
    },
    {
      label: "(555)-555-5555",
      icon: (
        <div className={classes.contactIcon}>
          <PhoneAdornment />
        </div>
      ),
    },
    {
      label: "robkellen.developer@gmail.com",
      icon: (
        <div className={classes.contactEmailIcon}>
          <Email color="#fff" />
        </div>
      ),
    },
  ]

  // define if send message button should be disabled or not
  const disabled =
    Object.keys(errors).some(error => errors[error] === true) ||
    Object.keys(errors).length !== 4

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
                {Object.keys(fields).map(field => {
                  // helper function to validate user input for contact form
                  const validateHelper = event => {
                    const valid = validate({ [field]: event.target.value })
                    setErrors({ ...errors, [field]: !valid[field] })
                  }

                  return (
                    <Grid
                      key={field}
                      item
                      classes={{
                        root:
                          field === "message"
                            ? classes.multilineContainer
                            : classes.fieldContainer,
                      }}
                    >
                      <TextField
                        value={values[field]}
                        onChange={e => {
                          if (errors[field]) {
                            validateHelper(e)
                          }
                          setValues({ ...values, [field]: e.target.value })
                        }}
                        onBlur={e => validateHelper(e)}
                        error={errors[field]}
                        helperText={errors[field] && fields[field].helperText}
                        classes={{ root: classes.textField }}
                        placeholder={fields[field].placeholder}
                        multiline={field === "message"}
                        rows={field === "message" ? 8 : undefined}
                        InputProps={{
                          classes: {
                            input: classes.input,
                            ...fields[field].inputClasses,
                          },
                          disableUnderline: field === "message",
                          startAdornment:
                            field === "message" ? undefined : (
                              <InputAdornment position="start">
                                {fields[field].adornment}
                              </InputAdornment>
                            ),
                        }}
                      />
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
            <Grid
              item
              classes={{
                root: clsx(classes.buttonContainer, classes.blockContainer, {
                  [classes.buttonDisabled]: disabled,
                }),
              }}
              component={Button}
              disabled={disabled}
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
            {info.map((section, i) => (
              <Grid
                key={section.label}
                item
                container
                alignItems="center"
                classes={{ root: i === 1 ? classes.middleInfo : undefined }}
              >
                <Grid item classes={{ root: classes.iconContainer }}>
                  {section.icon}
                </Grid>
                <Grid item>
                  <Typography
                    variant="h2"
                    classes={{ root: classes.contactInfo }}
                  >
                    {section.label}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default ContactPage
