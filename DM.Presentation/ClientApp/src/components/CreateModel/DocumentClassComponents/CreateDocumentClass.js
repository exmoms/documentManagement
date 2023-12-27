import React from "react";
import { TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import { postDataToAPI } from "../../../api/PostData";
import { Redirect } from "react-router-dom";
import { withTranslation } from "react-i18next";
import "react-notifications-component/dist/theme.css";
import "animate.css";
import { Notification } from "../../Admin/Notifications";

const styles = (theme) => ({
  appBar: {
    position: "relative",
  },

  root: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  box: {
    padding: "10px",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  Typography: {
    padding: theme.spacing(4),
  },
  Button: {
    marginTop: "70px",
  },
});

class CreateDocumentClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documentClassName: "",
      redirect: null,
      open: false,
      errorMessage: [],
      error: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ documentClassName: event.target.value });
  }

  handleSubmit(event) {
    console.log(JSON.stringify(this.state));
    if (this.state.documentClassName === "") {
      this.setState({
        open: true,
        error: true,
        errorMessage: [this.t("docName_error")],
      });
    } else {
      postDataToAPI("/api/DocumentClass/AddNewDocumentClass", this.state).then(
        (res) => {
          if (res.ok) {
            this.setState({ documentClassName: "", open: true, error: false });
          } else {
            res.json().then((res) =>
              this.setState({
                open: true,
                error: true,
                errorMessage: res.error,
              })
            );
          }
        }
      );
    }

    event.preventDefault();
  }

  setOpen = (val) => {
    this.setState({ open: val });
  };

  t = this.props["t"];
  render() {
    const { classes } = this.props;
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div className={classes.root}>
        <div className={classes.box}>
          <Typography variant="h5" align="left">
            {this.t("createdoc_typograph")}
          </Typography>
          <form onSubmit={this.handleSubmit} className="onSubmitForm">
            <TextField
              id="standard-basic"
              className={classes.textField}
              helperText={this.t("hypertext_required")}
              label={this.t("namelabel")}
              fullWidth
              autoComplete="off"
              value={this.state.documentClassName}
              onChange={this.handleChange}
            />
            <br />
            <Button
              variant="contained"
              className={classes.Button}
              color="primary"
              fullWidth
              type="submit"
            >
              {" "}
              {this.t("button_submit")}
            </Button>
          </form>
        </div>
        <Notification
        id="notification"
          open={this.state.open} // must be a "state" to show notification message [true or false]
          setOpen={this.setOpen} // this function changes the state "open" value.
          error={this.state.error} // if error message put [true] else for success put [false]
          errorMessage={this.state.errorMessage} // the recived error message (array of string) from server.
        />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withTranslation()(CreateDocumentClass)
);
