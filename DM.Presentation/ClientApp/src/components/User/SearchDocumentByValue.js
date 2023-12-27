import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { fetchData } from "../../api/FetchData";
import SearchDocumentByValueType from "./SearchDocumentByValueType";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class SearchDocumentByValue extends Component {
  constructor() {
    super();
    this.state = {
      model_id: -1,
      model_label: "",
      last_model_id: -1,
      model_list: [],
      selected_attributes: [],
      attribute_list: [],
    };
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  componentDidMount() {
    fetchData("/api/MetaDataModel/GetMetaDataModelsIdName")
      .then((value) => {
        const data = value;
        const list = [];
        data.forEach((item) =>
          list.push({
            id: item.id,
            title: item.metaDataModelName,
            selected: false,
          })
        );
        this.setState({
          model_list: list,
        });
      })
      .catch((e) => console.log(e));
  }

  componentDidUpdate() {
    if (
      typeof this.props.modelId !== "undefined" &&
      this.state.model_id === -1
    ) {
      const model = this.state.model_list.find(
        (item) => this.props.modelId === item.id
      );
      if (typeof model !== "undefined") {
        this.setState({
          model_list: [model],
          model_label: model.title,
          model_id: model.id,
        });
      }
    } else if (this.state.last_model_id !== this.state.model_id) {
      fetchData(`/api/MetaDataModel/${this.state.model_id}`)
        .then((value) => {
          const data = value.metaDataAttributes;
          const list = [];
          data.forEach((item) =>
            list.push({
              id: item.id,
              title: item.metaDataAttributeName,
              data_type: item.dataTypeID,
              min_value: null,
              max_value: null,
            })
          );
          this.setState({
            attribute_list: list,
            model_id: value.id,
            last_model_id: value.id,
          });
        })
        .catch((e) => console.log(e));
    }
  }

  handleModelChange = (value) => {
    if (value !== null) {
      this.setState({
        model_id: value.id,
        model_label: value.title,
        selected_attributes: [],
        attribute_list: [],
      });
    } else {
      this.setState({
        model_id: -1,
        model_label: "",
        selected_attributes: [],
        attribute_list: [],
      });
    }
  };

  handleValueChange = (value, label, id) => {
    let selected_attributes = this.state.selected_attributes;
    switch (label) {
      case "min":
        selected_attributes.forEach((element, index) => {
          if (element.id === id) {
            element.min_value = value;
          }
        });
        break;
      case "max":
        selected_attributes.forEach((element, index) => {
          if (element.id === id) {
            element.max_value = value;
          }
        });
        break;
      case "value":
        selected_attributes.forEach((element, index) => {
          if (element.id === id) {
            element.min_value = value;
            element.max_value = value;
          }
        });
        break;
      default:
    }

    this.setState({
      selected_attributes: selected_attributes,
    });
  };

  addDefaultModel = (model_id) => {
    let result = { title: "", id: -1 };
    if (typeof model_id !== "undefined") {
      const model = this.state.model_list.find((item) => item.id === model_id);
      if (typeof model !== "undefined") {
        result.title = model.title;
        result.id = model.id;
      } else {
        // error message
        console.log("[ERROR] The Model is not found");
      }
    } else {
      result.title = this.state.model_label;
      result.id = this.state.model_id;
    }
    return result;
  };

  showSearchFields = () => {
    if (this.state.selected_attributes.length !== 0) {
      let search_fields = this.state.selected_attributes.map(
        (element, index) => (
          <div key={index} className="marginleft">
            <Typography variant="h6" color="inherit" noWrap align="center">
              {element.title}
            </Typography>
            <SearchDocumentByValueType
              dataType={element.data_type}
              attributeId={element.id}
              attributeName={element.title}
              minValue={element.min_value}
              maxValue={element.max_value}
              handleValueChange={this.handleValueChange}
            />
          </div>
        )
      );
      return search_fields;
    }
    return "";
  };

  handleAttributeChange = (event, child) => {
    let selected_list = this.state.selected_attributes;
    let length = event.target.value.length;
    if (length > selected_list.length) {
      selected_list.push(event.target.value[length - 1]);
    } else {
      let index = selected_list.findIndex(
        (element) => element.id === child.key
      );
      selected_list.splice(index, 1);
    }

    this.setState({
      selected_attributes: selected_list,
    });
  };

  rangeViolation = (element) => {
    if (element.max_value === null || element.min_value === null) {
      return true;
    } else {
      return element.max_value >= element.min_value;
    }
  };

  handleSearch = () => {
    const { t } = this.props;

    let payload = {
      setId: null,
      setIdExclude: null,
      values: [],
    };

    let selectedAttributeNames = [];

    let api_url = "/api/document/SearchByValue";

    let isRangeViolation = this.state.selected_attributes.every(
      this.rangeViolation
    );

    if (isRangeViolation) {
      this.state.selected_attributes.forEach((element) => {
        let max_value = element.max_value !== null ? element.max_value : null;
        if (element.min_value !== 0) {
          let payload_element = {
            TypeId: element.data_type,
            AttributeId: element.id,
            MinValue: element.min_value,
            MaxValue: max_value,
          };
          payload.values.push(payload_element);
          selectedAttributeNames.push(element.title);
        }
      });

      if (this.props.setIdExclude !== undefined) {
        payload.setIdExclude = this.props.setIdExclude;
      }

      this.props.composeSearchRequest(api_url, payload, selectedAttributeNames);
    } else {
      this.props.handleError({
        openNotifiction: true,
        error: true,
        errorMessage: [t("min_max_range_error")],
      });
    }
  };

  // t = this.props["t"];
  render() {
    const { t } = this.props;
    return (
      <Container>
        <InnerContainer>
          <Autocomplete
            id="combo-box-model-list"
            onChange={(event, value) => this.handleModelChange(value)}
            options={this.state.model_list}
            getOptionLabel={(option) => option.title}
            style={{ width: 300 }}
            value={this.addDefaultModel(this.props.modelId)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("metadata_model")}
                variant="outlined"
              />
            )}
          />
        </InnerContainer>
        <InnerContainer>
          <FormControl style={{ minWidth: 120, minHeight: 120 }}>
            <InputLabel id="demo-mutiple-chip-label">
              {t("attributes")}
            </InputLabel>
            <Select
              labelId="demo-mutiple-chip-label"
              id="demo-mutiple-chip"
              multiple
              value={this.state.selected_attributes}
              onChange={this.handleAttributeChange}
              input={<Input id="select-multiple-chip" />}
              renderValue={(selected) => (
                <div>
                  {this.state.selected_attributes.map((value) => (
                    <Chip key={value.id} label={value.title} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {this.state.attribute_list.map((name) => (
                <MenuItem key={name.id} value={name}>
                  {name.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </InnerContainer>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {this.showSearchFields()}
        </div>
        <InnerContainer>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={this.handleSearch}
            id="search-document-button"
          >
            {t("buttton_search")}
          </Button>
        </InnerContainer>
      </Container>
    );
  }
}

export default withTranslation()(SearchDocumentByValue);

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const InnerContainer = styled.div`
  marign-top: 20px;
  margin-bottom: 20px;
`;
