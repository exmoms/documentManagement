import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withTranslation } from "react-i18next";

class ConfirmOperationDialog extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.props.handleClose;
  }
  t = this.props["t"];
  render() {
    let { type, title, contentText, buttonText } = this.props.content;
    let lang = localStorage.getItem("i18nextLng");
    return (
      <div>
        <Dialog
          open={this.props.open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div
            style={
              lang === "ar" ? { textAlign: "right" } : { textAlign: "left" }
            }
          >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          </div>
          <DialogContent>
            <div
              style={
                lang === "ar" ? { textAlign: "right" } : { textAlign: "left" }
              }
            >
              <DialogContentText id="alert-dialog-description">
                {contentText}
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              id="Back"
              onClick={() => this.handleClose(false, type)}
              color="primary"
              autoFocus
            >
              {this.t("cancel")}
            </Button>
            <Button
              id="Confirm"
              type="submit"
              onClick={() => this.handleClose(true, type)}
              form="update-form"
              color="primary"
              autoFocus
            >
              {buttonText}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withTranslation()(ConfirmOperationDialog);
