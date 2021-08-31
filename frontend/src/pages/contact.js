import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"
import { Link } from "gatsby"

//images
import address from "../images/address.svg"
import phone from "../images/phone-adornment.svg"
import Email from "../images/EmailAdornment"
import send from "../images/send.svg"

import Layout from "../components/ui/layout"

const useStyles = makeStyles(theme => ({
  mainContainer: {
    height: "40rem",
    backgroundColor: theme.palette.primary.main,
    marginBottom: "10rem",
  },
  formWrapper: {
    height: "100%",
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
  },
  contactIcon: {
    height: "3rem",
    width: "3rem",
  },
  contactEmailIcon: {
    height: "2.25rem",
    width: "3rem",
  },
  infoContainer: {
    height: "21.25rem",
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
  },
  textField: {
    width: "30rem",
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
  "@global": {
    ".MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before":
      {
        borderBottom: "2px solid #fff",
      },
    ".MuiInput-underline:after": {
      borderBottom: `2px solid ${theme.palette.secondary.main}`,
    },
    ".MuiInput-multiline": {
      border: "2px solid #fff",
      borderRadius: 10,
      padding: "1rem",
    },
  },
}))

const ContactPage = () => {
  const classes = useStyles()

  // set initial state for form inputs
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")

  return (
    <Layout>
      <Grid
        container
        justifyContent="space-around"
        alignItems="center"
        classes={{ root: classes.mainContainer }}
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
                    onChange={e => setName(e.target.value)}
                    classes={{ root: classes.textField }}
                    placeholder="Name"
                    InputProps={{ classes: { input: classes.input } }}
                  />
                </Grid>
                <Grid item classes={{ root: classes.fieldContainer }}>
                  <TextField
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    classes={{ root: classes.textField }}
                    placeholder="Email"
                    InputProps={{ classes: { input: classes.input } }}
                  />
                </Grid>
                <Grid item classes={{ root: classes.fieldContainer }}>
                  <TextField
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    classes={{ root: classes.textField }}
                    placeholder="Phone Number"
                    InputProps={{ classes: { input: classes.input } }}
                  />
                </Grid>
                <Grid item classes={{ root: classes.multilineContainer }}>
                  <TextField
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    classes={{ root: classes.textField }}
                    placeholder="Message"
                    multiline
                    rows={8}
                    InputProps={{
                      disableUnderline: true,
                      classes: { input: classes.input },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              classes={{
                root: clsx(classes.buttonContainer, classes.blockContainer),
              }}
              component={Button}
            >
              <Typography variant="h4">Send Message</Typography>
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
                  1060 W. Addison St, Chicago, IL 60613
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
                <img src={phone} alt="Phone" className={classes.contactIcon} />
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
