import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useTranslation } from "react-i18next";

function ComboBox(props) {
  // Convert Array of string to Array of Objects because "Autocomplete" component need array of object for "options" attribute,
  // otherwise gives errors.

  const { t } = useTranslation();

  return (
    <Autocomplete
      value={props.value.documentClassSelected}
      // defaultValue={props.value.documentClassSelected}
      onChange={props.onChange}
      id="combo-box-demo"
      options={props.options}
      getOptionLabel={(option) =>
        option.documentClassName !== window.undefined
          ? option.documentClassName
          : ""
      }
      renderInput={(params) => (
        <TextField
          error={
            props.value.documentClassSelected.id === window.undefined &&
            props.value.step_1_error === true
              ? true
              : false
          }
          helperText={
            props.value.documentClassSelected.id === window.undefined &&
            props.value.step_1_error === true
              ? t("fill_out_field")
              : ""
          }
          {...params}
          label={t("selectdocumentclass")}
          variant="outlined"
          fullWidth
        />
      )}
    />
  );
}

export default function AddressForm(props) {
  const onchange = (event, value) => {
    if (event.target.name === "modelName") {
      props.onSetModelName(event.target.value);
    }
  };

  const handelComboBox = (event, value) => {
    if (value) {
      props.onSetModelClassId(value.id);
      props.handeldocumentClassSelected(value);
    }
  };

  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom align="left">
        {t("documentmodel")}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            error={
              props.value.metaDataModelName === "" &&
              props.value.step_1_error === true
                ? true
                : false
            }
            helperText={
              props.value.metaDataModelName === "" &&
              props.value.step_1_error === true
                ? t("fill_out_field")
                : ""
            }
            required
            id="modelName"
            name="modelName"
            label={t("namelabel")}
            fullWidth
            autoComplete="off"
            value={props.value.metaDataModelName}
            onChange={onchange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ComboBox
            onChange={handelComboBox}
            options={props.value.DocumentClassList}
            value={{
              documentClassSelected: props.value.documentClassSelected,
              step_1_error: props.value.step_1_error,
            }}
            className="ComboBox"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
