/**
 * @file Contains AddExistingSetToSet component implementaion
 * @author Ali Daghman <ali.daghman@lit-co.net>
 * @version 1.0
 */

import React, { Component, Fragment } from "react";
import { fetchData } from "../../../api/FetchData";
import { Redirect } from "react-router";
import { postDataToAPI } from "../../../api/PostData";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import AddIcon from "@material-ui/icons/Add";
import { blue } from "@material-ui/core/colors";

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
};

class AddExistingSetToSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setId: 0,
      setsList: [],
      redirectToDocumentSet: false,
      openNotifiction: false,
      error: false,
      errorMessage: [],
    };
    this.updateParentState = this.props.action;
  }

  async componentDidMount() {
    // if (this.props.set.id !== this.state.setId && this.props.set.id !== 0) {
    let id = this.props.set.id;
    let url = `/api/DocumentSet/GetAllSetsExcludingSetsOfSet?Parent_documentSet_Id=${id}`;
    await fetchData(url)
      .then((value) => {
        this.setState({ setId: id, setsList: value });
      })
      .catch((e) => console.log(e));
    // }
  }

  componentDidUpdate() {
    if (this.state.redirectToDocumentSet) {
      this.setState(
        {
          redirectToDocumentSet: false,
        },
        this.handleClose()
      );
    }
  }

  addSetToSet = async (childSetId) => {
    let ParentSetId = this.props.set.id;

    let response = await postDataToAPI(
      `/api/DocumentSet/AddDocumentSetToDocumentSet?Parent_documentSet_Id=${ParentSetId}&child_documentSet_Id=${childSetId}`
    );

    if (response.ok) {
      this.setState(
        {
          redirectToDocumentSet: true,
          openNotifiction: true,
        } //,
        // this.handleClose()
      );
    } else {
      let json = await response.json();
      this.setState(
        {
          redirectToDocumentSet: true,
          name: "",
          openNotifiction: true,
          error: true,
          errorMessage: json.error,
        } //,
        //this.handleClose()
      );
    }
  };

  handleClose = () => {
    this.setState(
      {
        setId: 0,
        setsList: [],
        redirectToDocumentSet: false,
      },
      () => {
        this.updateParentState();
      }
    );
  };

  t = this.props["t"];

  render() {
    const { classes, show } = this.props;
    const { setsList } = this.state;
    let lang = localStorage.getItem("i18nextLng");
    return (
      <Fragment>
        <Dialog
          onClose={this.handleClose}
          aria-labelledby="simple-dialog-title"
          open={show}
          maxWidth={"xs"}
        >
          <div
            style={
              lang === "ar" ? { textAlign: "right" } : { textAlign: "left" }
            }
          >
            <DialogTitle id="simple-dialog-title">
              {this.t("documentset_addDocumentSetToSet_title")}
            </DialogTitle>
          </div>
          {setsList.length > 0 ? (
            <List>
              {setsList.map((set, index) => {
                return (
                  <ListItem
                    key={index}
                    button
                    onClick={() => this.addSetToSet(set.id)}
                  >
                    <ListItemAvatar>
                      <Avatar className={classes.avatar}>
                        <AddIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={set.name} />
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <List>
              <ListItem button onClick={() => this.handleClose()}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <AddIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={this.t("documentset_noSetFound")} />
              </ListItem>
            </List>
          )}
        </Dialog>
        {this.state.redirectToDocumentSet && (
          <Redirect
            to={{
              pathname: "/document-set",
              state: {
                id: this.props.set.id,
                name: this.props.set.name,
                openNotifiction: this.state.openNotifiction,
                error: this.state.error,
                errorMessage: this.state.errorMessage,
              },
            }}
          />
        )}
      </Fragment>
    );
  }
}

export default withStyles(styles)(withTranslation()(AddExistingSetToSet));
