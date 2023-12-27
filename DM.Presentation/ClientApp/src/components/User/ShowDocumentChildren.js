import React, { Component } from "react";
import BrowseAggregatedDocsPopUp from "./BrowseAggregatedDocsPopUp";
import styles from "./Styles";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import { withTranslation } from "react-i18next";
class ShowDocumentChildren extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentModelId: -1,
      showAggregateDocPopUp: false,
    };
    this.updateParentAggregatedDocs = this.props.updater;
    this.updateDocument = this.props.updateDocument;
  }

  updateStateFromChild = (attribName, newState) => {
    if (attribName === "show") {
      this.setState({ showAggregateDocPopUp: newState });
    }
    if (attribName === "addDoc") {
      var index = -1;
      index = this.props.documents.findIndex((item) => {
        return (
          item.childMetadataModelId === newState.modelId &&
          newState.selectedDoc.id !== -1
        );
      });
      if (index === -1) {
        if (process.env.NODE_ENV === "development") {
          console.log(
            "[ERROR] Can't find the newState.modelId:",
            newState.modelId
          );
        }
      } else {
        if (process.env.NODE_ENV === "development") {
          console.log(
            "[SUCCESS] Update with the newState.modelId",
            newState.modelId,
            "with selected id:",
            newState.selectedDoc.id
          );
        }
        var temp = this.props.documents;
        temp[index].childDocumentVersionId =
          newState.selectedDoc.latest_version;
        temp[index].documentName = newState.selectedDoc.name;

        this.updateParentAggregatedDocs(temp);
      }
    }
  };

  updateChildDocOnClickHandler = (id) => {
    console.log("form ShowDocumentChildern:", id);
    this.updateDocument(id);
  };

  changeChildDocOnClickHandler = (model_id) => {
    this.setState({
      currentModelId: model_id,
      showAggregateDocPopUp: true,
    });
  };

  renderAggregatedModelsTable = (documents) => {
    const { classes } = this.props;
    const { t } = this.props;
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{t("tablecell_aggregatedname")}</TableCell>
              <TableCell>{t("tablecell_documentname")}</TableCell>
              <TableCell>{t("tablecell_actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.childDocumentVersionId} >
                <TableCell >{document.aggregateName}</TableCell>
                <TableCell >{document.documentName}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      this.changeChildDocOnClickHandler(
                        document.childMetadataModelId
                      );
                    }}
                    variant="outlined"
                    color="primary"
                    size="small"
                    disabled={!!!this.props.option}
                    className={classes.buttonTable}
                  >
                    {t("button_change")}
                  </Button>
                  <Button
                    onClick={() => {
                      this.updateChildDocOnClickHandler(
                        document.childDocumentVersionId
                      );
                    }}
                    variant="outlined"
                    color="primary"
                    size="small"
                    disabled={!!!this.props.option}
                    className={classes.buttonTable}
                  >
                    {t("button_update")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  render() {
    // Check if there is any data to render
    const renderContents = () => {
      return (
        <div>
          {this.renderAggregatedModelsTable(this.props.documents)}
          <BrowseAggregatedDocsPopUp
            modelId={this.state.currentModelId}
            show={this.state.showAggregateDocPopUp}
            action={this.updateStateFromChild}
          />
        </div>
      );
    };
    return <div>{renderContents()}</div>;
  }
}

export default withStyles(styles)(withTranslation()(ShowDocumentChildren));
