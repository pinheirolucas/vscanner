import React from "react";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  spinner: {
    marginLeft: "5px",
  },
});

function LoadingButton(props) {
  const classes = useStyles();
  const { isLoading, children, disabled, ...rest } = props;

  return (
    <Button {...rest} disabled={isLoading || disabled}>
      {children}
      {isLoading ? (
        <CircularProgress
          color="secondary"
          variant="indeterminate"
          size="1rem"
          className={classes.spinner}
        />
      ) : null}
    </Button>
  );
}

export default LoadingButton;
