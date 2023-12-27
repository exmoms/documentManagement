import React from "react";
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
import { makeStyles } from "@material-ui/core";

function CheckboxesTags(props) {
  var value = props.selectedMetaDataModels[props.index];

  if (!value) {
    value = { metaDataModelId: "", metaDataModelName: "" };
  }

  const { t } = useTranslation();
  return (
    <div>
      <Autocomplete
        name={"metaDataModels" + props.index}
        id={"modelName" + props.index}
        value={value}
        onChange={props.onChange}
        options={props.value.MetaDataModels}
        getOptionLabel={(option) =>
          option.metaDataModelName !== window.undefined
            ? option.metaDataModelName
            : ""
        }
        renderInput={(params) => (
          <TextField
            error={
              (value.metaDataModelId === "" ||
                value.metaDataModelId === window.undefined) &&
              props.value.step_2_error === true
                ? true
                : false
            }
            helperText={
              (value.metaDataModelId === "" ||
                value.metaDataModelId === window.undefined) &&
              props.value.step_2_error === true
                ? t("fill_out_field")
                : ""
            }
            {...params}
            label={t("selectmodel")}
            variant="outlined"
            fullWidth
          />
        )}
      />
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  textAlign: {
    textAlign: "initial",
  },
}));

export default function ModelAttachments(props) {
  const handleChange = (event) => {
    if (event.target.name === "isCompound") {
      props.handelisCompound(event.target.checked);
    } else if (event.target.name === "isAggregated") {
      props.handelisAggregated(event.target.checked);
    } else {
      var index = event.target.dataset.id;
      let compoundModels = [...props.value.compoundModels];

      if (event.target.name === "isRequired" + { index }) {
        compoundModels[index].isRequired = event.target.checked;
        props.handelcompoundModels(compoundModels);
      } else if (event.target.name === "nameOfAttatchment" + { index }) {
        compoundModels[index].caption = event.target.value;
        props.handelcompoundModels(compoundModels);
      }
    }
  };

  const handelTextField = (index, event, value) => {
    var aggregateMetaDataModelsParts = [
      ...props.value.aggregateMetaDataModelsParts,
    ];

    aggregateMetaDataModelsParts[index].aggregateName = event.target.value;
    props.handelaggregateMetaDataModelsParts(aggregateMetaDataModelsParts);
  };

  const handelSelect = (index, event, value) => {
    if (value) {
      var aggregateMetaDataModelsParts = [
        ...props.value.aggregateMetaDataModelsParts,
      ];
      aggregateMetaDataModelsParts[index].childMetaDataModelId = value.id;
      props.handelaggregateMetaDataModelsParts(aggregateMetaDataModelsParts);

      // store selected model from autoComplete
      var selectedMetaDataModels = [...props.value.selectedMetaDataModels];

      selectedMetaDataModels[index].metaDataModelId = value.id;
      selectedMetaDataModels[index].metaDataModelName = value.metaDataModelName;
      props.handelselectedMetaDataModels(selectedMetaDataModels);
    }
  };

  // addCompound function Adds new compound file for Model-------------------------
  const addCompound = () => {
    var compoundModels = [...props.value.compoundModels];
    compoundModels.push({ isRequired: false, caption: "" });
    props.handelcompoundModels(compoundModels);
  };
  // End----------------------------------

  // RemoveCompound function remove specific compound file from Model-------------------------
  const RemoveCompound = (index) => {
    var compoundModels = [...props.value.compoundModels];
    compoundModels.splice(index, 1);
    props.handelcompoundModels(compoundModels);
  };
  // End----------------------------------

  // addAggergate function Adds new file-------------------------
  const addAggergate = () => {
    var aggregateMetaDataModelsParts = [
      ...props.value.aggregateMetaDataModelsParts,
    ];
    aggregateMetaDataModelsParts.push({
      childMetaDataModelId: "",
      aggregateName: "",
    });
    props.handelaggregateMetaDataModelsParts(aggregateMetaDataModelsParts);

    var selectedMetaDataModels = [...props.value.selectedMetaDataModels];
    selectedMetaDataModels.push({
      metaDataModelId: "",
      metaDataModelName: "",
    });
    props.handelselectedMetaDataModels(selectedMetaDataModels);
  };
  // End----------------------------------

  // RemoveAggergate function remove specific file-------------------------
  const RemoveAggergate = (index) => {
    var aggregateMetaDataModelsParts = [
      ...props.value.aggregateMetaDataModelsParts,
    ];
    aggregateMetaDataModelsParts.splice(index, 1);
    props.handelaggregateMetaDataModelsParts(aggregateMetaDataModelsParts);

    // remove selected model from autoComplete
    var selectedMetaDataModels = [...props.value.selectedMetaDataModels];
    selectedMetaDataModels.splice(index, 1);
    props.handelselectedMetaDataModels(selectedMetaDataModels);
  };
  // End----------------------------------
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom align="left">
        {t("modelproperties")}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={3} className={classes.textAlign}>
          <FormControlLabel
            control={
              <Checkbox
                className="isCompound"
                color="secondary"
                name="isCompound"
                value={props.value.isCompound}
                checked={props.value.isCompound === true}
                onChange={handleChange}
              />
            }
            label={t("iscompound")}
          />
        </Grid>
        <Grid item xs={9} />
        <Grid item xs={12}>
          {/* This div will be full from the hook "componentDidUpdate" when isCompound is checked */}
          {/* <div id="AttatchmentsFiles"></div> */}
          {props.value.compoundModels.map((item, index) => (
            <div className="marginleft" key={index}>
              <TextField
                error={
                  item.caption === "" && props.value.step_2_error === true
                    ? true
                    : false
                }
                helperText={
                  item.caption === "" && props.value.step_2_error === true
                    ? t("fill_out_field")
                    : ""
                }
                id={"NameOfAttatchment" + index}
                required
                name={"nameOfAttatchment" + { index }}
                value={item.caption}
                inputProps={{ "data-id": index }}
                onChange={handleChange}
                label={t("nameofattatchment")}
                // helperText="Last three digits on signature strip"
                fullWidth
              />
              <Grid item xs={6} md={3} className={classes.textAlign}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id={"isRequired" + index}
                      color="secondary"
                      name={"isRequired" + { index }}
                      inputProps={{ "data-id": index }}
                      value={item.isRequired}
                      checked={item.isRequired === true}
                      onChange={handleChange}
                    />
                  }
                  label={t("isrequired")}
                />
              </Grid>
              <Grid item xs={6} md={9} />
              <Grid item xs={12} md={6} className={classes.textAlign}>
                <Button
                  id="removeCompound"
                  variant="contained"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={() => RemoveCompound(index)}
                >
                  {t("remove")}
                </Button>
              </Grid>
            </div>
          ))}
          {props.value.isCompound && (
            <Grid item xs={12} className={classes.textAlign}>
              <br />
              <Button
                id="addCompound"
                variant="contained"
                onClick={addCompound}
                startIcon={<AddIcon />}
              >
                {t("addnewattribute")}
              </Button>
            </Grid>
          )}
          {/* ---------------------------------- */}
        </Grid>

        <Grid item xs={3} className={classes.textAlign}>
          <FormControlLabel
            control={
              <Checkbox
                className="isAggregated"
                color="secondary"
                name="isAggregated"
                value={props.value.isAggregated}
                checked={props.value.isAggregated === true}
                onChange={handleChange}
              />
            }
            label={t("isaggregated")}
          />
        </Grid>
        <Grid item xs={9} />
        <Grid item xs={12}>
          {/* This div will be full from the hook "componentDidUpdate" when isCompound is checked */}
          {/* <React.Fragment> */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {/*  Show list of attributes*/}
              {props.value.aggregateMetaDataModelsParts.map((item, index) => (
                <div key={index} className="marginleft">
                  {/* <React.Fragment> */}
                  <Typography variant="h6" gutterBottom align="left">
                    {t("aggregated")}
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        error={
                          item.aggregateName === "" &&
                          props.value.step_2_error === true
                            ? true
                            : false
                        }
                        helperText={
                          item.aggregateName === "" &&
                          props.value.step_2_error === true
                            ? t("fill_out_field")
                            : ""
                        }
                        id={"dataId" + index}
                        required
                        inputProps={{ "data-id": index }}
                        // id="Name"
                        name={"Name" + { index }}
                        label={t("namelabel")}
                        fullWidth
                        autoComplete="fname"
                        value={item.aggregateName}
                        onChange={(event, value) =>
                          handelTextField(index, event, value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CheckboxesTags
                        item={item}
                        value={props.value}
                        index={index}
                        selectedMetaDataModels={
                          props.value.selectedMetaDataModels
                        }
                        aggregateMetaDataModelsParts={
                          props.value.aggregateMetaDataModelsParts
                        }
                        onChange={(event, value) =>
                          handelSelect(index, event, value)
                        }
                        RemoveAggergate={RemoveAggergate}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} className={classes.textAlign}>
                      {/* </React.Fragment> */}
                      <Button
                        id="RemoveAggergate"
                        variant="contained"
                        color="secondary"
                        startIcon={<DeleteIcon />}
                        onClick={() => RemoveAggergate(index)}
                      >
                        {t("remove")}
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              ))}
              {/* ----------------------------------- */}
            </Grid>

            {props.value.isAggregated && (
              <Grid item xs={12} className={classes.textAlign}>
                <Button
                  id="AddAggergate"
                  variant="contained"
                  onClick={addAggergate}
                  startIcon={<AddIcon />}
                >
                  {t("addnewfile")}
                </Button>
              </Grid>
            )}
          </Grid>
          {/* </React.Fragment> */}
          {/* ---------------------------------- */}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
