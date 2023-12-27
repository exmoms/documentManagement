import Avatar from "@material-ui/core/Avatar";
// import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
import { Link, Redirect } from "react-router-dom";
import { postDataToAPI } from "../../api/PostData";
import { useAuth } from "../../context/auth";
import { Notification } from "../Admin/Notifications";

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
  main: {
    width: "100%",
    maxWidth: "100%",
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
      <Link color="inherit" href="http://192.168.0.1/" to="#">
        {t("Company.label")}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function ResetPassword() {
  const { t } = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [email, setEmail] = useState("");
  const { authenticated } = useAuth();

  const [open, setOpen] = useState(false);
  const [errorMessage, seterrorMessage] = useState([]);
  const [error, seterror] = useState(false);

  const handelSubmit = async (event) => {
    event.preventDefault();
    if (!loading) {
      setLoading(true);
    }
    let response = await postDataToAPI(
      `/api/user/SendResetPasswordEmail?email=${email}`
    );
    if (response.ok) {
      setIsReset(true);
      setLoading(false);
    } else {
      // let json = await response.json();
      setOpen(true);
      seterror(true);
      seterrorMessage(["Errrrror"] /* json.error */);
      setLoading(false);
    }
  };

  const onChange = (event) => {
    if (event.target.name === "email") {
      setEmail(event.target.value);
    }
  };

  if (authenticated) {
    return <Redirect to="/" />;
  } else {
    if (isReset === false) {
      return (
        <Container component="main" maxWidth="xs" data-testid="loggin">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {t("forgetpassword_enterEmail_msg")}
            </Typography>
            <form
              className={classes.form}
              noValidate
              onSubmit={handelSubmit}
              id="submitForm"
            >
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

              {loading && <LinearProgress color="secondary" />}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                data-testid="submit"
                className={classes.submit}
              >
                {t("send")}
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
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      );
    } else {
      return (
        <Container
        id="container"
          className={classes.main}
          component="main"
          maxWidth="xs"
          data-testid="loggin"
        >
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {t("forgetpassword_toContinue_checkMail_msg")}
            </Typography>
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      );
    }
  }
}
