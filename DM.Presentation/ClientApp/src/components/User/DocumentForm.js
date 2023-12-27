import React, { Component } from "react";
import Form from "react-jsonschema-form";
import "bootstrap/dist/css/bootstrap.css";

class DocumentForm extends Component {
  render() {
    const schema = this.props.schema;

    const log = (type) => console.log.bind(console, type);
    // Show the form only if the returned json is not empty
    const renderForm = () => {
      const isEmptySchema =
        Object.entries(schema).length === 0 && schema.constructor === Object;
      if (!isEmptySchema) {
        return (
          <Form
            schema={schema}
            uiSchema={this.props.uiSchema}
            formData={this.props.formData}
            onSubmit={this.props.onSubmit}
            onChange={({ formData }) => this.props.onChange(formData)}
            onError={log("errors")}
            id={this.props.id}
          >
            <br />
          </Form>
        );
      }
    };

    return <div>{renderForm()}</div>;
  }
}

export default DocumentForm;
