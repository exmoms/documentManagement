import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { postDataToAPI } from "../../../api/PostData";
import { useTranslation } from "react-i18next";
//import { useAuth } from "../../../context/auth";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Notification } from "../Notifications";

function Copyright() {
  const { t } = useTranslation();
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        {t("link")}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    minWidth: "100%",
  },
}));

export default function SignUp(props) {
  const { t } = useTranslation();
  const classes = useStyles();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setloading] = useState(false);

  const [errorMessage, seterrorMessage] = useState([]);
  const [error, seterror] = useState(false);
  const [open, setOpen] = React.useState(false);

  const regester_file = {
    UserName: userName,
    Email: email,
    Password: password,
    ConfirmPassword: confirmPassword,
    Roles: [
      {
        roleName: "Admin",
        isSelected: role === "Admin" ? true : false,
      },
      {
        roleName: "User",
        isSelected: role === "User" ? true : false,
      },
    ],
  };

  const onchange = (event) => {
    if (event.target.name === "signup-userName") {
      setUserName(event.target.value);
    } else if (event.target.name === "signup-email") {
      setEmail(event.target.value);
    } else if (event.target.name === "signup-password") {
      setPassword(event.target.value);
    } else if (event.target.name === "signup-confirmPassword") {
      setConfirmPassword(event.target.value);
    } else if (event.target.name === "role") {
      setRole(event.target.value);
    }
  };

  const handelSubmit = async (event) => {
    event.preventDefault();

    if (userName.length === 0) {
      seterror(true);
      seterrorMessage([t("userName_error")]);
      setOpen(true);
    } else if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      seterror(true);
      seterrorMessage([t("email_error")]);
      setOpen(true);
    } else if (role === "") {
      seterror(true);
      seterrorMessage([t("role_error")]);
      setOpen(true);
    } else if (password.length < 8 || confirmPassword.length > 12) {
      seterror(true);
      seterrorMessage([t("password_charachters_no")]);
      setOpen(true);
    } else if (password !== confirmPassword) {
      seterror(true);
      seterrorMessage([t("password_mismatch")]);
      setOpen(true);
    } else {
      setloading(true);

      let response = await postDataToAPI("/api/user/Register", regester_file);
      if (response.ok) {
        props.updateUserTable(true);
        seterror(false);
        setOpen(true);
        setloading(false);
      } else {
        let json = await response.json();
        seterror(true);
        seterrorMessage(json.error);
        setOpen(true);
        setloading(false);
      }
    }
  };

  const userRole = localStorage.getItem("userRole");

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {t("signupfornewuser")}
        </Typography>
        <form
          className={classes.form}
          onSubmit={handelSubmit}
          id="submitNewUserForm"
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                onChange={onchange}
                autoComplete="fname"
                name="signup-userName"
                variant="outlined"
                fullWidth
                id="signup-firstName"
                label={t("username")}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                onChange={onchange}
                id="signup-email"
                label={t("emailaddress")}
                name="signup-email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">
                  {t("role_label")}
                </InputLabel>
                <Select
                  name="role"
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={role}
                  onChange={onchange}
                  label={t("role_label")}
                >
                  {userRole === "SuperAdmin" && (
                    <MenuItem value="Admin">{t("admin")}</MenuItem>
                  )}
                  <MenuItem value="User">{t("user")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                onChange={onchange}
                name="signup-password"
                label={t("password")}
                type="password"
                id="signup-password"
                autoComplete="new-password"
                // inputProps={{
                //   maxLength: 12,
                //   minLength: 8,
                // }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                onChange={onchange}
                name="signup-confirmPassword"
                label={t("confirmpassword_label")}
                type="password"
                id="signup-confirmPassword"
                autoComplete="new-password"
                // inputProps={{
                //   maxLength: 12,
                //   minLength: 8
                // }}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="Remember me."
              />
            </Grid> */}
          </Grid>
          {loading && <LinearProgress color="secondary" />}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {t("signup")}
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
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
