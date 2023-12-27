import React, { Component } from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { withTranslation } from "react-i18next";

class DateValue extends Component {
  constructor(props) {
    super(props);
    this.state = { date: null };
    this.handleValueChange = this.props.handleValueChange;
  }

  t = this.props["t"];

  handleChange = (date, value) => {
    this.setState(
      { date: date },
      this.handleValueChange(date, this.props.label)
    );
  };

  render() {
    return (
      <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin="normal"
            id={this.props.label}
            label={this.t(this.props.label)}
            format="MM/dd/yyyy"
            value={this.state.date}
            onChange={this.handleChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}

export default withTranslation()(DateValue);
