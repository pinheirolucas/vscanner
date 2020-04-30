import React, { useState } from "react";

import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import HelpIcon from "@material-ui/icons/Help";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  topDiff: {
    marginTop: "98px",
  },
});

function ScannerForm() {
  const classes = useStyles();

  const [formValues, setFormValues] = useState({
    imageSource: "",
    startDelay: "",
    typingDelay: "",
  });

  function handleFormValueChange(e) {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

  function buildCaptureInput() {
    return formValues.imageSource === "file" ? "file" : "camera";
  }

  return (
    <Container className={classes.topDiff}>
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
            <TextField
              label="Delay em digitação"
              type="number"
              variant="outlined"
              placeholder="0"
              name="typingDelay"
              value={formValues.typingDelay}
              onChange={handleFormValueChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Tempo entre a digitação das letras do código. Útil para simular uma digitação mais cadenciada.">
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
          <Grid item xs={12}>
            {buildCaptureInput()}
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default ScannerForm;
