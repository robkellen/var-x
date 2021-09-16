import React from "react"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import Chip from "@material-ui/core/Chip"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"

//images
import sort from "../../images/sort.svg"
import close from "../../images/close-outline.svg"

const useStyles = makeStyles(theme => ({
  chipContainer: {
    [theme.breakpoints.down("md")]: {
      margin: "0.5rem",
    },
  },
  notActive: {
    backgroundColor: theme.palette.primary.main,
  },
}))

export default function Sort({ setOption, sortOptions, setSortOptions }) {
  const classes = useStyles()

  // CHeck if screen size is extra small to adequately space the sortOptions to be more user friendly
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

  // determine which sort option is selected and call to invoke the sort function associated with that option
  const handleSort = i => {
    const newOptions = [...sortOptions]
    // clear out the currently active sort option
    newOptions.map(option => (option.active = false))
    // activate new sort option that is selected
    newOptions[i].active = true

    setSortOptions(newOptions)
  }

  return (
    <Grid item container justifyContent="space-between" alignItems="center">
      <Grid item>
        <IconButton onClick={() => setOption(null)}>
          <img src={sort} alt="Sort" />
        </IconButton>
      </Grid>
      <Grid item xs>
        <Grid
          container
          justifyContent="space-around"
          alignItems={matchesXS ? "center" : undefined}
          direction={matchesXS ? "column" : "row"}
        >
          {sortOptions.map((option, i) => (
            <Grid
              classes={{ root: classes.chipContainer }}
              item
              key={option.label}
            >
              <Chip
                onClick={() => handleSort(i)}
                color={option.active !== true ? "primary" : "secondary"}
                label={option.label}
                classes={{
                  root: clsx({ [classes.notActive]: option.active !== true }),
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item>
        <IconButton onClick={() => setOption(null)}>
          <img src={close} alt="Close" />
        </IconButton>
      </Grid>
    </Grid>
  )
}
