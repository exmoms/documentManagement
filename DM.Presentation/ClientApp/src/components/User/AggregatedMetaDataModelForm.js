/**
 * @file Contains AggregatedMetaDataModel component implementaion
 * @author Youssef Shaaban <y.shaaban@lit-co.net>
 * @version 1.0
 */

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

class AggregatedMetaDataModelForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numberOfAggregatedModels: this.props.aggregatedDocsInfo.length,
      /**
       * Array of IDs of child documents that want to aggregate
       * list of objects
       * [{
       *   modelId: [int] id of aggregatedModels,
       *   modelName: [string],
       *   childMetaDataModelId: [int]
       *   selectedDOC: [object] {id: [int], name: [string]}
       * }]
       */
      // current avialable document to browse [temp]
      currentModelId: -1,
      showAggregateDocPopUp: false,
    };
    this.updateParentAggregatedDocs = this.props.updater;
  }
  t = this.props["t"];

  componentDidUpdate(prevProps) {
    if (this.props.aggregatedDocsInfo !== prevProps.aggregatedDocsInfo) {
      var temp = this.props.aggregatedDocsInfo.map((aggregatedModel) => {
        return {
          modelId: aggregatedModel.id,
          selectedId: -1,
        };
      });
      this.setState({
        aggregatedDocuments: temp,
        numberOfAggregatedModels: this.props.aggregatedDocsInfo.length,
        // aggregatedModels: this.props.aggregatedDocsInfo
      });
    }
  }

  addAggreDocOnClickHandler = (aggregatedDoc) => {
    this.setState({
      currentModelId: aggregatedDoc.childMetaDataModelId,
      showAggregateDocPopUp: true,
    });
  };

  updateStateFromChild = (attribName, newState) => {
    if (attribName === "show") {
      this.setState({ showAggregateDocPopUp: newState });
    }
    if (attribName === "addDoc") {
      var index = -1;
      index = this.props.aggregatedDocsInfo.findIndex((item) => {
        return (
          item.childMetaDataModelId === newState.modelId &&
          newState.selectedDoc.id !== -1
        );
      });
      if (index === -1) {
        if (process.env.NODE_ENV === "development") {
          console.log(
            "[ERROR] Can't find the corresponding model with ID:",
            newState.modelId
          );
        }
      } else {
        if (process.env.NODE_ENV === "development") {
          console.log(
            "[SUCCESS] Update with the corresponding model with ID",
            newState.modelId,
            "with selected doc id:",
            newState.selectedDoc.id
          );
        }
        var temp = this.props.aggregatedDocsInfo;
        temp[index].selectedDoc = newState.selectedDoc;
        this.updateParentAggregatedDocs(temp);
      }
    }
  };

  renderAggregatedModelsTable = () => {
    const { classes } = this.props;
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{this.t("namelabel")} </TableCell>

              <TableCell>{this.t("actions")} </TableCell>

              <TableCell>{this.t("selecteddocumentname")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.aggregatedDocsInfo.map((aggregatedDoc) => (
              <TableRow key={aggregatedDoc.modelId}>
                <TableCell>{aggregatedDoc.modelName}</TableCell>
                <TableCell>
                  <Button
                    id={"addAggregated" + aggregatedDoc.modelId}
                    onClick={() => {
                      this.addAggreDocOnClickHandler(aggregatedDoc);
                    }}
                    variant="outlined"
                    color="primary"
                    size="small"
                    className={classes.buttonTable}
                  >
                    {this.t("addaggregateddoc")}
                  </Button>
                </TableCell>
                <TableCell
                  id={"table-cell-aggregated-doc" + aggregatedDoc.modelId}
                >
                  {aggregatedDoc.selectedDoc.name}
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
      if (this.state.numberOfAggregatedModels !== 0) {
        return (
          <div>
            {this.renderAggregatedModelsTable()}
            <BrowseAggregatedDocsPopUp
              modelId={this.state.currentModelId}
              show={this.state.showAggregateDocPopUp}
              action={this.updateStateFromChild}
            />
          </div>
        );
      }
    };
    return <div>{renderContents()}</div>;
  }
}

export default withStyles(styles)(
  withTranslation()(AggregatedMetaDataModelForm)
);
