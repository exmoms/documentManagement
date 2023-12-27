import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Form from "react-jsonschema-form";
import { fetchData } from "../../api/FetchData";
import { postDocumentData } from "../../api/PostData";
import parseDocumentDataToForm from "../../utils/ParseDocument";
import ConfirmUpdateDialog from "./ConfirmUpdateDialog";
import PreviewDocumentScans from "./PreviewDocumentScans";
import ScannedDocumentSelector from "./ScannedDocumentSelector";
import ShowDocumentChildren from "./ShowDocumentChildren";
import { Notification } from "../Admin/Notifications";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class UpdateOrPreviewDocumentDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documentVersionId: -1,
      documentId: -1,
      children_documents: [],
      option: this.props.option,
      schema: {},
      ui_schema: {},
      form_data: {},
      cashed_form_data: {},
      map: [],
      show_confirm_dialog: false,
      needed_update_id: -1,
      scannedDocFiles: [],
      document_scans: [],
      openNotifiction: false,
      error: false,
      errorMessage: [],
    };
    this.handleCloseFormParent = this.props.handler;
  }
  t = this.props["t"];
  getDocById = (id) => {
    fetchData(`/api/document/GetDocumentVersionById?id=${id}`)
      .then((value) => {
        let { schema, ui_schema, form_data, map } = parseDocumentDataToForm(
          value,
          this.props.option
        );

        // Add translation to Fixed fields in the schmea.
        if (schema.properties.metadataModelName !== undefined) {
          schema.properties.metadataModelName.title = this.t(
            "metadata_model_name"
          );
        }

        if (schema.properties.addedDate !== undefined) {
          schema.properties.addedDate.title = this.t("metadata_model_date");
        }

        if (schema.properties.latestVersion !== undefined) {
          schema.properties.latestVersion.title = this.t("latest_version");
        }

        if (schema.properties.versionMessage !== undefined) {
          schema.properties.versionMessage.title = this.t("version_message");
        }

        if (schema.properties.documentVersionAddedDate !== undefined) {
          schema.properties.documentVersionAddedDate.title = this.t(
            "document_version_added_date"
          );
        }

        if (schema.properties.documentVersion !== undefined) {
          schema.properties.documentVersion.title = this.t(
            "new_version_message"
          );
        }

        this.setState({
          documentId: value.id,
          documentVersionId: id,
          children_documents: value.documentVersion.childrenDocuments,
          option: this.props.option,
          schema: schema,
          ui_schema: ui_schema,
          form_data: form_data,
          cashed_form_data: {},
          map: map,
          show_confirm_dialog: false,
          needed_update_id: -1,
          document_scans: value.documentVersion.documenetScans,
        });
      })
      .catch((e) => console.log(e));
  };

  componentDidMount() {
    if (this.props.documentVersionId > 0) {
      this.getDocById(this.props.documentVersionId);
    }
  }

  componentDidUpdate() {
    if (
      this.props.documentVersionId !== this.state.documentVersionId &&
      this.props.documentVersionId > 0
    ) {
      this.getDocById(this.props.documentVersionId);
    }
  }

  updateDocumentFromChild = (id) => {
    this.setState({ show_confirm_dialog: true, needed_update_id: id });
  };

  handleClose(
    documentVersionId = -1,
    versionMessage = "",
    neededUpdateId = -1
  ) {
    this.handleCloseFormParent(
      documentVersionId,
      versionMessage,
      neededUpdateId
    );
  }

  onChange = ({ formData }) => {
    this.setState({ cashed_form_data: formData });
  };

  SendDocumentData = async (formData) => {
    const updated_document = {
      documentId: this.state.documentId,
      VersionMessage: formData["documentVersion"],
      Values: [],
      ChildrenDocuments: [],
    };

    Object.keys(formData).forEach((key, index) => {
      if (
        formData[key] !== this.state.form_data[key] &&
        key.localeCompare("documentVersion") !== 0
      ) {
        updated_document.Values.push({
          value: formData[key],
          attributeId: this.state.map[key],
        });
      }
    });
    this.state.children_documents.forEach((element) => {
      updated_document.ChildrenDocuments.push({
        childDocumentVersionId: element.childDocumentVersionId,
        aggregateMetaDataModelID: element.aggregateMetaDataModelID,
      });
    });

    let response = await postDocumentData(
      updated_document,
      this.state.scannedDocFiles,
      [],
      "/api/Document/UpdateDocumentVersion",
      "Update"
    );

    return response;
  };

  onSubmit = async ({ formData }) => {
    let response = await this.SendDocumentData(formData);

    // if doucment updated sucessfully
    if (response.ok) {
      let responseBody = await response.json();
      let updatedDocumentVersionId = responseBody.latestVersionId;

      this.handleClose(
        updatedDocumentVersionId,
        formData["documentVersion"],
        this.state.needed_update_id
      );
    } else {
      let responseBody = await response.json();
      this.setState({
        openNotifiction: true,
        error: true,
        errorMessage: responseBody.error,
      });
    }
  };

  contentText() {
    const { t } = this.props;
    switch (this.state.option) {
      case 0:
        return t("dialog_previewdocument");

      case 1:
        return t("dialog_updatedocument");

      default:
        break;
    }
  }

  showUpdateButtton() {
    const { t } = this.props;
    if (this.state.option === 1) {
      return (
        <Button
          type="submit"
          form="update-form"
          color="primary"
          id="showUpdateButtton"
        >
          {t("button_update")}
        </Button>
      );
    } else {
      return <br />;
    }
  }

  updateChildrenDocuments = (documents) => {
    this.setState({
      children_documents: documents.map((document) => {
        return {
          childDocumentVersionId: document.childDocumentVersionId,
          childMetadataModelId: document.childMetadataModelId,
          documentName: document.documentName,
          aggregateMetaDataModelID: document.aggregateMetaDataModelID,
          aggregateName: document.aggregateName,
        };
      }),
    });
  };

  // if the form data changed : fill the form with the newest data , otherwise fill it with the origin data
  assignFormData = () => {
    let temp = {};
    if (Object.entries(this.state.cashed_form_data).length === 0) {
      temp = this.state.form_data;
    } else {
      temp = this.state.cashed_form_data;
    }
    return temp;
  };

  handleIgnoreUpdate = () => {
    this.handleClose(-1, "", this.state.needed_update_id);
  };

  handleCloseConfirmDialog = () => {
    this.setState({
      needed_update_id: -1,
      show_confirm_dialog: false,
    });
  };

  updateScannedDocFiles = (
    scannedFiles = null,
    index = null /* this determines the mode if we remove or add files */
  ) => {
    const { scannedDocFiles } = this.state;

    if (index === null) {
      /// adding doc files
      this.setState({
        scannedDocFiles: scannedFiles,
      });
    } else {
      /// removeing doc files
      scannedDocFiles.splice(index, 1);
      this.setState({
        scannedDocFiles,
      });
    }
  };

  setOpenNotification = (value) => {
    this.setState({ openNotifiction: value });
  };

  render() {
    const { t } = this.props;
    let childrenDocumentsLength = this.state.children_documents.length;
    let lang = localStorage.getItem("i18nextLng");
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={() => {
            this.handleClose();
          }}
          aria-labelledby="form-dialog-title"
        >
          <div
            style={
              lang === "ar" ? { textAlign: "right" } : { textAlign: "left" }
            }
          >
            <DialogTitle id="form-dialog-title">
              {t("scasecompany")}
            </DialogTitle>
          </div>
          <DialogContent>
            <div
              style={
                lang === "ar" ? { textAlign: "right" } : { textAlign: "left" }
              }
            >
              <DialogContentText>{this.contentText()}</DialogContentText>
            </div>
            <Notification
              open={this.state.openNotifiction} // must be a "state" to show notification message [true or false]
              setOpen={this.setOpenNotification} // this function changes the state "open" value.
              error={this.state.error} // if error message put [true] else for success put [false]
              errorMessage={this.state.errorMessage} // the recived error message (array of string) from server.
            />
            <div
              style={
                lang === "ar" ? { textAlign: "right" } : { textAlign: "left" }
              }
            >
              <Form
                schema={this.state.schema}
                uiSchema={this.state.ui_schema}
                formData={this.assignFormData()}
                onSubmit={this.onSubmit}
                onChange={this.onChange}
                id="update-form"
              >
                <br />
              </Form>
            </div>
            {childrenDocumentsLength > 0 ? (
              <ShowDocumentChildren
                option={this.state.option}
                documents={this.state.children_documents}
                updater={this.updateChildrenDocuments}
                updateDocument={this.updateDocumentFromChild}
              />
            ) : (
              " "
            )}
            {this.props.option === 1 ? (
              <ScannedDocumentSelector
                updateScannedFiles={this.updateScannedDocFiles}
                scannedDocFiles={this.state.scannedDocFiles}
              />
            ) : (
              " "
            )}

            <PreviewDocumentScans scannedDoc={this.state.document_scans} />
          </DialogContent>
          <DialogActions>
            {this.showUpdateButtton()}
            <Button
              onClick={() => {
                this.handleClose();
              }}
              color="primary"
            >
              {t("button_close")}
            </Button>
          </DialogActions>
        </Dialog>
        <ConfirmUpdateDialog
          open={this.state.show_confirm_dialog}
          handleIgnoreUpdate={this.handleIgnoreUpdate}
          handleClose={this.handleCloseConfirmDialog}
        />
      </div>
    );
  }
}

export default withTranslation()(UpdateOrPreviewDocumentDialog);
