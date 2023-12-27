import React, { Component } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

class BoolValue extends Component {
  constructor(props) {
    super(props);
    this.state = { value: false };
    this.handleValueChange = this.props.handleValueChange;
  }

  handleChange = (event, checked) => {
    this.setState(
      { value: checked },
      this.handleValueChange(checked, this.props.label)
    );
  };

  render() {
    console.log("check", this.state.value);
    return (
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.value}
              onChange={this.handleChange}
              value="primary"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          }
          label={this.props.attributeName}
        />
      </div>
    );
  }
}

export default BoolValue;
