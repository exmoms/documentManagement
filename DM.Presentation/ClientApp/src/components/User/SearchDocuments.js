import React, { Component } from "react";

import SearchDocumentByValue from "./SearchDocumentByValue";
import SearchDocumentByFreeText from "./SearchDocumentByFreeText";
import { postDataToAPI } from "../../api/PostData";
import { Notification } from "../Admin/Notifications";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import { withTranslation } from "react-i18next";

export class SearchDocuments extends Component {
  constructor() {
    super();
    this.state = {
      value: "free-text",
      search_url: "",
      request_payload: {},
      selectedAttributeNames: [],
      openNotifiction: false,
      error: false,
      errorMessage: [],
    };
    this.composeSearchRequest = this.composeSearchRequest.bind(this);
  }

  composeTableColumns = (action) => {
    const { t } = this.props;
    let columns = [];
    let { selectedAttributeNames } = this.state;
    switch (action) {
      case "browse-document":
      case "update-document":
      case "add-to-documentset":
        if (this.state.value === "free-text") {
          columns.push({
            title: t("documenttable_attributename"),
            field: "attributeName",
          });
          columns.push({
            title: t("documenttable_attributevalue"),
            field: "attributeValue",
          });
        } else {
          selectedAttributeNames.forEach((name, index) => {
            columns.push({ title: name, field: name });
          });
        }

        columns.push({
          title: t("documenttable_docid"),
          field: "documentId",
          hidden: true,
        });
        columns.push({
          title: t("documenttable_docname"),
          field: "documentName",
          hidden: true,
        });
        columns.push({
          title: t("documenttable_latestversion"),
          field: "latestVersion",
        });

        break;
      case "show-history":
        columns = [
          { title: t("documenttable_docname"), field: "documentName" },
          {
            title: t("documenttable_docid"),
            field: "documentId",
            hidden: true,
          },
          { title: t("version_message"), field: "versionMessage" },
          { title: t("added_date"), field: "addedDate" },
          {
            title: t("version_id"),
            field: "latestVersion",
          },
        ];
        break;
      default:
    }
    return columns;
  };

  composeTableData = (data) => {
    let list = [];
    if (this.state.value === "free-text") {
      data.forEach((element, index) => {
        element.values.forEach((value) => {
          list.push({
            attributeName: value.metaDataAttributeName,
            attributeValue: value.value,
            documentId: element.documentId,
            documentName: element.documentName,
            latestVersion: element.latestVersion,
          });
        });
      });
    } else {
      data.forEach((element, index) => {
        let row = {
          documentId: element.documentId,
          documentName: element.documentName,
          latestVersion: element.latestVersion,
        };

        element.values.forEach((value) => {
          Object.defineProperty(row, value.metaDataAttributeName, {
            value: value.value,
            writable: true,
            enumerable: true,
            configurable: true,
          });
        });
        list.push(row);
      });
    }
    return list;
  };

  handleSendRequest = async () => {
    let list = [];
    let columns = [];

    let response = await postDataToAPI(
      this.state.search_url,
      this.state.request_payload
    );

    if (response.ok) {
      let data = await response.json();
      list = this.composeTableData(data);
      columns = this.composeTableColumns(this.props.action);
    }

    this.setState({
      search_url: "",
      request_payload: {},
      selectedAttributeNames: [],
    });

    this.props.getDocumentList(list, columns);
  };

  componentDidUpdate() {
    if (this.state.search_url !== "") {
      this.handleSendRequest();
    }
  }

  handleChange = (event) => {
    this.setState(
      { value: event.target.value },
      this.props.getDocumentList([])
    );
  };

  composeSearchRequest = (url, payload, selectedAttributeNames = []) => {
    if (payload !== null) {
      this.setState({
        search_url: url,
        request_payload: payload,
        selectedAttributeNames: selectedAttributeNames,
        openNotifiction: false,
        error: false,
        errorMessage: [],
      });
    } else {
      this.setState({
        search_url: url,
        request_payload: {},
        selectedAttributeNames: selectedAttributeNames,
        openNotifiction: false,
        error: false,
        errorMessage: [],
      });
    }
  };

  handleError = (error) => {
    this.setState({
      openNotifiction: error.openNotifiction,
      error: error.error,
      errorMessage: error.errorMessage,
    });
  };

  showFilter = () => {
    switch (this.state.value) {
      case "free-text":
        return (
          <SearchDocumentByFreeText
            composeSearchRequest={this.composeSearchRequest}
            handleError={this.handleError}
            modelId={this.props.modelId}
            setIdExclude={this.props.setIdExclude}
          />
        );

      case "value":
        return (
          <SearchDocumentByValue
            composeSearchRequest={this.composeSearchRequest}
            handleError={this.handleError}
            modelId={this.props.modelId}
            setIdExclude={this.props.setIdExclude}
          />
        );
      default:
        return "";
    }
  };

  setOpenNotification = (value) => {
    this.setState({ openNotifiction: value });
  };

  render() {
    //const { t } = this.props["t"];
    const { t } = this.props;
    return (
      <div>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <FormControl component="fieldset" margin="dense">
                    {t("tablecell_searchby")}
                    <RadioGroup
                      aria-label="gender"
                      name="gender1"
                      value={this.state.value}
                      onChange={this.handleChange}
                      row
                    >
                      <FormControlLabel
                        value="free-text"
                        control={<Radio />}
                        label={t("label_freetext")}
                      />
                      <FormControlLabel
                        value="value"
                        control={<Radio />}
                        label={t("label_value")}
                      />
                    </RadioGroup>
                  </FormControl>
                </TableCell>
                {/* <TableCell>{t("tablecell_searchfrom")}</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key="search-form">
                {/* <TableCell></TableCell> */}
                <TableCell>
                  {this.showFilter()}
                  <Notification
                    open={this.state.openNotifiction} // must be a "state" to show notification message [true or false]
                    setOpen={this.setOpenNotification} // this function changes the state "open" value.
                    error={this.state.error} // if error message put [true] else for success put [false]
                    errorMessage={this.state.errorMessage} // the recived error message (array of string) from server.
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default withTranslation()(SearchDocuments);
