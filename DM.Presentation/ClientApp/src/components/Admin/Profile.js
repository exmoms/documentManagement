/**
 * @file Contains Profile component implementaion
 * @author Youssef Shaaban <y.shaaban@lit-co.net>
 * @version 1.0
 */

import React, { Component } from "react";
import EditPassword from "./EditPassword";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LanguageMenu from "./LanguageMenu";
import { withTranslation } from "react-i18next";

class Profile extends Component {
  t = this.props["t"];
  render() {
    return (
      <div>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{this.t("select_langauge")}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <LanguageMenu />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>{this.t("change_my_password")}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <EditPassword />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default withTranslation()(Profile);
