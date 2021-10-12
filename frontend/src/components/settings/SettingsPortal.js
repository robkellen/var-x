import React, { useContext, useState, useEffect } from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import { useMediaQuery } from "@material-ui/core"
import useResizeAware from "react-resize-aware"

// react-spring animations
import { useSpring, useSprings, animated } from "react-spring"

import Settings from "./Settings"
import { UserContext } from "../../contexts"
import { setUser } from "../../contexts/actions"

// images
import accountIcon from "../../images/account.svg"
import settingsIcon from "../../images/settings.svg"
import orderHistoryIcon from "../../images/order-history.svg"
import favoritesIcon from "../../images/favorite.svg"
import subscriptionIcon from "../../images/subscription.svg"
import background from "../../images/repeating-smallest.svg"
import { Button } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  name: {
    color: theme.palette.secondary.main,
  },
  dashboard: {
    width: "100%",
    minHeight: "30rem",
    height: "auto",
    backgroundImage: `url(${background})`,
    backgroundPosition: "center",
    backgroundRepeat: "repeat",
    borderTop: ({ showComponent }) =>
      `${showComponent ? 0 : 0.5}rem solid ${theme.palette.primary.main}`,
    borderBottom: ({ showComponent }) =>
      `${showComponent ? 0 : 0.5}rem solid ${theme.palette.primary.main}`,
    margin: "5rem 0",
    [theme.breakpoints.down("md")]: {
      padding: ({ showComponent }) => (showComponent ? 0 : "5rem 0"),
      "& > :not(:last-child)": {
        marginBottom: ({ showComponent }) => (showComponent ? 0 : "5rem"),
      },
    },
    [theme.breakpoints.down("xs")]: {
      padding: ({ showComponent }) => (showComponent ? 0 : "2rem 0"),
      "& > :not(:last-child)": {
        marginBottom: ({ showComponent }) => (showComponent ? 0 : "2rem"),
      },
    },
  },
  icon: {
    height: "12rem",
    width: "12rem",
    [theme.breakpoints.down("lg")]: {
      height: "10rem",
      width: "10rem",
    },
  },
  button: {
    backgroundColor: theme.palette.primary.main,
  },
  addHover: {
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.secondary.main,
    },
  },
  logout: {
    color: theme.palette.error.main,
  },
}))

// set animated component
const AnimatedGrid = animated(Grid)

export default function SettingsPortal() {
  const { user, dispatchUser, defaultUser } = useContext(UserContext)

  // set inital state for animation expanding selected setting
  const [selectedSetting, setSelectedSetting] = useState(null)

  // set inital state for showing the selected settings component
  const [showComponent, setShowComponent] = useState(false)

  // hook to get dimensions of components to resize
  const [resizeListener, sizes] = useResizeAware()

  const classes = useStyles({ showComponent })

  // define styles for different screen sizes
  const matchesLG = useMediaQuery(theme => theme.breakpoints.down("lg"))
  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

  const buttonWidth = matchesXS
    ? `${sizes.width - 64}px`
    : matchesMD
    ? `${sizes.width - 160}px`
    : matchesLG
    ? "288px"
    : "352px"
  const buttonHeight = matchesMD ? "22rem" : matchesLG ? "18rem" : "22rem"

  const buttons = [
    { label: "Settings", icon: settingsIcon, component: Settings },
    { label: "Order History", icon: orderHistoryIcon },
    { label: "Favorites", icon: favoritesIcon },
    { label: "Subscriptions", icon: subscriptionIcon },
  ]

  // function to handle selection of setting
  const handleClick = setting => {
    if (selectedSetting === setting) {
      setSelectedSetting(null)
    } else {
      setSelectedSetting(setting)
    }
  }

  // spring animations for buttons
  const springs = useSprings(
    buttons.length,
    buttons.map(button => ({
      to: async (next, cancel) => {
        const scale = {
          transform:
            selectedSetting === button.label || selectedSetting === null
              ? "scale(1)"
              : "scale(0)",
          delay: selectedSetting !== null ? 0 : 600,
        }

        const size = {
          height: selectedSetting === button.label ? matchesMD ? "120rem" : "60rem" : buttonHeight,
          width:
            selectedSetting === button.label ? `${sizes.width}px` : buttonWidth,
          borderRadius: selectedSetting === button.label ? 0 : 25,
          delay: selectedSetting !== null ? 600 : 0,
        }

        const hide = {
          display:
            selectedSetting === button.label || selectedSetting === null
              ? "flex"
              : "none",
          delay: 150,
        }

        await next(selectedSetting !== null ? scale : size)
        await next(hide)
        await next(selectedSetting !== null ? size : scale)
      },
    }))
  )

  // animation for selected setting when enlarged
  const styles = useSpring({
    opacity: selectedSetting === null || showComponent ? 1 : 0,
    delay: selectedSetting === null || showComponent ? 0 : 1350,
  })

  // log user out
  const handleLogout = () => {
    dispatchUser(setUser(defaultUser))
  }

  useEffect(() => {
    if (selectedSetting === null) {
      setShowComponent(false)
      return
    }

    const timer = setTimeout(() => setShowComponent(true), 2000)

    return () => {
      clearTimeout(timer)
    }
  }, [selectedSetting])

  return (
    <Grid container direction="column" alignItems="center">
      {resizeListener}
      <Grid item>
        <img src={accountIcon} alt="settings page" />
      </Grid>
      <Grid item>
        <Typography
          align="center"
          variant="h4"
          classes={{ root: classes.name }}
        >
          Welcome back, {user.username}
        </Typography>
      </Grid>
      <Grid item>
        <Button onClick={handleLogout}>
          <Typography variant="h5" classes={{ root: classes.logout }}>
            logout
          </Typography>
        </Button>
      </Grid>
      <Grid
        item
        container
        direction={matchesMD ? "column" : "row"}
        alignItems="center"
        justifyContent="space-around"
        classes={{ root: classes.dashboard }}
      >
        {springs.map((prop, i) => {
          const button = buttons[i]

          return (
            <AnimatedGrid
              key={i}
              item
              onClick={() => (showComponent ? null : handleClick(button.label))}
              style={prop}
              classes={{
                root: clsx(classes.button, {
                  [classes.addHover]: !showComponent,
                }),
              }}
            >
              <AnimatedGrid
                style={styles}
                container
                justifyContent="center"
                alignItems="center"
                direction="column"
              >
                {selectedSetting === button.label && showComponent ? (
                  <button.component setSelectedSetting={setSelectedSetting} />
                ) : (
                  <>
                    <Grid item>
                      <img
                        src={button.icon}
                        alt={button.label}
                        className={classes.icon}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="h5">{button.label}</Typography>
                    </Grid>
                  </>
                )}
              </AnimatedGrid>
            </AnimatedGrid>
          )
        })}
      </Grid>
    </Grid>
  )
}
