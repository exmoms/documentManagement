import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import InputLabel from "@material-ui/core/InputLabel";
// import { postData } from "../../api/PostData";
import { postDataToAPI } from "../../api/PostData";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { Notification } from "../Admin/Notifications";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  margin: {
    margin: theme.spacing(1),
  },
  textField: {
    width: "100%",
  },
}));

export default function EditPassword() {
  const { t } = useTranslation();
  const classes = useStyles();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const regester_file = {
      NewPassword: values.password,
      CurrentPassword: password,
      ConfirmPassword: confirmPassword,
  };

  const [errorMessage, seterrorMessage] = useState([]);
  const [error, seterror] = useState(false);
  const [open, setOpen] = React.useState(false);

  const onchange = (event) => {
    if (event.target.name === "password") {
      setPassword(event.target.value);
    } else if (event.target.name === "confirmPassword") {
      setConfirmPassword(event.target.value);
    }
  };

  const handelSubmit = async (event) => {
    event.preventDefault();
    if (password.length < 8 || password.length > 12) {
      seterror(true);
      seterrorMessage([t("password_charachters_no")]);
      setOpen(true);
    } else if (values.password.length < 8 || confirmPassword.length > 12) {
      seterror(true);
      seterrorMessage([t("password_charachters_no")]);
      setOpen(true);
    } else if (values.password !== confirmPassword) {
      seterror(true);
      seterrorMessage([t("password_mismatch")]);
      setOpen(true);
    } else {
      let response = await postDataToAPI(
        "/api/user/EditPassword",
        regester_file
      );
      if (response.ok) {
        setOpen(true);
      } else {
        let json = await response.json();
        seterror(true);
        seterrorMessage(json.error);
        setOpen(true);
      }
    }
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handelSubmit} id="submitForm">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                onChange={onchange}
                name="password"
                label={t("password")}
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>

            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                {t("new_password")}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                    id="iconButton1"
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
              />
            </FormControl>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                onChange={onchange}
                name="confirmPassword"
                label={t("confirmNewPassword_label")}
                type="password"
                id="confirmPassword"
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {t("buttton_save")}
          </Button>
        </form>
      </div>
      <Notification
      id="notification"
        open={open} // must be a "state" to show notification message [true or false]
        setOpen={setOpen} // this function changes the state "open" value.
        error={error} // if error message put [true] else for success put [false]
        errorMessage={errorMessage} // the recived error message (array of string) from server.
      />
    </Container>
  );
}
