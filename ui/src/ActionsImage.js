import React, { useState } from "react";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  wrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000000",
  },
  showPartial: {
    opacity: 0.7,
  },
  showFull: {
    opacity: 1,
  },
  hide: {
    opacity: 0,
  },
  actions: {
    position: "absolute",
  },
  transition: {
    transition: "opacity 0.3s ease-out",
  },
});

function ActionsImage(props) {
  const classes = useStyles();
  const [showOverlay, setShowOverlay] = useState(false);

  function handleMouseEnter() {
    setShowOverlay(true);
  }

  function handleMouseLeave() {
    setShowOverlay(false);
  }

  const { src, children } = props;

  return (
    <div
      className={classes.wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={clsx(
          classes.overlay,
          classes.transition,
          showOverlay ? classes.showPartial : classes.hide
        )}
      ></div>
      <div
        className={clsx(
          classes.actions,
          classes.transition,
          showOverlay ? classes.showFull : classes.hide
        )}
      >
        {children}
      </div>
      <img className={classes.preview} src={src} alt="código de barras" />
    </div>
  );
}

export default ActionsImage;
