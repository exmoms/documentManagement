/**
 * @file Contains EditRolePopup component implementaion
 * @author Ali Daghman <ali.daghman@lit-co.net>
 * @version 1.0
 */

import {
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { postDataToAPI } from "../../../api/PostData";
import { Notification } from "../Notifications";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 400,
    },
  },
};

const styles = (theme) => ({
  paper: {
    maxWidth: "auto",
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  margin: {
    margin: theme.spacing(2),
  },
});

class EditRolePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.user.userId,
      selectedRole: "",
      currentRole: "",
      availableRoles: ["Admin", "User"],
      error: false,
      errorMessage: [],
      showSuccess: false,
    };
    this.updateParentState = this.props.action;
  }
  t = this.props["t"];

  componentDidUpdate(prevProps) {
    if (
      prevProps.user.userId !== this.props.user.userId ||
      JSON.stringify(prevProps.user.roles) !==
        JSON.stringify(this.props.user.roles)
    ) {
      this.setState({
        userId: this.props.user.userId,
        selectedRole: this.props.user.roles[0],
        currentRole: this.props.user.roles[0],
      });
    }
  }

  toggleShow = (show, flag) => {
    this.updateParentState(show, flag);
  };

  handleChange = (event) => {
    this.setState({ selectedRole: event.target.value });
  };

  handelSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      userId: this.props.user.userId,
      AssignedRoles: [],
      UnassignedRoles: [],
    };

    if (this.state.currentRole !== this.state.selectedRole) {
      formData.AssignedRoles.push(this.state.selectedRole);
      formData.UnassignedRoles.push(this.state.currentRole);
    }

    let response = await postDataToAPI("/api/user/EditUserRoles", formData);
    if (response.ok) {
      this.setState({ showSuccess: true });
    } else {
      let json = await response.json();
      this.setState({
        showSuccess: true,
        error: true,
        errorMessage: json.errorMessage,
      });
    }
    this.toggleShow(false, response.ok);
  };

  render() {
    const { classes } = this.props;
    let lang = localStorage.getItem("i18nextLng");
    return (
      <div>
        <Dialog
          position="centerCenter"
          open={this.props.show}
          onClose={() => this.toggleShow(false, false)}
          aria-labelledby="form-dialog-title"
          className={classes.paper}
        >
          <div
            style={
              lang === "ar" ? { textAlign: "right" } : { textAlign: "left" }
            }
          >
            <DialogTitle id="form-dialog-title">
              {this.t("edit_user_role")} : {this.props.user.userName}
            </DialogTitle>
          </div>

          <DialogContent>
            <div className={classes.paper}>
              <FormControl style={{ minWidth: 400, minHeight: 120 }}>
                <InputLabel id="demo-mutiple-chip-label">
                  {this.t("role_label")}
                </InputLabel>
                <Select
                  labelId="demo-mutiple-chip-label"
                  id="demo-mutiple-chip"
                  autoWidth
                  value={this.state.selectedRole}
                  onChange={this.handleChange}
                  input={<Input id="select-multiple-chip" />}
                  MenuProps={MenuProps}
                >
                  {this.state.availableRoles.map((name, index) => (
                    <MenuItem key={index} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              id="submit-btn"
              onClick={this.handelSubmit}
              color="primary"
              className={classes.submit}
            >
              {this.t("submit_changes")}
            </Button>
            <Button
              id="CancelButton"
              onClick={() => this.toggleShow(false, false)}
              color="primary"
            >
              {this.t("button_cancel")}
            </Button>
          </DialogActions>
        </Dialog>
        <Notification
          id="notification"
          open={this.state.showSuccess}
          setOpen={(show) => this.setState({ showSuccess: show })}
          error={!!this.state.error}
          errorMessage={this.state.errorMessage}
        />
      </div>
    );
  }
}

export default withStyles(styles)(withTranslation()(EditRolePopup));
