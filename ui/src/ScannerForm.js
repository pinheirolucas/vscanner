import React, { useState, useRef, useEffect } from "react";

import axios from "axios";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import HelpIcon from "@material-ui/icons/Help";
import InputAdornment from "@material-ui/core/InputAdornment";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useDropzone } from "react-dropzone";

import ActionsImage from "./ActionsImage";
import LoadingButton from "./LoadingButton";
import PhotoForm from "./PhotoForm";
import { useBarcodes } from "./storage";

const useStyles = makeStyles({
  dropzone: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: "2px",
    borderRadius: "2px",
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
    textAlign: "center",
    cursor: "pointer",
  },
  preview: {
    maxWidth: "100%",
  },
  imgAction: {
    fontSize: "50px",
  },
});

function ScannerForm(props) {
  const { open, onClose } = props;

  const classes = useStyles();

  const fileReader = useRef(new FileReader());
  const [isLoading, setIsLoading] = useState(false);
  const [photoFormOpen, setPhotoFormOpen] = useState(false);
  const [codes, setCodes] = useBarcodes([]);
  const [formValues, setFormValues] = useState({
    imageSource: "",
    startDelay: "",
    image: "",
    file: null,
  });

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: ["image/png", "image/jpeg", "image/gif"],
    onDropAccepted: (files) => {
      if (!files.length || files.length > 1) {
        return;
      }

      const [file] = files;
      fileReader.current.readAsDataURL(file);
      setFormValues((values) => ({ ...values, file }));
    },
  });

  useEffect(() => {
    function handleFileLoad(e) {
      setFormValues((values) => ({ ...values, image: e.target.result }));
    }

    const reader = fileReader.current;
    reader.addEventListener("load", handleFileLoad);

    return () => {
      reader.removeEventListener("load", handleFileLoad);
    };
  }, []);

  function handleFormValueChange(e) {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

  function clearBarcode() {
    setFormValues({ ...formValues, image: "", file: null });
  }

  function scan() {
    const data = new FormData();
    if (formValues.startDelay) {
      data.append("startDelay", formValues.startDelay);
    }

    if (formValues.file) {
      data.append("code", formValues.file);
    }

    setIsLoading(true);
    axios
      .post("http://localhost:6339/scan", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .finally(() => setIsLoading(false));
  }

  function handleSave() {
    if (!formValues.file) {
      return;
    }

    if (!formValues.image) {
      return;
    }

    if (!formValues.imageSource) {
      return;
    }

    const mime = formValues.image.split(",")[0].match(/:(.*?);/)[1];

    setCodes([
      ...codes,
      {
        mime,
        imageSource: formValues.imageSource,
        imageData: formValues.image,
        startDelay: formValues.startDelay,
        filename: formValues.file.name,
      },
    ]);
    onClose && onClose();
  }

  function buildCaptureArea() {
    if (!formValues.imageSource) {
      return <React.Fragment />;
    }

    if (formValues.image) {
      return (
        <React.Fragment>
          <Typography variant="body1">Código de barras</Typography>
          <ActionsImage src={formValues.image}>
            <Button
              color="secondary"
              variant="contained"
              onClick={clearBarcode}
              startIcon={<DeleteIcon />}
            >
              Remover
            </Button>
          </ActionsImage>
        </React.Fragment>
      );
    }

    return formValues.imageSource === "file" ? (
      <div {...getRootProps({ className: classes.dropzone })}>
        <input {...getInputProps()} />
        <p>
          Arraste e solte arquivos aqui, ou clique aqui para selecionar um
          arquivo
        </p>
      </div>
    ) : (
      <div className={classes.dropzone} onClick={openPhotoForm}>
        <p>Clique aqui para tirar uma foto a partir da câmera</p>
      </div>
    );
  }

  function openPhotoForm() {
    setPhotoFormOpen(true);
  }

  function handlePhotoFinish(src) {
    setPhotoFormOpen(false);
    if (!src) {
      return;
    }

    const arr = src.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], "camera.png", { type: mime });

    setFormValues({ ...formValues, file, image: src });
  }

  const scanEnabled = Boolean(formValues.file);

  return (
    <React.Fragment>
      <Dialog scroll="body" open={open} onClose={onClose}>
        <DialogTitle>Edição de código de barras</DialogTitle>
        <DialogContent dividers>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Delay pré-digitação"
                  name="startDelay"
                  type="number"
                  placeholder="5"
                  value={formValues.startDelay}
                  onChange={handleFormValueChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Tempo que o sistema irá esperar até que a digitação inicie. Útil para que você tenha tempo de colocar foco no local de digitação.">
                          <HelpIcon />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  A partir de qual fonte você deseja escanear o código?
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <RadioGroup
                  name="imageSource"
                  value={formValues.imageSource}
                  onChange={handleFormValueChange}
                  row
                >
                  <FormControlLabel
                    value="file"
                    control={<Radio />}
                    label="De um arquivo no meu computador"
                  />
                  <FormControlLabel
                    value="camera"
                    control={<Radio />}
                    label="Da minha webcam"
                  />
                </RadioGroup>
              </Grid>
              <Grid item>{buildCaptureArea()}</Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <LoadingButton
            color="secondary"
            variant="contained"
            isLoading={isLoading}
            onClick={scan}
            disabled={!scanEnabled}
          >
            Testar
          </LoadingButton>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSave}
            disabled={!scanEnabled}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
      <PhotoForm
        open={photoFormOpen}
        onFinish={handlePhotoFinish}
        onClose={() => setPhotoFormOpen(false)}
      />
    </React.Fragment>
  );
}

export default ScannerForm;
