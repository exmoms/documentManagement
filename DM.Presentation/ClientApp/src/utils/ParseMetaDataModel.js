/**
 * This function is responsible of parsing metadata model data (from api/document/getDocumentVersionById?id={id}) into a form readable
 * By react-jsonschema-form library
 * @param {Object}  res : the metadata Model as json form
 * @return {Object} consist of three parts:
 *      1. json_schema: the schema of the form expected by react-jsonschema-form library
 *      2. ui_schema: the wedgit corresponding to each form field.
 *      3. map:  maping metaDataAttributeName and corresponding metaDataAttributeId
 */

function parseMetaDataModel(res) {
  let json_schema = {
    title: "",
    type: "object",
    required: [],
    properties: {},
  };

  let ui_schema = {};

  let map = [];
  json_schema.title = res.metaDataModelName;
  res.metaDataAttributes.forEach((element) => {
    map[element.metaDataAttributeName] = element.id;
    if (element.isRequired) {
      json_schema.required.push(element.metaDataAttributeName);
    }
    const name = element.metaDataAttributeName;
    Object.defineProperty(json_schema.properties, name, {
      value: {
        type: "",
        title: "",
        default: "",
      },
      writable: true,
      enumerable: true,
      configurable: true,
    });

    json_schema.properties[name].title = name;
    const type = element.dataTypeID;
    if (type === 6) {
      json_schema.properties[name].type = "string";
    } else if (type === 3 || type === 5 || type === 4) {
      json_schema.properties[name].type = "number";
    } else if (type === 1) {
      json_schema.properties[name].type = "boolean";
      json_schema.properties[name].default = false;
    } else if (type === 2) {
      json_schema.properties[name].type = "string";
      Object.defineProperty(ui_schema, name, {
        value: {
          "ui:widget": "date",
        },
        writable: true,
        enumerable: true,
        configurable: true,
      });
    } else {
      //@ todo: we should return error code to indecate unsupported types.
    }
  });
  return { json_schema, ui_schema, map };
}

export default parseMetaDataModel;
