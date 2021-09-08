import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import Chip from "@material-ui/core/Chip"

//images
import sort from "../../images/sort.svg"
import close from "../../images/close-outline.svg"

export default function Sort({ setOption }) {
  const sortOptions = [
    { label: "A-Z" },
    { label: "Z-A" },
    { label: "NEWEST" },
    { label: "OLDEST" },
    { label: "PRICE ↑" },
    { label: "PRICE ↓" },
    { label: "REVIEWS" },
  ]

  return (
    <Grid item container justifyContent="space-between" alignItems="center">
      <Grid item>
        <IconButton onClick={() => setOption(null)}>
          <img src={sort} alt="Sort" />
        </IconButton>
      </Grid>
      <Grid item xs>
        <Grid container justifyContent="space-around">
          {sortOptions.map(option => (
            <Grid item key={option.label}>
              <Chip label={option.label} />
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
