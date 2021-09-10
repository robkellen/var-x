import React, { useState } from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"

// images
import background from "../../images/toolbar-background.svg"
import ListIcon from "../../images/List"
import GridIcon from "../../images/Grid"

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
    position: "relative",
  },
  descriptionContainer: {
    backgroundColor: theme.palette.primary.main,
    height: "15rem",
    width: "60rem",
    borderRadius: 25,
    padding: "1rem",
  },
  button: {
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: 25,
    borderRightColor: `${theme.palette.primary.main} !important`,
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#fff",
    },
    padding: "0.5rem 1.5rem",
  },
  selected: {
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
  buttonGroup: {
    position: "absolute",
    right: 0,
    bottom: 0,
    marginRight: "3rem",
    marginBottom: "3rem",
  },
}))

export default function DescriptionContainer({
  name,
  description,
  layout,
  setLayout,
  setPage,
}) {
  const classes = useStyles()

  // reset page number if user toggles between grid/list view of products
  const changeLayout = option => {
    setPage(1)
    setLayout(option)
  }

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
      <Grid item classes={{ root: classes.buttonGroup }}>
        <ButtonGroup>
          <Button
            onClick={() => changeLayout("list")}
            classes={{
              outlined: clsx(classes.button, {
                [classes.selected]: layout === "list",
              }),
            }}
          >
            <ListIcon color={layout === "list" ? "#fff" : undefined} />
          </Button>
          <Button
            onClick={() => changeLayout("grid")}
            classes={{
              outlined: clsx(classes.button, {
                [classes.selected]: layout === "grid",
              }),
            }}
          >
            <GridIcon color={layout === "grid" ? "#fff" : undefined} />
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  )
}
