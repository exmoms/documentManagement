import React, { Component } from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import DateValue from "./DateValue";
import BoolValue from "./BoolValue";
import NumberValue from "./NumberValue";
import StringValue from "./StringValue";
import { withTranslation } from "react-i18next";

class SearchDocumentByValueType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_option: "",
    };
  }
  t = this.props["t"];
  componentDidUpdate() {
    if (
      this.state.selected_option !== "" &&
      (this.props.dataType === 1 || this.props.dataType === 6)
    ) {
      this.setState({ selected_option: "" });
    }
  }

  handleOptionChange = (event, value) => {
    console.log(value);
    this.setState({ selected_option: value });
  };

  handleValueChange = (value, label) => {
    switch (label) {
      case "min":
        this.props.handleValueChange(value, label, this.props.attributeId);
        break;
      case "max":
        this.props.handleValueChange(value, label, this.props.attributeId);
        break;
      case "value":
        this.props.handleValueChange(value, label, this.props.attributeId);
        break;
      default:
    }
  };

  showFieldAccordingToDataType = (data_type, label) => {
    switch (data_type) {
      case 1:
        return (
          <BoolValue
            label={label}
            handleValueChange={this.handleValueChange}
            attributeName={this.props.attributeName}
          />
        );
      case 2:
        return (
          <DateValue
            label={label}
            handleValueChange={this.handleValueChange}
            attributeName={this.props.attributeName}
          />
        );
      case 3:
      case 4:
      case 5:
        return (
          <NumberValue
            label={label}
            handleValueChange={this.handleValueChange}
            attributeName={this.props.attributeName}
          />
        );
      case 6:
        return (
          <StringValue
            label={label}
            handleValueChange={this.handleValueChange}
            attributeName={this.props.attributeName}
          />
        );
      default:
        // @todo: we should return an error message to indicate that the data type is invalid.
        return "";
    }
  };

  showFilter = () => {
    switch (this.state.selected_option) {
      case "value":
        return (
          <form noValidate autoComplete="off">
            {this.showFieldAccordingToDataType(this.props.dataType, "value")}
          </form>
        );

      case "min-max":
        return (
          <form noValidate autoComplete="off">
            {this.showFieldAccordingToDataType(this.props.dataType, "min")}
            {this.showFieldAccordingToDataType(this.props.dataType, "max")}
          </form>
        );
      default:
        return "";
    }
  };

  showSearchOption = (data_type) => {
    switch (data_type) {
      case 1:
      case 6:
        return (
          <form noValidate autoComplete="off">
            {this.showFieldAccordingToDataType(this.props.dataType, "value")}
          </form>
        );

      case 2:
      case 3:
      case 4:
      case 5:
        return (
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="gender"
              name="search"
              value={this.state.selected_option}
              onChange={this.handleOptionChange}
              row
            >
              <FormControlLabel
                value="value"
                control={<Radio />}
                label={this.t("label_specificvalue")}
              />
              <FormControlLabel
                value="min-max"
                control={<Radio />}
                label={this.t("label_range")}
              />
            </RadioGroup>
          </FormControl>
        );

      default:
        return "";
    }
  };
  render() {
    return (
      <div>
        {this.showSearchOption(this.props.dataType)}
        {this.showFilter()}
      </div>
    );
  }
}

export default withTranslation()(SearchDocumentByValueType);
