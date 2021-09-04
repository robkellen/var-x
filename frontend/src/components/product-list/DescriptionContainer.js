import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

// images
import background from "../../images/toolbar-background.svg"

const useStyles = makeStyles(theme => ({
  description: {
    color: "#fff",
  },
  mainContainer: {
    padding: "3rem",
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  descriptionContainer: {
    backgroundColor: theme.palette.primary.main,
    height: "15rem",
    width: "60rem",
    borderRadius: 25,
    padding: "1rem",
  },
}))

export default function FunctionContainer({ name, description }) {
  const classes = useStyles()

  return (
    <Grid
      item
      container
      justifyContent="center"
      classes={{ root: classes.mainContainer }}
    >
      <Grid item classes={{ root: classes.descriptionContainer }}>
        <Typography align="center" variant="h4" paragraph gutterBottom>
          {name}
        </Typography>
        <Typography
          align="center"
          variant="body1"
          paragraph
          gutterBottom
          classes={{ root: classes.description }}
        >
          {description}
        </Typography>
      </Grid>
    </Grid>
  )
}
