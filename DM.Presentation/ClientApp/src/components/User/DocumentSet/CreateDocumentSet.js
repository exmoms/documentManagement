/**
 * @file Contains CreateDocumentSet component implementaion
 * @author Ali Daghman <ali.daghman@lit-co.net>
 * @version 1.0
 */

import React, { Fragment } from "react";
import { Redirect } from "react-router";
import { TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { postDataToAPI } from "../../../api/PostData";
import { withTranslation } from "react-i18next";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

const styles = (theme) => ({
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
  Button: {
    marginTop: "70px",
  },
});

class CreateDocumentSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      redirectToDocumentSet: false,
      openNotifiction: false,
      error: false,
      errorMessage: [],
    };

    this.handleClose = this.props.action;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate() {
    if (this.state.redirectToDocumentSet) {
      this.setState(
        {
          redirectToDocumentSet: false,
        },
        this.handleClose()
      );
    }
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSubmit = async (event) => {
    let set = this.props.set;
    let response = {};
    if (set.id === 0) {
      response = await postDataToAPI("/api/DocumentSet/AddNewDocumentSet", {
        Name: this.state.name,
      });
    } else {
      response = await postDataToAPI("/api/DocumentSet/AddNewDocumentSet", {
        Name: this.state.name,
        ParentDocumentSet: set.id,
      });
    }
    if (response.ok) {
      this.setState(
        {
          redirectToDocumentSet: true,
          name: "",
          openNotifiction: true,
        } //,
        //this.handleClose()
      );
    } else {
      let json = await response.json();
      this.setState(
        {
          redirectToDocumentSet: true,
          name: "",
          openNotifiction: true,
          error: true,
          errorMessage: json.error,
        } //,
        // this.handleClose()
      );
    }
  };

  t = this.props["t"];
  render() {
    const { classes } = this.props;
    let lang = localStorage.getItem("i18nextLng");
    return (
      <Fragment>
        <Dialog
          position="centerCenter"
          open={this.props.show}
          onClose={() => this.handleClose()}
          maxWidth={"xs"}
        >
          <div
            style={
              lang === "ar" ? { textAlign: "right" } : { textAlign: "left" }
            }
          >
            <DialogTitle id="simple-dialog-title">
              {this.t("documentset_addnewdocumentset")}
            </DialogTitle>
          </div>
          <DialogContent>
            <div className={classes.root}>
              <div className={classes.box}>
                <div
                  style={
                    lang === "ar"
                      ? { textAlign: "right" }
                      : { textAlign: "left" }
                  }
                >
                  {this.t("documentset_entername")}
                </div>
                <TextField
                  id="standard-basic"
                  className={classes.textField}
                  required
                  helperText={this.t("hypertext_required")}
                  label={this.t("namelabel")}
                  fullWidth
                  value={this.state.name}
                  onChange={this.handleChange}
                />
                <br />
                <Button
                  variant="contained"
                  className={classes.Button}
                  color="primary"
                  fullWidth
                  onClick={this.handleSubmit}
                >
                  {" "}
                  {this.t("button_submit")}
                </Button>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              id="CancelButton"
              onClick={() => this.handleClose()}
              color="primary"
            >
              {this.t("cancel")}
            </Button>
          </DialogActions>
        </Dialog>
        {this.state.redirectToDocumentSet && (
          <Redirect
            to={{
              pathname: "/document-set",
              state: {
                id: this.props.set.id,
                name: this.props.set.name,
                openNotifiction: this.state.openNotifiction,
                error: this.state.error,
                errorMessage: this.state.errorMessage,
              },
            }}
          />
        )}
      </Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withTranslation()(CreateDocumentSet)
);
