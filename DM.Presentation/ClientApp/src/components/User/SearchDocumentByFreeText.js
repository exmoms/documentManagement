import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { fetchData } from "../../api/FetchData";
import StringValue from "./StringValue";
import styled from "styled-components";

class SearchDocumentByFreeText extends Component {
  constructor() {
    super();
    this.state = {
      model_id: -1,
      model_label: "",
      last_model_id: -1,
      model_list: [],
      class_id: -1,
      class_label: "",
      last_class_id: -1,
      class_list: [],
      text: "",
    };
  }

  componentDidMount() {
    fetchData("/api/MetaDataModel/GetMetaDataModelsIdName")
      .then((value) => {
        const data = value;
        const lista = [];
        data.forEach((item) =>
          lista.push({
            id: item.id,
            title: item.metaDataModelName,
            selected: false,
          })
        );
        this.setState({
          model_list: lista,
        });
      })
      .catch((e) => console.log(e));

    fetchData("/api/DocumentClass/")
      .then((value) => {
        const list = [];
        value.forEach((item) =>
          list.push({
            id: item.id,
            title: item.documentClassName,
            selected: false,
          })
        );
        this.setState({
          class_list: list,
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
          model_id: model.id,
          model_label: model.title,
          class_id: -1,
          class_label: "",
        });
      }
    }
  }

  handleModelChange = (value) => {
    if (typeof this.props.modelId === "undefined") {
      if (value !== null) {
        this.setState({
          model_id: value.id,
          model_label: value.title,
          class_id: -1,
          class_label: "",
        });
      } else {
        this.setState({
          class_id: -1,
          class_label: "",
          model_id: -1,
          model_label: "",
        });
      }
    }
  };

  handleClassChange = (value) => {
    if (value !== null) {
      this.setState({
        class_id: value.id,
        class_label: value.title,
        model_id: -1,
        model_label: "",
      });
    } else {
      this.setState({
        class_id: -1,
        class_label: "",
        model_id: -1,
        model_label: "",
      });
    }
  };

  handleChangeInput = (value) => {
    this.setState({ text: value });
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

  handleSearch = () => {
    let payload = {
      text: null,
      modelId: null,
      classId: null,
      setId: null,
      setIdExclude: null,
    };

    let api_url = "/api/document/SearchByFreeTxt";
    payload.text = this.state.text;

    let { model_id, class_id } = this.state;
    if (model_id !== -1) {
      payload.modelId = model_id;
    }
    if (class_id !== -1) {
      payload.classId = class_id;
    }

    if (this.props.setIdExclude !== undefined) {
      payload.setIdExclude = this.props.setIdExclude;
    }
    this.props.composeSearchRequest(api_url, payload);
  };

  render() {
    const model_id_exist = typeof this.props.modelId !== "undefined";
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
                label={t("createdocument_meatdatmodel")}
                variant="outlined"
              />
            )}
          />
        </InnerContainer>
        <InnerContainer>
          <Autocomplete
            id="combo-box-class-id"
            onChange={(event, value) => this.handleClassChange(value)}
            options={this.state.class_list}
            getOptionLabel={(option) => option.title}
            style={{ width: 300 }}
            value={{ title: this.state.class_label, id: this.state.class_id }}
            disabled={!!model_id_exist}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("label_documentclass")}
                variant="outlined"
              />
            )}
          />
        </InnerContainer>
        <InnerContainer>
          <StringValue
            label={t("label_textvalue")}
            handleValueChange={this.handleChangeInput}
          />
        </InnerContainer>
        <InnerContainer>
          <Button
            variant="contained"
            color="primary"
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

export default withTranslation()(SearchDocumentByFreeText);

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
