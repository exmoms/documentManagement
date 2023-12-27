/**
 * @file Implements only one component which is EmailPopUp
 * @author Youssef Shaaban <y.shaaban@lit-co.net>
 * @version 1.0
 */

import { DialogContentText, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { postDataToAPI } from "../../api/PostData";
import CREATE_DOC_STYLES from "./Styles";
import { Notification } from "../Admin/Notifications";

const styles = CREATE_DOC_STYLES;

/**
 * A component displays a pop-up contains email fields and is attched with document to send
 */
class EmailPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfRecievers: 0,
      showSubmissionDialog: false,
      error: false,
      errorMessage: [],
    };

    this.parentToggleShow = this.props.toggleShow;
  }
  t = this.props["t"];

  /**
   * handle onClose and update show state in parent componemnt to false
   */
  toggleShow = (show = false) => {
    this.setState({ showSubmissionDialog: show });
    this.parentToggleShow(false);
  };

  /**
   * handle onChange events for multi reciever elements, check validation of email
   * and enable new reciever text field in case it's valid.
   */
  onChange = (e) => {
    const email = e.target.value;
    const id = e.target.id;

    const validEmail =
      email && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
    if (validEmail && id === `reciever-${this.state.numberOfRecievers}`) {
      this.setState({ numberOfRecievers: this.state.numberOfRecievers + 1 });
    }
  };

  /**
   * handle onClick event for send button and request api for emailing the data.
   */
  toggleSend = async (e) => {
    e.preventDefault();
    const recieverNodeList = document.getElementsByName("reciever");
    let recievers = [];
    for (let idx = 0; idx < recieverNodeList.length; idx++) {
      const element = recieverNodeList[idx];
      if (element.value !== "") {
        recievers.push(element.value);
      }
    }

    // const sender = document.getElementById("sender").value;
    const subject = document.getElementById("subject").value;
    const emailBody = document.getElementById("body").value;

    const documentsVersionIDs = this.props.dataToSend.map((element) => {
      return element.latestVersion;
    });

    let emailData = {
      Subject: subject,
      RecieverEmails: recievers,
      // SenderName: sender,
      EmailBody: emailBody,
      DocumentVersionIds: documentsVersionIDs,
    };

    let response = await postDataToAPI(
      "/api/Document/SendDocumentScansByEmail",
      emailData
    );
    if (response.ok) {
      this.setState({
        showSubmissionDialog: true,
      });
    } else {
      let data = await response.json();
      this.setState({
        showSubmissionDialog: true,
        error: true,
        errorMessage: data.error,
      });
    }
  };

  /**
   * @returns string of names of all selected-to-send documents
   */
  documentsNames = () => {
    var names = "";
    this.props.dataToSend.forEach((element) => {
      names += element.documentName;
    });
    return names;
  };

  renderRecieversFields = () => {
    const { classes } = this.props;
    let listOfInputs = [];
    for (let index = 0; index < this.state.numberOfRecievers + 1; index++) {
      listOfInputs.push(
        <TextField
          required={index === 0}
          margin="dense"
          name="reciever"
          key={index}
          id={`reciever-${index}`}
          label={this.t("to")}
          type="email"
          fullWidth
          className={classes.margin}
          onChange={this.onChange}
        />
      );
    }
    return listOfInputs;
  };

  render() {
    const { classes } = this.props;
    let lang = localStorage.getItem("i18nextLng");
    return (
      <div>
        <Dialog
          open={this.props.show}
          onClose={this.toggleShow}
          aria-labelledby="form-dialog-title"
        >
          <div
            style={
              lang === "ar" ? { textAlign: "right" } : { textAlign: "left" }
            }
          >
            <DialogTitle id="form-dialog-title">
              {this.t("subscribe")}
            </DialogTitle>
          </div>
          <form
            className={classes.root}
            onSubmit={this.toggleSend}
            id="emailDocForm"
          >
            <DialogContent>
              <div
                style={
                  lang === "ar" ? { textAlign: "right" } : { textAlign: "left" }
                }
              >
                <DialogContentText>
                  {this.t("send_email_to")}{" "}
                  {'" ' + this.documentsNames() + ' "'}.
                </DialogContentText>
              </div>
              <div id="recievers">{this.renderRecieversFields()}</div>
              <TextField
                required
                margin="dense"
                id="subject"
                label={this.t("email_subject")}
                type="text"
                fullWidth
                className={classes.margin}
              />
              <TextField
                required
                margin="dense"
                id="body"
                label={this.t("email_body")}
                multiline
                rows={10}
                fullWidth
                className={classes.margin}
              />
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                value="Submit"
                variant="contained"
                // onClick={this.toggleSend}
                color="primary"
              >
                {this.t("send")}
              </Button>
              <Button onClick={this.toggleShow} color="primary">
                {this.t("cancel")}
              </Button>
            </DialogActions>
          </form>
          <Notification
            id="notification"
            open={this.state.showSubmissionDialog}
            setOpen={this.toggleShow}
            error={this.state.error}
            errorMessage={this.state.errorMessage}
          />
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(withTranslation()(EmailPopUp));
