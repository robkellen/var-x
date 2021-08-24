import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import { Link } from "gatsby"

//importing images
import facebook from "../../images/facebook.svg"
import twitter from "../../images/twitter.svg"
import instagram from "../../images/instagram.svg"

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: theme.palette.primary.main,
    padding: "2rem",
  },
  link: {
    color: "#fff",
    fontSize: "1.25rem",
  },
  linkColumn: {
    width: "20rem",
  },
  linkContainer: {
    [theme.breakpoints.down("md")]: {
      marginBottom: "3rem",
    },
  },
  icon: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  "@global": {
    body: {
      margin: 0,
    },
  },
}))

export default function Footer() {
  const classes = useStyles()

  const socialMedia = [
    {
      icon: facebook,
      alt: "facebook",
      title: "facebook",
      link: "https://facebook.com",
    },
    {
      icon: twitter,
      alt: "twitter",
      title: "twitter",
      link: "https://twitter.com",
    },
    {
      icon: instagram,
      alt: "instagram",
      title: "instagram",
      link: "https://instagram.com",
    },
  ]

  return (
    <footer className={classes.footer}>
      <Grid container justify="space-between">
        {/* Links */}
        <Grid item classes={{ root: classes.linkContainer }}>
          <Grid container>
            <Grid
              item
              container
              direction="column"
              classes={{ root: classes.linkColumn }}
            >
              <Grid item>
                <Typography variant="h5">Contact Us</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" classes={{ body1: classes.link }}>
                  (555) 555-5555
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" classes={{ body1: classes.link }}>
                  contactVarX@var-x.com
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction="column"
              classes={{ root: classes.linkColumn }}
            >
              <Grid item>
                <Typography variant="h5">Customer Service</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" classes={{ body1: classes.link }}>
                  Contact Us
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" classes={{ body1: classes.link }}>
                  My Account
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction="column"
              classes={{ root: classes.linkColumn }}
            >
              <Grid item>
                <Typography variant="h5">Information</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" classes={{ body1: classes.link }}>
                  Privacy Policy
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" classes={{ body1: classes.link }}>
                  Terms & Conditions
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* Social Media icons */}
        <Grid item>
          <Grid item container direction="column" alignItems="center">
            {socialMedia.map(platform => (
              <Grid item key={platform.alt}>
                <IconButton
                  classes={{ root: classes.icon }}
                  component="a"
                  href={platform.link}
                  disableRipple
                >
                  <img
                    src={platform.icon}
                    alt={platform.alt}
                    title={platform.alt}
                  />
                </IconButton>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </footer>
  )
}
