/**
 * This function is responsible of parsing document data (from api/document/getDocumentVersionById?id={id}) into a form readable
 * By react-jsonschema-form library
 * @param {Object}  res : the document as json object
 * @param {Number} option : its value takes 0 for preview document, otherwise for update document
 * @return {Object} consist of four parts:
 *      1. schema: the schema of the form expected by react-jsonschema-form library
 *      2. ui_schema: the wedgit corresponding to each form field.
 *      3. form_data: the form fields data
 *      3. map:  maping attributeName and corresponding attributeId
 */

function parseDocumentDataToForm(res, option) {
  let schema = {
    title: "",
    type: "object",
    required: [],
    properties: {
      metadataModelName: { type: "string", title: "Metadata Model Name" },
      addedDate: { type: "string", title: " Document Added Date" },
      latestVersion: { type: "number", title: "Latest Version" },
      versionMessage: { type: "string", title: "Version Message" },
      documentVersionAddedDate: {
        type: "string",
        title: "Document Version Added Date",
      },
    },
  };

  let form_data = {
    metadataModelName: res.metadataModelName,
    addedDate: res.addedDate.substr(0, 10),
    latestVersion: res.latestVersion,
    versionMessage: res.documentVersion.versionMessage,
    documentVersionAddedDate: res.documentVersion.addedDate.substr(0, 10),
  };

  let ui_schema = {
    metadataModelName: {
      "ui:readonly": true,
    },
    addedDate: {
      "ui:readonly": true,
    },
    latestVersion: {
      "ui:readonly": true,
    },
    versionMessage: {
      "ui:readonly": true,
    },
    documentVersionAddedDate: {
      "ui:readonly": true,
    },
  };

  let map = [];
  schema.title = res.name;

  // if option is update we provide a required "Document Version" field.
  if (option === 1) {
    schema.required.push("documentVersion");
    Object.defineProperty(schema.properties, "documentVersion", {
      value: {
        type: "string",
        title: "New Version Message",
      },
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
  // loop over all metadata attributes in the documents
  res.documentVersion.values.forEach((element) => {
    map[element.attributeName] = element.attributeId;
    if (element.isRequired) {
      schema.required.push(element.attributeName);
    }
    const name = element.attributeName;

    // if the option = 0 then we should add readonly property to the ui_schema for this field..
    if (option === 0) {
      Object.defineProperty(ui_schema, name, {
        value: { "ui:readonly": true },
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }

    Object.defineProperty(schema.properties, name, {
      value: {
        type: "",
        title: name,
      },
      writable: true,
      enumerable: true,
      configurable: true,
    });

    switch (element.typeId) {
      case 1:
        schema.properties[name].type = "boolean";
        break;
      case 2:
        schema.properties[name].type = "string";
        if (ui_schema.hasOwnProperty(name)) {
          Object.defineProperty(ui_schema, name, {
            value: {
              "ui:widget": "date",
              "ui:readonly": true,
            },
            writable: true,
            enumerable: true,
            configurable: true,
          });
        } else {
          Object.defineProperty(ui_schema, name, {
            value: {
              "ui:widget": "date",
            },
            writable: true,
            enumerable: true,
            configurable: true,
          });
        }

        break;
      case 3:
      case 4:
      case 5:
        schema.properties[name].type = "number";
        break;
      case 6:
        schema.properties[name].type = "string";
        break;
      default:
      //@ todo: we should return error code to indecate unsupported types.
    }

    Object.defineProperty(form_data, name, {
      value: element.typeId !== 2 ? element.value : element.value.substr(0, 10),
      writable: true,
      enumerable: true,
      configurable: true,
    });
  });

  return { schema, ui_schema, form_data, map };
}

export default parseDocumentDataToForm;
