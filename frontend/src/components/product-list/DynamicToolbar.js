import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

import FunctionContainer from "./FunctionContainer"
import DescriptionContainer from "./DescriptionContainer"

const useStyles = makeStyles(theme => ({
  toolbar: {
    border: `5px solid ${theme.palette.primary.main}`,
    borderRadius: 25,
    width: "95%",
    height: "auto",
    marginBottom: "5rem",
  },
}))

export default function DynamicToolbar({ filterOptions, name, description }) {
  const classes = useStyles()

  //set state for sort/filter functionality
  const [option, setOption] = useState(null)

  return (
    <Grid item container direction="column" classes={{ root: classes.toolbar }}>
      <FunctionContainer
        option={option}
        setOption={setOption}
        filterOptions={filterOptions}
      />
      {option === null && (
        <DescriptionContainer name={name} description={description} />
      )}
    </Grid>
  )
}