import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withTranslation } from "react-i18next";

class ConfirmUpdateDialog extends Component {
  constructor(props) {
    super(props);
    this.handleConfirmUpdate = this.props.handleConfirmUpdate;
    this.handleIgnoreUpdate = this.props.handleIgnoreUpdate;
    this.handleClose = this.props.handleClose;
  }
  t = this.props["t"];
  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {this.t("alert_exiteupdating")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.t("dialog_documentchanges")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              id="Back"
              onClick={this.handleClose}
              color="primary"
              autoFocus
            >
              {this.t("Button.back")}
            </Button>
            <Button
              id="Ignore"
              onClick={this.handleIgnoreUpdate}
              color="primary"
            >
              {this.t("button_ignore")}
            </Button>
            <Button
              id="Confirm"
              type="submit"
              form="update-form"
              color="primary"
              autoFocus
            >
              {this.t("button_confirm")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withTranslation()(ConfirmUpdateDialog);
