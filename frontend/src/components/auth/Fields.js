import React from "react"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

import validate from "../ui/validate"

const useStyles = makeStyles(theme => ({
  textField: {
    width: "20rem",
  },
  input: {
    color: theme.palette.secondary.main,
  },
}))

export default function Fields({
  fields,
  errors,
  setErrors,
  values,
  setValues,
}) {
  const classes = useStyles()

  return Object.keys(fields).map(field => {
    // helper function to validate information that user enters into email and password fields
    const validateHelper = event => {
      const valid = validate({ [field]: event.target.value })
      setErrors({ ...errors, [field]: !valid[field] })
    }

    return !fields[field].hidden ? (
      <Grid item key={field}>
        <TextField
          value={values[field]}
          onChange={e => {
            if (errors[field]) {
              validateHelper(e)
            }
            setValues({ ...values, [field]: e.target.value })
          }}
          classes={{ root: classes.textField }}
          onBlur={e => validateHelper(e)}
          error={errors[field]}
          helperText={errors[field] && fields[field].helperText}
          placeholder={fields[field].placeholder}
          type={fields[field].type}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {fields[field].startAdornment}
              </InputAdornment>
            ),
            endAdornment: fields[field].endAdornment ? (
              <InputAdornment position="end">
                {fields[field].endAdornment}
              </InputAdornment>
            ) : undefined,
            classes: { input: classes.input },
          }}
        />
      </Grid>
    ) : null
  })
}