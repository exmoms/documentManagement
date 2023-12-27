/**
 * @file Contains ProcessAttachments component implementaion
 * @author Ali Daghman <ali.daghman@lit-co.net>
 * @version 1.0
 */

import React, { Component } from "react";
import AttachmentTable from "./AttachmentTable";
import { Notification } from "../Admin/Notifications";

import { postAttachmentData } from "../../api/PostData";
import CREATE_DOC_STYLES from "./Styles";
import { withStyles } from "@material-ui/core/styles";
import { fetchData } from "../../api/FetchData";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
// import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { withTranslation } from "react-i18next";

const styles = CREATE_DOC_STYLES;

class DocumentAttachments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      documentId: -1,
      attachments: [],
    };
    this.fileInputRef = React.createRef();
  }

  t = this.props["t"];

  fetchDocumentAttachments = async (documentId) => {
    let attachments = [];
    let url = `/api/Document/GetAttachmentsByDocumentId?docId=${documentId}`;
    await fetchData(url).then((data) => {
      if (data.length !== 0) {
        attachments = data.map((attachment) => {
          return {
            id: attachment.id,
            name: attachment.name,
            contentType: attachment.contentType,
            attachmentFile: attachment.attachmentFile,
            compoundModelId:
              attachment.compoundModelId !== undefined
                ? attachment.compoundModelId
                : null,
            caption: attachment.caption,
            addedDate: attachment.addedDate,
          };
        });
      }
    });
    return attachments;
  };

  async componentDidMount() {
    if (this.props.documentId !== this.state.documentId) {
      let attachments = await this.fetchDocumentAttachments(
        this.props.documentId
      );

      this.setState({
        documentId: this.props.documentId,
        attachments: attachments,
      });
    }
  }

  async componentDidUpdate() {
    if (this.props.documentId !== this.state.documentId) {
      let attachments = await this.fetchDocumentAttachments(
        this.props.documentId
      );

      this.setState({
        documentId: this.props.documentId,
        attachments: attachments,
      });
    }
  }

  addNewAttachmentOnClickHandler = () => {
    var fileUploader = this.fileInputRef;
    fileUploader.click();
  };

  onChangeFile = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    let id_ = this.props.documentId;

    if (file !== undefined && file !== null) {
      let url = "/api/Document/AddNewAttachmentToDocument";
      let payload = { DocumentId: id_ };
      let upload = false;

      let response = await postAttachmentData(payload, file, url);

      if (response.ok) {
        upload = true;
      } else {
        let json = await response.json();
        this.setState({
          openNotifiction: true,
          error: true,
          errorMessage: json.error,
        });
      }

      if (upload) {
        let attachments = await this.fetchDocumentAttachments(id_);
        this.setState({
          attachments: attachments,
          openNotifiction: true,
        });
      }
    }
  };

  handleCloseDialog = () => {
    this.props.handleClose();
  };

  updateAttachments = (attachments) => {
    this.setState({
      attachments: attachments,
    });
  };

  setOpenNotification = (value) => {
    this.setState({
      openNotifiction: value,
      error: false,
      errorMessage: [],
    });
  };

  render() {
    let { documentId } = this.props;
    return (
      <div>
        <input
          type="file"
          className={"onChangeFile" + documentId}
          id={documentId}
          key={documentId}
          //   required={attachment.isRequiered}
          ref={(ref) => {
            this.fileInputRef = ref;
          }}
          style={{ display: "none" }}
          onChange={this.onChangeFile}
        />

        <Dialog
          position="centerCenter"
          open={this.props.show}
          onClose={() => this.handleCloseDialog()}
          aria-labelledby="form-dialog-title"
        >
          {/* <DialogTitle id="form-dialog-title">Attachments Dialog</DialogTitle> */}
          <DialogContent>
            <Notification
              open={this.state.openNotifiction} // must be a "state" to show notification message [true or false]
              setOpen={this.setOpenNotification} // this function changes the state "open" value.
              error={this.state.error} // if error message put [true] else for success put [false]
              errorMessage={this.state.errorMessage} // the recived error message (array of string) from server.
            />
            <AttachmentTable
              attachments={this.state.attachments}
              updateAttachments={this.updateAttachments}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.handleCloseDialog()}
              id="toggleShowButton"
              color="primary"
            >
              {this.t("button_close")}
            </Button>
            <Button
              onClick={() => {
                this.addNewAttachmentOnClickHandler();
              }}
              id="toggleShowButton"
              color="primary"
            >
              {this.t("add_attachment")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(withTranslation()(DocumentAttachments));
