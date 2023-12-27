/**
 * @file Contains ConfigEmail component implementation
 * @author Youssef Shaaban <y.shaaban@lit-co.net>
 * @version 1.0
 */

import {
  Button,
  Container,
  CssBaseline,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import clsx from "clsx";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { postDataToAPI } from "../../../api/PostData";
import { fetchData } from "../../../api/FetchData";
import { Notification } from "../../Admin/Notifications";

const useStyles = (theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 1, 2),
  },
  margin: {
    margin: theme.spacing(1),
  },
  textField: {
    width: "100%",
  },
});

class ConfigEmail extends Component {
  t = this.props["t"];

  addConfigURL = "/api/Mail/AddConfig";
  testMailServerConnectionURL = "/api/Mail/TestConnection";
  getConfigURL = "/api/Mail/GetConfig";
  buttonCase = "";

  constructor(props) {
    super(props);
    this.state = {
      password: "",
      showPassword: false,
      portError: false,
      portErrorText: "",
      testedSuccess: false,
      open: false,
      error: false,
      errorMessage: [],
    };
  }

  componentDidMount() {
    fetchData(this.getConfigURL).then((data) => {
      document.getElementById("email").value = data.email;
      document.getElementById("server").value = data.server;
      document.getElementById("port").value = data.port;
      this.setState({
        password: data.password,
      });
    });
  }

  handlePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  /**
   * handle onChange event for port to check if it's valid
   */
  onChangePort = (e) => {
    const port = e.target.value;

    const validPort =
      port &&
      /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/i.test(
        port
      );

    if (!validPort) {
      this.setState({
        portError: true,
        portErrorText: this.t("invalid_port"),
      });
    } else {
      this.setState({
        portError: false,
        portErrorText: "",
      });
    }
  };

  handelSubmit = (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const server = document.getElementById("server").value;
    const port = document.getElementById("port").value;

    const formData = {
      Server: server,
      Port: parseInt(port),
      email: email,
      Password: this.state.password,
    };

    if (
      email !== "" ||
      server !== "" ||
      port !== "" ||
      this.state.password !== ""
    ) {
      switch (this.buttonCase) {
        case "setup":
          if (this.state.testedSuccess) {
            postDataToAPI(this.addConfigURL, formData).then((addRes) => {
              if (addRes.status === 200) {
                this.setState({ open: true, error: false, errorMessage: [] });
                // alert(`Mail configuration is added successfully.`);
              } else {
                this.setState({
                  open: true,
                  error: true,
                  errorMessage: [this.t("Mail_con_err")],
                });
                // alert(`ERROR ${addRes.status}: ${addRes.statusText}`);
              }
            });
          } else {
            // alert("You have to test your configuration and be sure it works.");
            this.setState({
              open: true,
              error: true,
              errorMessage: [this.t("Mail_con_test")],
            });
          }
          break;

        case "test":
          postDataToAPI(this.testMailServerConnectionURL, formData).then(
            (res) => {
              if (res.status === 200) {
                // alert(
                //   `Mail configuration is tested and it successfully works.`
                // );
                this.setState({
                  testedSuccess: true,
                  open: true,
                  error: false,
                });
              } else {
                // alert(`ERROR ${res.status}: ${res.statusText}`);
                this.setState({
                  open: true,
                  error: true,
                  errorMessage: [this.t("Mail_con_test_err")],
                });
              }
            },
            (error) => console.log(error)
          );
          break;

        default:
          console.log(this.buttonCase);
          break;
      }
    }
  };

  setOpen = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const { showPassword, password, portErrorText, portError } = this.state;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <form
            className={classes.form}
            onSubmit={this.handelSubmit}
            id="submitForm"
          >
            <TextField
              className={classes.margin}
              variant="outlined"
              fullWidth
              name="email"
              label={this.t("emailaddress")}
              defaultValue="Enter your email"
              type="email"
              id="email"
            />
            <FormControl
              id="password-form"
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
            >
              <InputLabel
                htmlFor="outlined-adornment-password"
                id="password-label"
              >
                {this.t("password")}
              </InputLabel>
              <OutlinedInput
                id="OutlinedInput"
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={this.handlePassword}
                value={password}
                endAdornment={
                  <InputAdornment position="end" id="input-adornment-password">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={this.handleClickShowPassword}
                      onMouseDown={this.handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
              />
            </FormControl>
            <TextField
              className={classes.margin}
              variant="outlined"
              fullWidth
              name="server"
              label={this.t("server")}
              defaultValue="Enter server of email"
              type="text"
              id="server"
            />
            <TextField
              className={classes.margin}
              variant="outlined"
              fullWidth
              onChange={this.onChangePort}
              error={portError}
              helperText={portErrorText}
              name="port"
              label={this.t("port")}
              defaultValue={-1}
              type="number"
              id="port"
            />
            <Button
              id="buttonTest"
              type="submit"
              onClick={() => (this.buttonCase = "test")}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {this.t("test")}
            </Button>
            <Button
              id="buttonSetUP"
              type="submit"
              onClick={() => (this.buttonCase = "setup")}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {this.t("setup_email_configuration")}
            </Button>
          </form>
        </div>
        <Notification
          id="notification"
          open={this.state.open}
          setOpen={this.setOpen}
          error={this.state.error}
          errorMessage={this.state.errorMessage}
        />
      </Container>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(ConfigEmail));
