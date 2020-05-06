import React, { useRef, useCallback, useState } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from "@material-ui/core/styles";
import Webcam from "react-webcam";

const useStyles = makeStyles({
  actions: {
    justifyContent: "center",
  },
});

function PhotoForm(props) {
  const classes = useStyles();

  const cam = useRef(null);
  const [image, setImage] = useState("");

  const capture = useCallback(() => {
    if (!cam.current) {
      return;
    }

    const imgSrc = cam.current.getScreenshot();
    setImage(imgSrc);
  }, [cam]);

  function discard() {
    setImage("");
  }

  function finish() {
    const { onFinish } = props;
    onFinish && onFinish(image);
  }

  function buildActions() {
    return image ? (
      <React.Fragment>
        <Button variant="contained" color="primary" onClick={finish}>
          Usar essa imagem
        </Button>
        <Button variant="outlined" color="secondary" onClick={discard}>
          Descartar
        </Button>
      </React.Fragment>
    ) : (
      <Button variant="outlined" color="primary" onClick={capture}>
        Capturar imagem
      </Button>
    );
  }

  function buildContent() {
    return image ? (
      <img src={image} width="100%" alt="imagem selecionada" />
    ) : (
      <Webcam
        width="100%"
        screenshotFormat="image/png"
        audio={false}
        ref={cam}
      />
    );
  }

  const { open, onClose } = props;

  return (
    <Dialog scroll="body" open={open} onClose={onClose}>
      {buildContent()}
      <DialogActions className={classes.actions}>
        {buildActions()}
      </DialogActions>
    </Dialog>
  );
}

export default PhotoForm;
