import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { postDataToAPI } from "../../api/PostData";
import { Notification } from "../Admin/Notifications";
import { useAuth } from "../../context/auth";
import { Redirect } from "react-router-dom";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useTranslation } from "react-i18next";
import "../../i18n";

// Start: Style properties --------------
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
// --------------------------------------

function Copyright() {
  const { t } = useTranslation();
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" to="" shref="http://192.168.0.1/">
        {t("Company.label")}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignIn() {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { authenticated, setAuthenticated } = useAuth();

  const [open, setOpen] = useState(false);
  const [errorMessage, seterrorMessage] = useState([]);
  const [error, seterror] = useState(false);

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  const handelSubmit = async (event) => {
    event.preventDefault();
    var login_json = {
      UserName: userName,
      Password: password,
    };
    let response = await postDataToAPI("/api/user/Login", login_json);
    setLoading(true);
    if (response.ok) {
      setLoading(false);
      setAuthenticated(true);

      const langCookie = getCookie("lang");
      var lang = langCookie ? langCookie.substring(2, 4) : "en";
      localStorage.setItem("i18nextLng", lang);
      i18n.changeLanguage(lang);
    } else {
      let json = await response.json();
      setOpen(true);
      seterror(true);
      seterrorMessage(json.error);
      setLoading(false);
    }
  };

  const onChange = (event) => {
    if (event.target.name === "email") {
      setUserName(event.target.value);
    } else if (event.target.name === "password") {
      setPassword(event.target.value);
    }
  };

  if (authenticated) {
    return <Redirect to="/" />;
  } else {
    return (
      <Container component="main" maxWidth="xs" data-testid="loggin">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("signin")}
          </Typography>
          <form className={classes.form} noValidate onSubmit={handelSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label={t("emailaddress")}
              name="email"
              autoComplete="email"
              autoFocus
              className="emailField"
              onChange={onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={t("password")}
              type="password"
              id="password"
              autoComplete="current-password"
              className="passwordField"
              onChange={onChange}
            />
            {loading && <LinearProgress color="secondary" />}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              data-testid="submit"
              className={classes.submit}
            >
              {"signin"}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/forget-password" variant="body2">
                  {t("forgotpassword")}
                </Link>
              </Grid>
            </Grid>
          </form>
          <Notification
            open={open} // must be a "state" to show notification message [true or false]
            setOpen={setOpen} // this function changes the state "open" value.
            error={error} // if error message put [true] else for success put [false]
            errorMessage={errorMessage} // the recived error message (array of string) from server.
          />
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}
