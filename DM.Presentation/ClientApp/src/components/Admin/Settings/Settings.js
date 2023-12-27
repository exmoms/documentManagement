/**
 * @file Contains Settings component implementaion
 * @author Youssef Shaaban <y.shaaban@lit-co.net>
 * @version 1.0
 */

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { Component } from "react";
import ConfigEmail from "./ConfigEmail";
import SignUp from "./SingUp";
import UsersTable from "./UsersTable";
import { withTranslation } from "react-i18next";

const useStyles = (theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userTableNeedUpdate: false,
    };
  }

  componentDidUpdate() {
    if (this.state.userTableNeedUpdate) {
      this.setState({ userTableNeedUpdate: false });
    }
  }

  updateUserTable = (value) => {
    this.setState({ userTableNeedUpdate: value });
  };

  t = this.props["t"];
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              {this.t("add_new_user")}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <SignUp updateUserTable={this.updateUserTable} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography className={classes.heading}>
              {this.t("edit_user_profile")}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div style={{ margin: "auto" }}>
              <UsersTable
                userTableNeedUpdate={this.state.userTableNeedUpdate}
              />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography className={classes.heading}>
              {this.t("configure_email")}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <ConfigEmail />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Settings));
