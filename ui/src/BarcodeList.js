import React, { useState } from "react";

import AddIcon from "@material-ui/icons/Add";
import Container from "@material-ui/core/Container";
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core/styles";

import ScannerForm from "./ScannerForm";

const useStyles = makeStyles((theme) => ({
  topDiff: {
    marginTop: "98px",
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
}));

function BarcodeList() {
  const classes = useStyles();

  const [scannerFormOpen, setScannerFormOpen] = useState(false);

  function handleAdd() {
    setScannerFormOpen(true);
  }

  function handleAddClose() {
    setScannerFormOpen(false);
  }

  return (
    <React.Fragment>
      <Container className={classes.topDiff}>
        <h1>Loco</h1>
        <Fab color="secondary" className={classes.fab} onClick={handleAdd}>
          <AddIcon />
        </Fab>
      </Container>
      <ScannerForm open={scannerFormOpen} onClose={handleAddClose} />
    </React.Fragment>
  );
}

export default BarcodeList;
