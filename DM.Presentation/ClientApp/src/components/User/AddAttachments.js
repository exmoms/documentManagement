/**
 * @file Contains AddAttachments component implementaion
 * @author Youssef Shaaban <y.shaaban@lit-co.net>
 * @version 1.0
 */

import React, { Component } from "react";

import CREATE_DOC_STYLES from "./Styles";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import { withTranslation } from "react-i18next";
const styles = CREATE_DOC_STYLES;
/**
 * Two required props:
 *  - updater: handle changes of attachments and update it for parent component
 *  - compoundModelsInfo: contains the info of the required attachments
 */
export class AddAttachments extends Component {
  inputRefs = new Set();

  constructor(props) {
    super(props);

    this.state = {
      /**
       * list of objects
       * {
       *   compoundModelId: [int],
       *   attachmentName: [string]
       *   attachedFile: [file/pathOnServer]
       *   isRequiered: [bool]
       * }
       */
      isCompleted: false,
      attachments: this.props.compoundModelsInfo,
      show: false,
      index: -1,
    };
    this.updateParentAttachments = this.props.updater;
  }
  t = this.props["t"];

  componentDidUpdate(prevProps) {
    if (this.props.compoundModelsInfo !== prevProps.compoundModelsInfo) {
      this.inputRefs = new Set();
      this.setState({ attachments: this.props.compoundModelsInfo });
    }
  }

  addAttachmentcOnClickHandler = (compoundModel) => {
    /**
     * @todo handle how to add an attachment
     */

    var temp = [...this.inputRefs];
    var index = temp.findIndex((item) => {
      if (item === null) {
        return false;
      } else {
        return parseInt(item.id) === compoundModel.compoundModelId;
      }
    });
    if (index !== -1) {
      var fileUploader = temp[index];
      fileUploader.click();
    }
  };

  onChangeFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    let id_ = parseInt(event.target.id);

    if (file !== undefined && file !== null) {
      var index_ = -1;
      index_ = this.state.attachments.findIndex((item) => {
        return item.compoundModelId === id_;
      });

      if (index_ === -1) {
        if (process.env.NODE_ENV === "development") {
          console.log("[ERROR] Can't find the event.target.id:", id_);
        }
      } else {
        /* Check if the file had never been add, no duplicated attachments */
        let valid = this.state.attachments.every((item, idx) => {
          let valid_ = true;
          if (idx !== index_) {
            if (item.attachedFile !== undefined) {
              valid_ = item.attachedFile.name !== file.name;
            }
          }
          return valid_;
        });

        if (valid) {
          let temp = this.state.attachments;
          temp[index_].attachedFile = file;
          let validateAttachments = temp.every((item) => {
            let requiredIsAttached =
              item.isRequiered && item.attachedFile !== undefined;
            let unrequiredIsNotAttachedOrAttached = !item.isRequiered;

            return requiredIsAttached || unrequiredIsNotAttachedOrAttached;
          });

          /// we want to upload latter
          this.setState({
            attachments: temp,
            isCompleted: validateAttachments,
          });
          /**
           * @todo add functionality to delete the attched file
           * maybe user after his selection changes his mind
           */
          document.getElementById(
            "table-cell-aggregated-doc" + temp[index_].compoundModelId
          ).innerHTML = file.name;
          this.updateParentAttachments(temp, validateAttachments);
        } else {
          /* case of the attached file is duplicated */
          /// reset input element to trige onChange
          event.target.value = null;

          let temp = this.state.attachments;
          temp[index_].attachedFile = undefined;

          this.setState({
            index: index_,
            show: true,
            isCompleted: false,
            attachments: temp,
          });
        }
      }
    }
  };

  renderCompoundModelsTable = () => {
    const { attachments } = this.state;
    const { classes } = this.props;
    /**
     * @todo This table should render one time and one more for each time we change/switch
     * to another model
     */
    if (this.props.compoundModelsInfo.length !== 0) {
      return (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>{this.t("namelabel")}</TableCell>
                <TableCell>{this.t("actions")}</TableCell>
                <TableCell>{this.t("attachedfilename")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attachments.map((attachment, index) => {
                // Once the fileUploader must be differnent for each upload button
                // let fileUploaderName = `fileUploader${compoundModel.compoundModelId}`;
                return (
                  <TableRow key={attachment.compoundModelId}>
                    <TableCell>
                      {attachment.isRequiered
                        ? attachment.attachmentName + " *"
                        : attachment.attachmentName}
                    </TableCell>
                    <TableCell>
                      <Button
                        id={"addAttachment" + attachment.compoundModelId}
                        onClick={(e) => {
                          console.log(
                            "call the click event on an attachment with id " +
                              attachment.compoundModelId
                          );
                          this.addAttachmentcOnClickHandler(attachment);
                        }}
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.buttonTable}
                        startIcon={<CloudUploadIcon />}
                      >
                        <input
                          type="file"
                          className={
                            "onChangeFile" + attachment.compoundModelId
                          }
                          id={attachment.compoundModelId}
                          required={attachment.isRequiered}
                          ref={(ref) => {
                            this.inputRefs.add(ref);
                          }}
                          style={{ display: "none" }}
                          onChange={this.onChangeFile}
                        />
                        {this.t("button_attach")}
                      </Button>
                    </TableCell>
                    <TableCell
                      id={
                        "table-cell-aggregated-doc" + attachment.compoundModelId
                      }
                    >
                      {this.state.attachments[index].attachedFile
                        ? this.state.attachments[index].attachedFile.name
                        : "..."}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  };

  toggleShow = (show) => {
    this.setState({
      show: show,
      index: -1,
    });
  };

  renderDuplicatedAttachmentsDialog = () => {
    if (this.state.index !== -1) {
      return (
        <div>
          <Dialog
            position="centerCenter"
            open={this.state.show}
            onClose={() => this.toggleShow(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              {this.t("dialog_duplicatedattachment")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {this.t("dialog_selectedbefore")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                id={"addAttachmentcOnClickHandlerButton" + this.state.index}
                onClick={
                  /* re-open file browser to select another file */
                  (e) => {
                    console.log(
                      "call the click event on an attachment with id " +
                        this.state.attachments[this.state.index].compoundModelId
                    );
                    this.addAttachmentcOnClickHandler(
                      this.state.attachments[this.state.index]
                    );
                    this.toggleShow(false);
                  }
                }
                color="primary"
              >
                {this.t("button_addfile")}
              </Button>
              <Button
                onClick={() => this.toggleShow(false)}
                id="toggleShowButton"
                color="primary"
              >
                {this.t("button_cancel")}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
  };

  render() {
    return (
      <div>
        <div>{this.renderCompoundModelsTable()}</div>
        <div>{this.renderDuplicatedAttachmentsDialog()}</div>
      </div>
    );
  }
}

export default withStyles(styles)(withTranslation()(AddAttachments));
