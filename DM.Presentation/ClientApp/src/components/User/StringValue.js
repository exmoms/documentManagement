import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { withTranslation } from "react-i18next";

class StringValue extends Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
    this.handleValueChange = this.props.handleValueChange;
  }

  t = this.props["t"];

  handleChange = (event) => {
    let value = event.target.value;
    this.setState(
      { text: value },
      this.handleValueChange(value, this.props.label)
    );
  };

  render() {
    return (
      <div>
        <TextField
          id={this.props.label}
          label={this.t(this.props.label)}
          variant="outlined"
          onChange={this.handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
    );
  }
}

export default withTranslation()(StringValue);
