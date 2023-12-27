import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import LinearProgress from "@material-ui/core/LinearProgress";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import clsx from "clsx";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { postDataToAPI } from "../../api/PostData";
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

export default function ResetsPassword() {
  const { t } = useTranslation();
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [sent_successfuly, setSent_successfuly] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const [open, setOpen] = useState(false);
  const [errorMessage, seterrorMessage] = useState([]);
  const [error, seterror] = useState(false);

  const onchange = (event) => {
    if (event.target.name === "confirmPassword") {
      setConfirmPassword(event.target.value);
    }
  };

  const handelSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    let token = window.location.href.substring(
      window.location.href.indexOf("token=") + 6,
      window.location.href.indexOf("&email=")
    );
    let email = window.location.href.substring(
      window.location.href.indexOf("&email=") + 7
    );

    const post_file = {
      token: token,
      email: email,
      password: values.password,
      confirmPassword: confirmPassword,
    };

    if (values.password !== confirmPassword) {
      setOpen(true);
      seterror(true);
      seterrorMessage([t("password mismatch")]);
    } else {
      let response = await postDataToAPI("/api/user/ResetPassword", post_file);
      if (response.ok) {
        setOpen(true);
        setSent_successfuly(true);
        setLoading(false);
      } else {
        let json = await response.json();
        setOpen(true);
        seterror(true);
        seterrorMessage(json.error);
        setLoading(false);
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

  if (sent_successfuly === true) {
    return <Redirect to="/" />;
  } else {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("resetpassword")}
          </Typography>
          <form className={classes.form} onSubmit={handelSubmit} id="formSubmit">
            <Grid container spacing={2}>
              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  {t("password")}
                </InputLabel>
                <OutlinedInput
                  required
                  id="outlined-adornment-password"
                  type={values.showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange("password")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  onChange={onchange}
                  name="confirmPassword"
                  label="confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="current-password"
                />
              </Grid>
            </Grid>
            {loading && <LinearProgress color="secondary" />}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {t("reset")}
            </Button>
          </form>
          <Notification
          id="notification"
            open={open} // must be a "state" to show notification message [true or false]
            setOpen={setOpen} // this function changes the state "open" value.
            error={error} // if error message put [true] else for success put [false]
            errorMessage={errorMessage} // the recived error message (array of string) from server.
          />
        </div>
      </Container>
    );
  }
}
