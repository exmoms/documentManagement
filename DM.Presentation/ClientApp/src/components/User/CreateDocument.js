/**
 * @file Contains CreateDocument component implementaion
 * @author Youssef Shaaban <y.shaaban@lit-co.net>
 * @version 1.0
 */
import { Divider } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { Component } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { fetchData } from "../../api/FetchData";
import { postDocumentData } from "../../api/PostData";
import parseResponseDataToJson from "../../utils/ParseMetaDataModel";
import AddAttachments from "./AddAttachments";
import AggregatedMetaDataModelForm from "./AggregatedMetaDataModelForm";
import SubmissionStep from "./CreateDocument/SubmissionStep";
import DocumentForm from "./DocumentForm";
import ScannedDocumentSelector from "./ScannedDocumentSelector";
import CREATE_DOC_STYLES from "./Styles";

function Copyright() {
  const { t } = useTranslation();
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" to="https://material-ui.com/">
        {t("link")}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const formStyles = CREATE_DOC_STYLES;

class CreateDocument extends Component {
  t = this.props["t"];

  constructor(props) {
    super(props);
    const initModel = {
      id: 0,
      name: "",
    };

    this.state = {
      response: null,
      uploading: false,
      response_error: "",
      scansError: false,
      metaDataModelsList: [],
      model: initModel,
      schema: {},
      ui_schema: {},
      attributesIdMap: [],
      aggregate_stp: true,
      attachment_stp: true,
      /* needed data to fill final doc that will be posted */
      id: 0,
      versionMessage: "",
      formData: [],
      aggregatedDocs: [],
      attachments: [],
      /* scanned doc may contain multi-pages, so we'll use an array */
      scannedDocFiles: [],
    };
    // preserve the initial state in a new object
    this.baseState = this.state;
    this.resetSomeState = {
      response: null,
      uploading: false,
      schema: {},
      ui_schema: {},
      attributesIdMap: [],
      aggregate_stp: true,
      attachment_stp: true,
      id: 0,
      versionMessage: "",
      formData: [],
      aggregatedDocs: [],
      attachments: [],
      scannedDocFiles: [],
    };
  }

  componentDidMount() {
    fetchData("/api/MetaDataModel/GetMetaDataModelsIdName")
      .then((value) => {
        this.setState({
          metaDataModelsList: value.map((metaDataModel) => {
            return {
              id: metaDataModel.id,
              name: metaDataModel.metaDataModelName,
            };
          }),
        });
      })
      /**
       * @todo render catched error to user, not for you as log in console
       */
      .catch((e) => console.log(e));
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.model.id !== 0 &&
      prevState.model.id !== this.state.model.id
    ) {
      fetchData(`/api/MetaDataModel/${this.state.model.id}`)
        .then((value) => {
          let con = value.metaDataModelName.localeCompare(
            this.state.schema.title
          );
          console.log("parseResponseDataToJsonMock");
          if (con !== 0) {
            console.log("parseResponseDataToJsonMockCon");
            let { json_schema, ui_schema, map } = parseResponseDataToJson(
              value
            );
            console.log(json_schema);
            console.log(ui_schema);
            console.log(map);
            this.setState({
              schema: json_schema,
              ui_schema: ui_schema,
              aggregate_stp: value.childMetaDataModels.length !== 0,
              attachment_stp: value.compoundModels.length !== 0,
              aggregatedDocs: value.childMetaDataModels.map(
                (aggregatedModel) => {
                  return {
                    modelId: aggregatedModel.id,
                    modelName: aggregatedModel.aggregateName,
                    childMetaDataModelId: aggregatedModel.childMetaDataModelId,
                    selectedDoc: {
                      id: -1,
                      name: "...",
                    },
                  };
                }
              ),
              attachments: value.compoundModels.map((compoundModel) => {
                return {
                  compoundModelId: compoundModel.id,
                  attachmentName: compoundModel.caption,
                  attachedFile: undefined,
                  isRequiered: compoundModel.isRequired,
                };
              }),
              attributesIdMap: map,
              // formData: [],
            });
          } else {
            this.setState({
              formData: [],
            });
          }
        })
        .catch((e) => console.log(e));
    }
  }

  handleDropdownList = (event, value, reason) => {
    switch (reason) {
      case "select-option":
        let restoredModel = localStorage.getItem(value.name);
        restoredModel = JSON.parse(restoredModel);
        if (restoredModel === null) {
          let newState = this.resetSomeState;
          newState["model"] = value;
          newState.id = value.id;
          this.setState(newState);
        } else {
          this.setState({
            id: value.id,
            model: value,
            versionMessage: restoredModel.versionMessage,
            formData: restoredModel.formData,
            aggregatedDocs: restoredModel.aggregatedDocs,
            attachments: restoredModel.attachments,
            // scannedDocFiles: restoredModel.scannedDocFiles,
          });
        }
        break;

      case "clear":
        let newState = this.baseState;
        newState.metaDataModelsList = this.state.metaDataModelsList;
        this.setState(newState);
        break;

      default:
        console.log(
          `ERROR was occurred, the following ${reason} case wasn't processed.`
        );
    }
  };

  resetForm = (e) => {
    this.handleDropdownList(e, null, "clear");
  };

  /**
   * A function that we would use to update values
   */
  updateValues = (formData) => {
    let temp = [];
    Object.keys(this.state.attributesIdMap).forEach((key) => {
      temp.push({
        Value: formData[key],
        AttributeId: this.state.attributesIdMap[key],
      });
    });
    return temp;
  };

  updateChildrenDocuments = (aggregatedDocs) => {
    let isValid = aggregatedDocs.every((item) => {
      return item.selectedDoc.id !== -1;
    });
    if (isValid) {
      this.setState({
        aggregatedDocs: aggregatedDocs,
      });
    }
  };

  updateAttachments = (attachments, isCompleted) => {
    if (isCompleted) {
      this.setState({
        attachments: attachments.map((item) => {
          let temp = item;
          temp.attachedFile = item.attachedFile;
          return temp;
        }),
      });
    }
  };

  submitForm = async ({ formData }) => {
    const {
      id,
      versionMessage,
      // formData,
      aggregatedDocs,
      attachments,
      scannedDocFiles,
    } = this.state;

    let valid_ = scannedDocFiles.length !== 0;

    if (valid_) {
      this.setState({ uploading: true });
      /**
       * Here where data be saved to a specific file on local storage
       * by the name of meta-data model to re-fill the fields when user
       * deals wiht the same model. related to issue #20.
       */
      let modelData_ = {
        id: id,
        versionMessage: versionMessage,
        formData: formData,
        aggregatedDocs: aggregatedDocs,
        attachments: attachments,
        // scannedDocFiles: scannedDocFiles,
      };
      let modelName_ = this.state.model.name;
      localStorage.setItem(modelName_, JSON.stringify(modelData_));
      /**
       * here where submission process goes
       */
      const document_data = {
        MetadataModelId: id,
        DocumentVersion: {
          VersionMessage: versionMessage,
          Values: this.updateValues(formData),
          ChildrenDocuments: aggregatedDocs.map((aggregatedDoc) => {
            return {
              ChildDocumentVersionId: aggregatedDoc.selectedDoc.latest_version,
              AggregateMetaDataModelID: aggregatedDoc.modelId,
            };
          }),
        },
        /* pass attachments name instaed of file itself */
        Attachments: attachments
          .filter((item) => item.attachedFile !== undefined)
          .map((item) => {
            return {
              CompoundModelId: item.compoundModelId,
              Name: item.attachedFile.name,
            };
          }),
      };

      /* pass attached files only, without any extra info */
      const attachedFiles = [];
      this.state.attachments
        .filter((item) => item.attachedFile !== undefined)
        .forEach((item) => attachedFiles.push(item.attachedFile));

      /* post document data, attachments and scanned pages of doc */
      let response = await postDocumentData(
        document_data,
        scannedDocFiles,
        attachedFiles,
        "/api/Document/AddNewDocument",
        "Add"
      );

      if (response.ok) {
        this.setState({
          response: response,
          uploading: false,
        });
      } else {
        let data = await response.json();
        this.setState({ response_error: data.error });
      }
    } else {
      this.setState({ scansError: true });
    }
  };

  updateScannedDocFiles = (
    scannedFiles = null,
    index = null /* this determines the mode if we remove or add files */
  ) => {
    const { scannedDocFiles } = this.state;
    if (index === null) {
      /// adding doc files
      this.setState({
        scansError: false,
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

  updateFormData = (formData) => {
    this.setState({ formData: formData });
  };

  renderDocMetaData = () => {
    return (
      <React.Fragment>
        <Autocomplete
          id="combo-box-metadata-model"
          style={{ width: 300 }}
          options={this.state.metaDataModelsList}
          getOptionLabel={(option) => option.name}
          onChange={this.handleDropdownList}
          value={this.state.model}
          renderInput={(params) => (
            <TextField
              {...params}
              label={this.t("createdocument_meatdatmodel")}
              variant="outlined"
              fullWidth
            />
          )}
        />
        <div style={{ padding: "10px 10px" }}>
          <TextField
            required
            disabled={!!!this.state.id}
            margin="dense"
            id="doc-version-msg"
            label={this.t("createdocument_docversionmessagelabel")}
            value={this.state.versionMessage}
            onChange={(e) =>
              this.setState({
                versionMessage: e.target.value,
              })
            }
            fullWidth
          />
        </div>
        <ScannedDocumentSelector
          error={this.state.scansError}
          updateScannedFiles={this.updateScannedDocFiles}
          scannedDocFiles={this.state.scannedDocFiles}
        />
      </React.Fragment>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="absolute" color="default" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              {this.t("createdocument_companyname")}
            </Typography>
          </Toolbar>
        </AppBar>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography
              className={classes.label}
              component="h1"
              variant="h4"
              align="center"
            >
              {this.t("createdocument_adddoc")}
            </Typography>
            <div id="doc-form-container" className={classes.margin}>
              {/* select model and fill doc meta data */}
              {this.renderDocMetaData()}
              {/* fill form */}
              <DocumentForm
                schema={this.state.schema}
                uiSchema={this.state.ui_schema}
                formData={this.state.formData}
                onChange={this.updateFormData}
                onSubmit={this.submitForm}
                id="fill-metadata-form"
              />

              <AggregatedMetaDataModelForm
                updater={this.updateChildrenDocuments}
                aggregatedDocsInfo={this.state.aggregatedDocs}
              />

              <Divider variant="middle" />
              <AddAttachments
                updater={this.updateAttachments}
                compoundModelsInfo={this.state.attachments}
              />

              <Divider variant="middle" />
              <React.Fragment>
                <div style={{ padding: "inherit", margin: "inherit" }}>
                  <SubmissionStep
                    response={this.state.response}
                    uploading={this.state.uploading}
                    errors={this.state.response_error}
                    handleResubmit={this.submitForm}
                    handleReset={this.resetForm}
                  />
                </div>
                {this.state.uploading === false && (
                  <div className={classes.buttons}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      form="fill-metadata-form"
                      className={classes.buttonForm}
                    >
                      {this.state.response === null
                        ? this.t("button_submit")
                        : this.t("resubmit")}
                    </Button>
                  </div>
                )}
              </React.Fragment>
            </div>
          </Paper>
          <Copyright />
        </main>
      </React.Fragment>
    );
  }
}

export default withStyles(formStyles)(withTranslation()(CreateDocument));
