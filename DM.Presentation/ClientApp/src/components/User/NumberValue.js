import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { withTranslation } from "react-i18next";

class NumberValue extends Component {
  constructor(props) {
    super(props);
    this.state = { value: 0 };
    this.handleValueChange = this.props.handleValueChange;
  }

  t = this.props["t"];

  handleChange = (event) => {
    let value = parseInt(event.target.value);
    this.setState(
      { value: value },
      this.handleValueChange(value, this.props.label)
    );
  };

  render() {
    return (
      <div>
        <TextField
          id={this.props.label}
          label={this.t(this.props.label)}
          type="number"
          onChange={this.handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
    );
  }
}

export default withTranslation()(NumberValue);
