/**
 * @file Contains BrowseAggregatedDocsPopUp component implementaion
 * @author Youssef Shaaban <y.shaaban@lit-co.net>
 * @version 1.0
 */

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { fetchData } from "../../../api/FetchData";
import { postDataToAPI } from "../../../api/PostData";
import { Notification } from "../Notifications";
import EditUserProfileByAdmin from "./EditUserProfileByAdmin";

const styles = (theme) => ({
  paper: {
    maxWidth: "auto",
  },
  margin: {
    margin: theme.spacing(2),
  },
});

class EditProfilePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      userProfile: null,
      errors: {
        confirmErrors: "",
        newPasswordErrors: "",
        submissionErrors: "",
      },
      showSuccess: false,
    };
    this.updateParentState = this.props.action;
  }
  t = this.props["t"];

  componentDidUpdate(prevProps) {
    if (prevProps.user.userId !== this.props.user.userId) {
      fetchData(`/api/user/${this.props.user.userId}`).then((profileData) => {
        this.setState({ userProfile: profileData });
      });
    }
  }

  toggleShow = (show) => {
    this.updateParentState(show);
  };

  handelSubmit = (event) => {
    event.preventDefault();
    let email = document.getElementById("edit-profile-by-admin-email").value;
    let tel = document.getElementById("edit-profile-by-admin-tel").value;
    let newPassword = document.getElementById(
      "edit-profile-by-admin-outlined-adornment-password"
    ).value;
    let confirmPassword = document.getElementById(
      "edit-profile-by-admin-confirmPassword"
    ).value;
    let validPassword = false;
    if (newPassword === "") {
      validPassword = newPassword === confirmPassword;
    } else {
      validPassword =
        newPassword === confirmPassword &&
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w]).{8,}$/i.test(newPassword);
    }

    if (validPassword) {
      const formData = {
        userId: this.props.user.userId,
        email: email,
        phoneNumber: tel,
        NewPassword: newPassword,
        ConfirmPassword: confirmPassword,
      };
      postDataToAPI("/api/user/EditUserProfileByAdmin", formData)
        .then(
          (res) => {
            if (res.ok) {
              this.setState({
                errors: {
                  confirmErrors: "",
                  newPasswordErrors: "",
                  submissionErrors: "",
                },
                showSuccess: true,
              });
            }
            return res.json();
          },
          (error) => console.log(error)
        )
        .then(
          (data) => {
            this.setState({
              errors: {
                confirmErrors: "",
                newPasswordErrors: "",
                submissionErrors: data.error,
              },
              showSuccess: true,
            });
          },
          (error) => console.log(error)
        );

      this.toggleShow(false);
    } else {
      this.setState({
        errors: {
          confirmErrors:
            newPassword === confirmPassword
              ? ""
              : this.t("password_mismatchingWithComfirm"),
          newPasswordErrors: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w]).{8,}$/i.test(
            newPassword
          )
            ? ""
            : this.t("password_formateError"),
        },
      });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          position="centerCenter"
          open={this.props.show}
          onClose={() => this.toggleShow(false)}
          aria-labelledby="form-dialog-title"
          className={classes.paper}
        >
          <DialogTitle id="form-dialog-title">
            <Typography variant="h6" gutterBottom align="left">
              {this.t("edit_user_profile")} : {this.props.user.userName}
            </Typography>
          </DialogTitle>
          <form
            className={classes.form}
            id="edit-profile-form"
            onSubmit={this.handelSubmit}
          >
            <DialogContent>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableBody>
                    <TableRow key="search-form">
                      <TableCell>
                        <EditUserProfileByAdmin
                          profileData={this.state.userProfile}
                          errors={this.state.errors}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button
                id="submit-btn"
                type="submit"
                // variant="contained"
                color="primary"
                className={classes.submit}
              >
                {this.t("submit_changes")}
              </Button>
              <Button
                id="CancelButton"
                onClick={() => this.toggleShow(false)}
                color="primary"
              >
                {this.t("button_cancel")}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <Notification
          id="notification"
          open={this.state.showSuccess}
          setOpen={(show) => this.setState({ showSuccess: show })}
          error={!!this.state.errors.submissionErrors}
          errorMessage={this.state.errors.submissionErrors}
        />
      </div>
    );
  }
}

export default withStyles(styles)(withTranslation()(EditProfilePopup));
