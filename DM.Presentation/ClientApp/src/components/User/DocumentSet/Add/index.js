/**
 * @file Contains Add component implementaion
 * @author Ali Daghman <ali.daghman@lit-co.net>
 * @version 1.0
 */

import React, { Fragment, Component } from "react";
import styled from "styled-components";
import AddToSetDialog from "./AddToSetDialog";
import AddDocumentToSet from "../AddDocumentToSet";
import AddExistingSetToSet from "../AddExistingSetToSet";
import CreateDocumentSet from "../CreateDocumentSet";
import { FOLDER, FILE } from "../utils/constants";

class Add extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      showAddDocument: false,
      showAddNewSet: false,
      showAddExistingSet: false,
    };
  }

  handleOpen = () => {
    this.setState({
      open: true,
      showAddDocument: false,
      showAddNewSet: false,
      showAddExistingSet: false,
    });
  };

  handleChoice = (type, isNew) => {
    if (type === FOLDER) {
      if (isNew) {
        this.setState({
          open: false,
          showAddNewSet: true,
          showAddDocument: false,
          showAddExistingSet: false,
        });
      } else {
        this.setState({
          open: false,
          showAddNewSet: false,
          showAddDocument: false,
          showAddExistingSet: true,
        });
      }
    } else if (type === FILE) {
      this.setState({
        open: false,
        showAddDocument: true,
        showAddNewSet: false,
      });
    } else {
      this.setState({
        open: false,
        showAddDocument: false,
        showAddNewSet: false,
        showAddExistingSet: false,
      });
    }
  };

  closeAddDocument = () => {
    this.setState({
      showAddDocument: false,
    });
  };

  closeAddNewSet = () => {
    this.setState({
      showAddNewSet: false,
    });
  };

  closeAddExistingSet = () => {
    this.setState({
      showAddExistingSet: false,
    });
  };

  render() {
    return (
      <Fragment>
        <Container onClick={() => this.handleOpen()}>+</Container>
        <AddToSetDialog
          set={this.props.set}
          show={this.state.open}
          action={this.handleChoice}
        />

        {this.state.showAddDocument && (
          <AddDocumentToSet
            set={this.props.set}
            show={this.state.showAddDocument}
            action={this.closeAddDocument}
          />
        )}

        {this.state.showAddExistingSet && (
          <AddExistingSetToSet
            set={this.props.set}
            show={this.state.showAddExistingSet}
            action={this.closeAddExistingSet}
          />
        )}

        {this.state.showAddNewSet && (
          <CreateDocumentSet
            set={this.props.set}
            show={this.state.showAddNewSet}
            action={this.closeAddNewSet}
          />
        )}
      </Fragment>
    );
  }
}

export default Add;

const Container = styled.div`
  height: 109px;
  width: 96px;
  border: 3px dashed #dee0e4;
  display: flex;
  justify-content: center;
  border-radius: 8px;
  align-items: center;
  font-size: 30px;
  color: #dee0e4;
  margin: -6px 21px;
  cursor: copy;
`;
