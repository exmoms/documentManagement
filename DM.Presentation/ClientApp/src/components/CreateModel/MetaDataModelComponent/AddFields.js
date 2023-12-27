import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import { useTranslation } from "react-i18next";
function ComboBox(props) {
  const { t } = useTranslation();

  var name;
  switch (props.value.dataTypeID) {
    case 1: {
      name = t("booltype");
      break;
    }
    case 2: {
      name = t("datetype");
      break;
    }
    case 3: {
      name = t("decimal");
      break;
    }
    case 4: {
      name = t("double");
      break;
    }
    case 5: {
      name = t("int");
      break;
    }
    case 6: {
      name = t("string");
      break;
    }
    default:
      name = "";
  }

  var types = { id: props.value.dataTypeID, name: name };

  return (
    <Autocomplete
      value={types}
      onChange={props.onChange}
      options={props.options}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          error={
            types.name === "" && props.value.step_3_error === true
              ? true
              : false
          }
          helperText={
            types.name === "" && props.value.step_3_error === true
              ? t("fill_out_field")
              : ""
          }
          {...params}
          label={t("selecttype")}
          variant="outlined"
          fullWidth
        />
      )}
    />
  );
}

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: "700",
  },
  title: {
    marginTop: theme.spacing(2),
  },
  textAlign: {
    textAlign: "initial",
  },
}));

export default function AddFields(props) {
  const classes = useStyles();

  // addAttribute function Adds new field for Model-------------------------
  const addAttribute = () => {
    var metaDataAttribute = [...props.value.metaDataAttribute];
    metaDataAttribute.push({
      metaDataAttributeName: "",
      isRequired: false,
      dataTypeID: "",
    });
    props.handelmetaDataAttribute(metaDataAttribute);
  };
  // End----------------------------------

  // RemoveAttribute function remove specific field for Model-------------------------
  const RemoveAttribute = (index) => {
    var metaDataAttribute = [...props.value.metaDataAttribute];
    metaDataAttribute.splice(index, 1);
    console.log(index);
    props.handelmetaDataAttribute(metaDataAttribute);
  };
  // End----------------------------------

  // handel Changes ------------------------------
  const handleChange = (event) => {
    var index = event.target.dataset.id;
    // console.log(index);
    let metaDataAttribute = [...props.value.metaDataAttribute];
    if (event.target.name === "metaDataAttribute" + index + "Name") {
      metaDataAttribute[index].metaDataAttributeName = event.target.value;
    } else if (event.target.name === "isRequired" + { index }) {
      metaDataAttribute[index].isRequired = event.target.checked;
    }
    props.handelmetaDataAttribute(metaDataAttribute);
  };
  // ------------------------------

  // handwl comboBox ----------------------------------
  const handelComboBox = (index, event, value) => {
    if (value) {
      let metaDataAttribute = [...props.value.metaDataAttribute];
      metaDataAttribute[index].dataTypeID = value.id;
      props.handelmetaDataAttribute(metaDataAttribute);
    }
  };
  // --------------------------------------------------
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/*  Show list of attributes*/}
          {props.value.metaDataAttribute.map((item, index) => (
            <div key={index} className="marginleft">
              <Typography variant="h6" color="inherit" noWrap align="left">
                {t("attribute")} {index + 1}:
              </Typography>
              <TextField
                error={
                  item.metaDataAttributeName === "" &&
                  props.value.step_3_error === true
                    ? true
                    : false
                }
                helperText={
                  item.metaDataAttributeName === "" &&
                  props.value.step_3_error === true
                    ? t("fill_out_field")
                    : ""
                }
                required
                name={"metaDataAttribute" + index + "Name"}
                inputProps={{ "data-id": index }}
                value={item.metaDataAttributeName}
                type="text"
                onChange={handleChange}
                label=/*"Attribute Name"*/ {t("attributename")}
                // helperText="choose name"
                fullWidth
                className={"NameField" + index}
              />

              {/* <label>Required: </label> */}
              <Grid item xs={12} className={classes.textAlign}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="secondary"
                      name={"isRequired" + { index }}
                      inputProps={{ "data-id": index }}
                      value={item.isRequired}
                      checked={item.isRequired === true}
                      onChange={handleChange}
                      className={"CheckBox" + index}
                    />
                  }
                  label=/*"Is Required"*/ {t("isrequired")}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ComboBox
                  id={index}
                  onChange={(event, value) =>
                    handelComboBox(index, event, value)
                  }
                  options={props.value.dateTypes}
                  value={{
                    dataTypeID: item.dataTypeID,
                    step_3_error: props.value.step_3_error,
                  }}
                  className={"ComboBox" + index}
                />
              </Grid>
              <br />
              <Grid className={classes.textAlign}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={() => RemoveAttribute(index)}
                  className={classes.button}
                  id="removeAttribute"
                >
                  {/* Remove */}
                  {t("remove")}
                </Button>
              </Grid>
              <br />
              <br />
            </div>
          ))}
          {/* ----------------------------------- */}
        </Grid>

        <Grid item xs={12} className={classes.textAlign}>
          <Button
            variant="contained"
            onClick={addAttribute}
            id="addAttribute"
            startIcon={<AddIcon />}
            className={classes.button}
          >
            {/* Add new Attribute */}
            {t("addnewattribute")}
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
