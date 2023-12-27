import { createBrowserHistory } from "history";
import React from "react";
import { withTranslation } from "react-i18next";
import styled from "styled-components";
import { fetchData } from "../../../api/FetchData";
import Add from "./Add";
import Icon from "./Icon";
import { FILE, FOLDER } from "./utils/constants";
import { Notification } from "../../Admin/Notifications";

class Explorer extends React.Component {
  constructor(props) {
    super(props);
    this.t = this.props["t"];
    this.state = {
      rootSetsList: [
        // {
        //   id: "",
        //   addedDate: "",
        //   modifiedDate: "",
        //   name: "",
        //   attachedDocuments: [],
        //   childrenDocumentSets: []
        // }
      ], //fetch from Api this refer to the documents sets
      content: [{ id: 0, name: this.t("path_Home") }], //the pat
      attachedDocuments: [
        // {
        //   id: "",
        //   documentName: "",
        //   metadataModelId: "",
        //   metadataModelName: "",
        //   addedDate: "",
        //   deletedDate: "",
        //   modifiedDate: "",
        //   latestVersion: "",
        //   documentVersion: "",
        //   attachments: ""
        // }
      ], //to show the documents inside set
      childrenDocumentSets: [
        // {
        //   id: "",
        //   addedDate: "",
        //   modifiedDate: "",
        //   name: "",
        //   attachedDocuments: "",
        //   childrenDocumentSets: ""
        // }
      ], //to show the documentsets inside set
      documentSet: { id: 0, name: "Home" },
      openNotifiction: false,
      error: false,
      errorMessage: [],
    };
  }

  componentDidMount() {
    fetchData("/api/DocumentSet/GetRoots").then((value) => {
      this.setState({
        rootSetsList: value,
      });
    });
  }

  componentDidUpdate() {
    const history = createBrowserHistory();
    if (history.location.state && history.location.state.name) {
      let state = { ...history.location.state };
      if (state.id === 0) {
        fetchData("/api/DocumentSet/GetRoots").then((value) => {
          this.setState(
            {
              rootSetsList: value,
              content: [{ id: 0, name: "Home" }],
              attachedDocuments: [],
              documentSet: { id: 0, name: "Home" },
              openNotifiction: state.openNotifiction,
              error: state.error,
              errorMessage: state.errorMessage,
            },
            () => {
              delete state.id;
              delete state.name;
              history.replace({ ...history.location, state });
            }
          );
        });
      } else {
        fetchData(
          `/api/DocumentSet/GetDocumentSetByID?document_set_id=${state.id}`
        ).then((value) => {
          this.setState(
            {
              rootSetsList: [],
              attachedDocuments: value.attachedDocuments,
              childrenDocumentSets: value.childrenDocumentSets,
              documentSet: {
                id: state.id,
                name: state.name,
              },
              openNotifiction: state.openNotifiction,
              error: state.error,
              errorMessage: state.errorMessage,
            },
            () => {
              delete state.id;
              delete state.name;
              history.replace({ ...history.location, state });
            }
          );
        });
      }
    }
  }

  refreshDocumentSet = (set) => {
    if (set.id === 0) {
      fetchData("/api/DocumentSet/GetRoots").then((value) => {
        this.setState({
          rootSetsList: value,
          content: [{ id: 0, name: "Home" }],
          attachedDocuments: [],
          documentSet: { id: 0, name: "Home" },
          openNotifiction: true,
        });
      });
    } else {
      fetchData(
        `/api/DocumentSet/GetDocumentSetByID?document_set_id=${set.id}`
      ).then((value) => {
        this.setState({
          rootSetsList: [],
          attachedDocuments: value.attachedDocuments,
          childrenDocumentSets: value.childrenDocumentSets,
          documentSet: {
            id: set.id,
            name: set.name,
          },
          openNotifiction: true,
        });
      });
    }
  };

  //show the content of a set
  showMore = (id, name) => {
    fetchData(`/api/DocumentSet/GetDocumentSetByID?document_set_id=${id}`).then(
      (value) => {
        this.setState({
          content: [...this.state.content, { id: id, name: name }],
          rootSetsList: [],
          attachedDocuments: value.attachedDocuments,
          childrenDocumentSets: value.childrenDocumentSets,
          documentSet: { id: id, name: name },
          openNotifiction: false,
          error: false,
          errorMessage: [],
        });
      }
    );
  };

  // History Methods to show the path
  goToUpperLevel = (item) => {
    const index = this.state.content.findIndex((level) => level.id === item.id);
    const history = this.state.content.slice(0, index + 1);
    if (index >= 1) {
      fetchData(
        `/api/DocumentSet/GetDocumentSetByID?document_set_id=${item.id}`
      ).then((value) => {
        this.setState({
          content: history,
          rootSetsList: [],
          attachedDocuments: value.attachedDocuments,
          childrenDocumentSets: value.childrenDocumentSets,
          documentSet: { id: value.id, name: value.name },
          openNotifiction: false,
          error: false,
          errorMessage: [],
        });
      });
    } else {
      fetchData("/api/DocumentSet/GetRoots").then((value) => {
        this.setState({
          content: history,
          rootSetsList: value,
          attachedDocuments: [],
          childrenDocumentSets: [],
          documentSet: { id: 0, name: "Home" },
          openNotifiction: false,
          error: false,
          errorMessage: [],
        });
      });
    }
  };

  showNotification = (openNotifiction, error, errorMessage) => {
    this.setState({
      openNotifiction: openNotifiction,
      error: error,
      errorMessage: errorMessage,
    });
  };

  setOpenNotification = (value) => {
    this.setState({ openNotifiction: value });
  };

  t = this.props["t"];

  render() {
    let { documentSet } = this.state;
    let sets =
      documentSet.id === 0
        ? this.state.rootSetsList
        : this.state.childrenDocumentSets;
    let documents = this.state.attachedDocuments;

    return (
      <React.Fragment>
        <PathContainer>
          {/* Show path */}
          {this.state.content.map((item, index) => (
            <span key={index} onClick={() => this.goToUpperLevel(item)} id="goToUpperLevelId">
              {item.name} {" / "}
            </span>
          ))}
        </PathContainer>
        <Notification
        id="notification"
          open={this.state.openNotifiction} // must be a "state" to show notification message [true or false]
          setOpen={this.setOpenNotification} // this function changes the state "open" value.
          error={this.state.error} // if error message put [true] else for success put [false]
          errorMessage={this.state.errorMessage} // the recived error message (array of string) from server.
        />
        <Container>
          {sets.map((item, index) => (
            <Icon
              entry={item}
              index={index}
              key={index}
              type={FOLDER}
              set={documentSet}
              enterFolder={this.showMore}
              refreshSet={this.refreshDocumentSet}
              showNotification={this.showNotification}
            />
          ))}
          {documents.map((item, index) => (
            <Icon
              entry={item}
              index={index}
              key={index}
              type={FILE}
              set={documentSet}
              refreshSet={this.refreshDocumentSet}
              showNotification={this.showNotification}
            />
          ))}
          <Add set={documentSet} />
        </Container>
      </React.Fragment>
    );
  }
}

export default withTranslation()(Explorer);

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 20px 40px 20px 40px;
`;

const PathContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 5px;
  padding-left: 5px;
  padding-right: 5px;
  border-style: solid;
  border-color: #3f51b5;
  border-width: 1px;
  border-radius: 7px;
`;
