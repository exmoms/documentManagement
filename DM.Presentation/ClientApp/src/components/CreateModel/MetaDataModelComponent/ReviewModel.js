import React from "react";
import Typography from "@material-ui/core/Typography";
import ReactVirtualizedTable from "./TableView";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles(() => ({
  textAlign: {
    textAlign: "initial",
    padding: "20px",
  },
}));

export default function ReviewModel(props) {
  const { t } = useTranslation();
  const classes = useStyle();

  const attributeColumns = [
    { id: "metaDataAttributeName", label: t("nameofattribute"), minWidth: 170 },
    { id: "dataTypeID", label: t("type"), minWidth: 100 },
    {
      id: "isRequired",
      label: t("isrequired"),
      minWidth: 170,
      align: "center",
    },
  ];

  const selectedMetaDataModels_aggregateMetaDataModelsParts_Columns = [
    { id: "aggregateName", label: "Aggregation Name", minWidth: 170 },
    { id: "metaDataModelName", label: "Aggregated Model", minWidth: 100 },
  ];

  const compound_Columns = [
    { id: "caption", label: "caption", minWidth: 170 },
    { id: "isRequired", label: t("isrequired"), minWidth: 100 },
  ];

  var selectedMetaDataModels_aggregateMetaDataModelsParts = [
    {
      metaDataModelName: "",
      aggregateName: "",
    },
  ];

  if (
    props.value.selectedMetaDataModels.length ===
    props.value.aggregateMetaDataModelsParts.length
  ) {
    for (let i = 0; i < props.value.aggregateMetaDataModelsParts.length; i++) {
      selectedMetaDataModels_aggregateMetaDataModelsParts[i] = {
        metaDataModelName:
          props.value.selectedMetaDataModels[i].metaDataModelName,
        aggregateName:
          props.value.aggregateMetaDataModelsParts[i].aggregateName,
      };
    }
  }

  let compound;
  let aggregate;
  if (props.value.isCompound === true) {
    compound = (
      <>
        <p id="isCompound">
          <b>{t("compoundmodelincludes")}</b>
        </p>
        <ReactVirtualizedTable
          rows={props.value.compoundModels}
          columns={compound_Columns}
        />
      </>
    );
  } else {
    compound = (
      <p id="isCompound">
        <b>{t("notcompoundmodel")}</b>
      </p>
    );
  }

  if (props.value.isAggregated === true) {
    aggregate = (
      <>
        <p id="isAggregated">
          <b>{t("aggregatedmodelincludes")}</b>
        </p>
        <ReactVirtualizedTable
          rows={selectedMetaDataModels_aggregateMetaDataModelsParts}
          columns={selectedMetaDataModels_aggregateMetaDataModelsParts_Columns}
        />
      </>
    );
  } else {
    aggregate = (
      <p id="isAggregated">
        <b>{t("notaggregated")}</b>
      </p>
    );
  }

  const types = [
    t("booltype"),
    t("datetype"),
    t("decimal"),
    t("double"),
    t("int"),
    t("string"),
  ];

  var Attributes = [];

  for (let i = 0; i < props.value.metaDataAttribute.length; i++) {
    Attributes.push({
      dataTypeID: types[props.value.metaDataAttribute[i].dataTypeID - 1],
      metaDataAttributeName:
        props.value.metaDataAttribute[i].metaDataAttributeName,
      isRequired: props.value.metaDataAttribute[i].isRequired,
    });
  }

  return (
    <React.Fragment>
      <div className={classes.textAlign}>
        <Typography variant="h6" gutterBottom align="center">
          {t("modelreview")}
        </Typography>
        <hr />
        <p id="ModelName">
          <b>{t("modelname")}</b>: {props.value.metaDataModelName}
        </p>
        <p id="DocumentClassName">
          <b>{t("documentparagraph")}</b>:{" "}
          {props.value.documentClassSelected.documentClassName}
        </p>
        {compound}
        <br />
        {aggregate}
        <br />
        <b>{t("paragraphmetadata")}</b>:
        <br />
        <ReactVirtualizedTable rows={Attributes} columns={attributeColumns} />
      </div>
    </React.Fragment>
  );
}
