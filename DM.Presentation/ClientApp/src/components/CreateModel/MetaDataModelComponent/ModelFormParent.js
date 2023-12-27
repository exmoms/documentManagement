import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Redirect } from "react-router-dom";
import { fetchData } from "../../../api/FetchData";
import { postDataToAPI } from "../../../api/PostData";
import AddFields from "./AddFields";
import ModelAttachments from "./ModelAttatchments";
import ModelName from "./NewModel";
import ReviewModel from "./ReviewModel";
import { Notification } from "../../Admin/Notifications";

function Copyright() {
  const { t } = useTranslation();
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" to="" href="https://material-ui.com/">
        {t("Company.label")}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// Style properties ------------------------------
const useStyles = makeStyles((theme) => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: "85%",
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));
// End Style properties ------------------------------

// the main component: -------------------------------
export default function ModelFormParent() {
  const { t } = useTranslation();

  // Steps Names

  const steps = [
    t("modelname"),
    t("modeltype"),
    t("modelattributes"),
    t("reviewmodel"),
  ];

  // type of attributes
  const types = [
    { id: 1, name: t("booltype") },
    { id: 2, name: t("datetype") },
    { id: 3, name: t("decimal") },
    { id: 4, name: t("double") },
    { id: 5, name: t("int") },
    { id: 6, name: t("string") },
  ];
  // fetch data from api ----------------------------
  const [DocumentClassList, getDocumentClassLest] = useState([
    // {id: 0,
    // documentClassName: "",
    // userID: 0,
    // addedDate: ""}
  ]); // fetch from Api
  const [MetaDataModels, setMetaDataModels] = useState([]); // fetch from Api

  useEffect(
    () => {
      fetchData("/api/DocumentClass/")
        .then((value) => {
          getDocumentClassLest(value);
        })
        .catch((e) => console.log(e));

      fetchData("/api/MetaDataModel/GetMetaDataModelsIdName")
        .then((value) => {
          setMetaDataModels(value);
        })
        .catch((e) => console.log(e));
    },

    [] // to deny infinity loop in useEffect
  );
  // -------------------------------------------

  // AddressForm states --------------------------------
  const [metaDataModelName, setMetaDataModelName] = useState("");
  const [documentClassId, setDocumentClassId] = useState("");
  const [documentClassSelected, setDocumentClassSelected] = useState([
    // {id: 0,documentClassName: ""}
  ]);
  //----------------------------------------------------

  // ModelAttachments states ---------------------------------
  const [isCompound, setIsCompound] = useState(false);
  const [compoundModels, setCompoundModels] = useState([
    // { isRequired: false, caption: "" },
  ]);
  const [isAggregated, setIsAggregated] = useState(false);
  const [
    aggregateMetaDataModelsParts,
    setAggregateMetaDataModelsParts,
  ] = useState([
    // { childMetaDataModelId: "", aggregateName: "" }
  ]); // what has been seleced by user from the whole MetaDataModels to be sent to server.

  const [selectedMetaDataModels, setSelectedMetaDataModels] = useState([
    {
      // metaDataModelId: "",
      // metaDataModelName: "",
    },
  ]);
  // ------------------------------------------------------

  // AddFields states ---------------------------------
  const [metaDataAttribute, addMetaDataAttribute] = useState([
    {
      metaDataAttributeName: "",
      isRequired: false,
      dataTypeID: "", // what has been seleced  by user from from the whole dateTypes to be sent to server.
    },
  ]);
  // ------------------------------------------------------

  // The json file which will be sent from this component.
  const jsonFile = {
    metaDataModelName: metaDataModelName,
    documentClassId: documentClassId,
    metaDataAttributes: metaDataAttribute,
    compoundModels: compoundModels,
    childMetaDataModels: aggregateMetaDataModelsParts,
  };
  //---------------------------------------------------

  // Redirect after post model successfully states -------------------
  const [redirect, setRedirect] = useState(false);
  // ------------------------------------------------------

  // Loading when post metadata ---------------------------------
  const [loadding, setLoadding] = useState(false);
  // ------------------------------------------------------

  // For AddressForm Componenet -----------------
  const handelName = (value) => {
    setMetaDataModelName(value);
  };

  const handelClassId = (value) => {
    setDocumentClassId(value);
  };

  const handeldocumentClassSelected = (value) => {
    setDocumentClassSelected(value);
  };
  // End ------------------------------------------

  const [step_1_error, setStep_1_error] = React.useState(false);
  const [step_2_error, setStep_2_error] = React.useState(false);
  const [step_3_error, setStep_3_error] = React.useState(false);

  // For ModelAttachments Componenet -----------------
  const handelisCompound = (value) => {
    var yes = false;

    // throw an assertion when there is a compund model added.
    if (compoundModels.length !== 0 && value === false) {
      yes = window.confirm(t("confirmmessage"));
    } else if (value === false) {
      setIsCompound(value);
      setCompoundModels([]);
    } else {
      setIsCompound(value);
      setCompoundModels([{ isRequired: false, caption: "" }]);
    }

    if (yes === true) {
      setIsCompound(value);
      setCompoundModels([]);
    }

    setStep_2_error(false);
  };

  const handelisAggregated = (value) => {
    var yes = false;

    // throw an assertion when there is an aggregated model added.
    if (aggregateMetaDataModelsParts.length !== 0 && value === false) {
      handelselectedMetaDataModels([]);
      yes = window.confirm(/*"Are you sure!"*/ t("confirmmessage"));
    } else if (aggregateMetaDataModelsParts.length === 0 && value === false) {
      setIsAggregated(value);
      setAggregateMetaDataModelsParts([]);
      handelselectedMetaDataModels([]);
    } else {
      setIsAggregated(value);
      setAggregateMetaDataModelsParts([
        { childMetaDataModelId: "", aggregateName: "" },
      ]);
    }

    if (yes === true) {
      setIsAggregated(value);
      setAggregateMetaDataModelsParts([]);
    }
    setStep_2_error(false);
  };

  const handelaggregateMetaDataModelsParts = (value) => {
    setAggregateMetaDataModelsParts(value);
    setStep_2_error(false);
  };

  const handelselectedMetaDataModels = (value) => {
    setSelectedMetaDataModels(value);
  };

  const handelcompoundModels = (value) => {
    setCompoundModels(value);
    setStep_2_error(false);
  };
  // End ------------------------------------------

  // For Addfields Componenet -----------------
  const handelmetaDataAttribute = (value) => {
    addMetaDataAttribute(value);
    setStep_3_error(false);
  };
  // End ------------------------------------------

  const [activeStep, setActiveStep] = React.useState(0);

  const checkErrors = () => {
    let step_1, step_2, step_3;

    // check all fields in step 1 are not empty.
    step_1 =
      metaDataModelName.toString().trim() === "" || documentClassId === "";

    // check all fields in step 2 are not empty.
    // In case there is no empty fields the "find" function is going to return "undifined"
    step_2 =
      compoundModels.find(
        (element) => element.caption.toString().trim() === ""
      ) !== window.undefined ||
      aggregateMetaDataModelsParts.find(
        (element) => element.aggregateName.toString().trim() === ""
      ) !== window.undefined ||
      aggregateMetaDataModelsParts.find(
        (element) => element.childMetaDataModelId.toString().trim() === ""
      ) !== window.undefined;

    // check all fields in step 3 are not empty.
    // In case there is no empty fields the "find" function is going to return "undifined"
    step_3 =
      metaDataAttribute.find(
        (element) => element.metaDataAttributeName.toString().trim() === ""
      ) !== window.undefined ||
      metaDataAttribute.find(
        (element) => element.dataTypeID.toString().trim() === ""
      ) !== window.undefined;

    return [step_1, step_2, step_3];
  };

  const handleNext = () => {
    let [step_1, step_2, step_3] = checkErrors();

    if (activeStep === 0 && step_1 === true) {
      setStep_1_error(true);
    } else if (activeStep === 1 && step_2 === true) {
      setStep_2_error(true);
    } else if (activeStep === 2 && step_3 === true) {
      setStep_3_error(true);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const [open, setOpen] = useState(false);
  const [errorMessage, seterrorMessage] = useState([]);
  const [error, seterror] = useState(false);

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    setOpen(false);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ModelName
            onSetModelName={handelName}
            onSetModelClassId={handelClassId}
            handeldocumentClassSelected={handeldocumentClassSelected}
            value={{
              step_1_error: step_1_error,
              metaDataModelName: metaDataModelName,
              documentClassId: documentClassId,
              DocumentClassList: DocumentClassList,
              documentClassSelected: documentClassSelected,
            }}
          />
        );
      case 1:
        return (
          <ModelAttachments
            handelisCompound={handelisCompound}
            handelisAggregated={handelisAggregated}
            handelcompoundModels={handelcompoundModels}
            handelaggregateMetaDataModelsParts={
              handelaggregateMetaDataModelsParts
            }
            handelselectedMetaDataModels={handelselectedMetaDataModels}
            value={{
              step_2_error: step_2_error,
              isCompound: isCompound,
              isAggregated: isAggregated,
              aggregateMetaDataModelsParts: aggregateMetaDataModelsParts,
              MetaDataModels: MetaDataModels,
              compoundModels: compoundModels,
              selectedMetaDataModels: selectedMetaDataModels,
            }}
          />
        );
      case 2:
        return (
          <AddFields
            handelmetaDataAttribute={handelmetaDataAttribute}
            value={{
              step_3_error: step_3_error,
              metaDataAttribute: metaDataAttribute,
              dateTypes: types,
            }}
          />
        );
      case 3:
        return (
          <ReviewModel
            value={{
              metaDataModelName: metaDataModelName,
              documentClassSelected: documentClassSelected,
              isCompound: isCompound,
              isAggregated: isAggregated,
              aggregateMetaDataModelsParts: aggregateMetaDataModelsParts,
              compoundModels: compoundModels,
              selectedMetaDataModels: selectedMetaDataModels,
              metaDataAttribute: metaDataAttribute,
            }}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  };

  const classes = useStyles();

  const send = async () => {
    try {
      let response = await postDataToAPI(
        "/api/MetaDataModel/AddNewMetaDataModel",
        jsonFile
      );
      setLoadding(true);
      if (response.ok) {
        setTimeout(() => {
          setRedirect(true);
        }, 1000);
        setLoadding(false);
        setOpen(true);
        seterror(false);
      } else {
        let json = await response.json();
        setLoadding(false);
        setOpen(true);
        seterror(true);
        seterrorMessage(json.error);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            {t("modelsteps")}
          </Typography>
          <Stepper
            activeStep={activeStep}
            className={classes.stepper}
            // setactivestep={ (activeStep) =>{setActiveStep(activeStep) }} causing error
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <React.Fragment>
            {getStepContent(activeStep)}
            <div className={classes.buttons}>
              {activeStep !== 0 && (
                <Button
                  text="Back"
                  onClick={handleBack}
                  className={classes.button}
                >
                  {/* Back */}
                  {t("Button.back")}
                </Button>
              )}
              <Button
                text="Cancel"
                className={classes.button}
                component={Link}
                to="/metadata-model"
              >
                {t("cancel")}
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  text="Create"
                  variant="contained"
                  color="primary"
                  onClick={send}
                  className={classes.button}
                >
                  {/* Ok, Create Now */}
                  {t("create")}
                  {loadding && (
                    <CircularProgress color="secondary" size="25px" />
                  )}
                </Button>
              ) : (
                <Button
                  text="Next"
                  id={"Next" + activeStep}
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                >
                  {/* Next */}
                  {t("next")}
                </Button>
              )}
            </div>
            <Notification
            id="notification"
              open={open} // must be a "state" to show notification message [true or false]
              setOpen={setOpen} // this function changes the state "open" value.
              error={error} // if error message put [true] else for success put [false]
              errorMessage={errorMessage} // the recived error message (array of string) from server.
            />
          </React.Fragment>
        </Paper>

        <Copyright />
      </main>
      {redirect && <Redirect to="/metadata-model" />}
    </React.Fragment>
  );
}
