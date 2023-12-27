import React from "react";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import FAQ from "../src/js/components/tabs/FAQ";
//import createDoc from "../public/";
function FaqFunction({ onArticleRating }) {
  const { t } = useTranslation();
  var { createDocPath } = "";
  var { fillInfoPath } = "";
  var { submitPath } = "";
  var { fillInfoPathAggr } = "";
  var { addAggrDoc } = "";
  var { searchDoc } = "";
  var { selectDoc } = "";
  var { addAggrCompDoc } = "";
  var { addAttchment } = "";
  var { addAttchment2 } = "";
  var { docClass } = "";
  var { addClass } = "";
  var { fillClassInfo } = "";
  var { metadataModel } = "";
  var { addMetadataModel } = "";
  var { modelTypes } = "";
  var { aggrCompModel } = "";
  var { modelAttr } = "";
  var { docSet } = "";
  var { addDocSet } = "";
  var { addDocToSet } = "";
  var { browseDocuments } = "";
  var { searchByValue } = "";
  var { deleteDoc } = "";
  var { updateDoc } = "";
  var { viewDoc } = "";
  var { printDoc } = "";
  var { downloadDoc } = "";
  var { archiveDoc } = "";
  var { historyDoc } = "";
  var { emailDoc } = "";
  var { composeEmail } = "";
  var { viewAttachments } = "";
  var { profile } = "";
  var { changePassword } = "";
  var { signUp } = "";
  var { editProfile } = "";
  var { configureEmail } = "";
  if (i18n.language === "en") {
    createDocPath = "/images/CreateDocEN.PNG";
    fillInfoPath = "/images/fillInfoEN.PNG";
    submitPath = "/images/submitSuccessEN.PNG";
    fillInfoPathAggr = "/images/FillInfoAggrEN.PNG";
    addAggrDoc = "/images/AddAggrEN.PNG";
    searchDoc = "/images/SearchForDocEN.PNG";
    selectDoc = "/images/SelectDocEN.PNG";
    addAggrCompDoc = "/images/AggCompoundDocEN.PNG";
    addAttchment = "/images/AttachEN.PNG";
    addAttchment2 = "/images/Attach2EN.PNG";
    docClass = "/images/DocumentClassEN.PNG";
    addClass = "/images/CreateNewDocumentClassEN.PNG";
    fillClassInfo = "/images/FillDocumentClassInfoEN.PNG";
    metadataModel = "/images/MetadataModelEN.PNG";
    addMetadataModel = "/images/CreateModelEN.PNG";
    modelTypes = "/images/2modelEN.PNG";
    aggrCompModel = "/images/3modelcompAggrEN.PNG";
    modelAttr = "/images/4modelAttrEN.PNG";
    docSet = "/images/DocumentSetEN.PNG";
    addDocSet = "/images/addDocumentSetEN.PNG";
    addDocToSet = "/images/addDocumentToSetEN.PNG";
    browseDocuments = "/images/BrowseDocumentsEN.PNG";
    searchByValue = "/images/SearchByValueEN.PNG";
    deleteDoc = "/images/DeleteAction.PNG";
    updateDoc = "/images/UpdateAction.PNG";
    viewDoc = "/images/ViewAction.PNG";
    printDoc = "/images/PrintAction.PNG";
    downloadDoc = "/images/DownloadAction.PNG";
    archiveDoc = "/images/ArchiveAction.PNG";
    historyDoc = "/images/HistoryAction.PNG";
    emailDoc = "/images/EmailAction.PNG";
    composeEmail = "/images/ComposeEmail.PNG";
    viewAttachments = "/images/ViewAttachmentsAction.PNG";
    profile = "/images/ProfileEN.PNG";
    changePassword = "/images/ChangePasswordEN.PNG";
    signUp = "/images/SignUpEN.PNG";
    editProfile = "/images/EditProfileEN.PNG";
    configureEmail = "/images/ConfigureEmailEN.PNG";
  } else {
    createDocPath = "/images/createDocAR.png";
    fillInfoPath = "/images/fillInfoAR.PNG";
    submitPath = "/images/submitSuccessAR.PNG";
    fillInfoPathAggr = "/images/fillInfoAr.PNG";
    addAggrDoc = "/images/addaggregated.png";
    searchDoc = "/images/textSearch.png";
    selectDoc = "/images/selectDoc.png";
    addAggrCompDoc = "/images/AggCompoundDocAR.PNG";
    addAttchment = "/images/AttachAR.PNG";
    addAttchment2 = "/images/Attach2AR.PNG";
    docClass = "/images/selectAddClass.png";
    addClass = "/images/addNewClass.png";
    fillClassInfo = "/images/addNewDocClass.png";
    metadataModel = "/images/MetadataModelAR.PNG";
    addMetadataModel = "/images/CreateModelAR.PNG";
    modelTypes = "/images/2modelAR.PNG";
    aggrCompModel = "/images/3modelcompAggrAR.PNG";
    modelAttr = "/images/4modelAttrAR.PNG";
    docSet = "/images/DocumentSetAR.PNG";
    addDocSet = "/images/addDocumentSetAR.PNG";
    addDocToSet = "/images/addDocumentToSetEN.PNG";
    browseDocuments = "/images/BrowseDocumentsAR.PNG";
    searchByValue = "/images/SearchByValueAR.PNG";
    deleteDoc = "/images/DeleteAction.PNG";
    updateDoc = "/images/UpdateAction.PNG";
    viewDoc = "/images/ViewAction.PNG";
    printDoc = "/images/PrintAction.PNG";
    downloadDoc = "/images/DownloadAction.PNG";
    archiveDoc = "/images/ArchiveAction.PNG";
    historyDoc = "/images/HistoryAction.PNG";
    emailDoc = "/images/EmailAction.PNG";
    composeEmail = "/images/ComposeEmail.PNG";
    viewAttachments = "/images/ViewAttachmentsAction.PNG";
    profile = "/images/ProfileAR.PNG";
    changePassword = "/images/ChangePasswordAR.PNG";
    signUp = "/images/SignUpAR.PNG";
    editProfile = "/images/EditProfileAR.PNG";
    configureEmail = "/images/ConfigureEmailAR.PNG";
  }
  /*
  const r = {
    title: "What is recurison?",
    articles: [{ title: "Did you mean recursion?", body: "lol" }],
  };
  */
  const addNaturalDocument = {
    title: t("addNaturalDocument"),
    body:
      t("addNaturalDocumentBegining") +
      "</br>" +
      "</br>" +
      "<h5 style=color:SlateBlue;>" +
      t("selectModel") +
      "</h5>" +
      "<hr>" +
      " " +
      " " +
      t("selectModel_SelectCreate") +
      "</br>" +
      "  <img src=" +
      createDocPath +
      ' height="180" width="40"></img>' +
      "</br>" +
      " " +
      " " +
      t("selectModel_fillInfo") +
      "</br>" +
      "  <img src=" +
      fillInfoPath +
      ' height="180" width="40"></img>' +
      "</br>" +
      " " +
      " " +
      t("attachmentillingDoc_SubmittedDone") +
      "</br>" +
      "  <img src=" +
      submitPath +
      ' height="180" width="40"></img>',
  };

  const addAggregatedDocument = {
    title: t("addAggregatedDocument"),
    body:
      t("addAggregatedDocumentBegining") +
      "</br>" +
      "</br>" +
      "<h5 style=color:SlateBlue;>" +
      t("selectModel") +
      "</h5>" +
      "<hr>" +
      " " +
      " " +
      t("selectModel_SelectCreate") +
      "</br>" +
      "  <img src=" +
      createDocPath +
      ' height="180" width="40"></img>' +
      "</br>" +
      " " +
      " " +
      t("selectModel_fillInfo_aggr") +
      "</br>" +
      "  <img src=" +
      fillInfoPathAggr +
      ' height="180" width="40"></img>' +
      "</br>" +
      "</br>" +
      "<h5 style=color:SlateBlue;>" +
      t("aggregatedFillingDoc_AggregatedDoc") +
      "</a>" +
      "</br>" +
      "</br>" +
      "  <img src=" +
      addAggrDoc +
      ' height="180" width="40"></img>' +
      " " +
      " " +
      t("aggregatedFillingDoc") +
      "</br>" +
      "</br>" +
      "  <img src=" +
      searchDoc +
      ' height="180" width="40"></img>' +
      "</br>" +
      "</br>" +
      " " +
      " " +
      t("aggregatedFillingDoc_SearchResult") +
      "</br>" +
      "  <img src=" +
      selectDoc +
      ' height="180" width="40"></img>' +
      "</br>" +
      " " +
      " " +
      t("attachmentillingDoc_SubmittedDone") +
      "  <img src=" +
      submitPath +
      'height="180" width="40"></img>' +
      "</br>",
  };
  const addNaturalDocumentWithAttachment = {
    title: t("addNaturalDocumentWithAttachment"),
    body:
      t("addNaturalDocumentWithAttachmentBegining") +
      "</br>" +
      "</br>" +
      "<h5 style=color:SlateBlue;>" +
      t("selectModel_SelectCreate") +
      "</br>" +
      "  <img src=" +
      createDocPath +
      ' height="180" width="40"></img>' +
      "</br>" +
      " " +
      " " +
      t("selectModel_fillInfo_comp") +
      "</br>" +
      "  <img src=" +
      fillInfoPathAggr +
      ' height="180" width="40"></img>' +
      "</br>" +
      "</br>" +
      "<h5 style=color:SlateBlue;>" +
      t("addAttachment") +
      "</h5>" +
      "<hr>" +
      " " +
      " " +
      t("attachmentillingDoc_ClickAdd") +
      "</br>" +
      "  <img src=" +
      addAttchment2 +
      ' height="180" width="40"></img>' +
      "</br>" +
      " " +
      " " +
      t("attachmentillingDoc_ClickSubmit") +
      '<a href="#" data-toggle="tooltip"  title=" ' +
      t("termsContentAttachment") +
      '">' +
      "</br>" +
      " " +
      " " +
      t("attachmentillingDoc_SubmittedDone") +
      "  <img src=" +
      submitPath +
      ' height="180" width="40"></img>' +
      "</br>",
  };
  const addAggregatedCompoundDocument = {
    title: t("addAggregatedCompoundDocument"),
    body:
      t("addAggregatedCompoundDocumentBegining") +
      "</br>" +
      "</br>" +
      "<h5 style=color:SlateBlue;>" +
      t("selectModel") +
      "</h5>" +
      "<hr>" +
      " " +
      " " +
      t("selectModel_SelectCreate") +
      "</br>" +
      "  <img src=" +
      createDocPath +
      ' height="180" width="40"></img>' +
      "</br>" +
      " " +
      " " +
      t("selectModel_fillInfo_aggr_com") +
      "</br>" +
      "  <img src=" +
      fillInfoPathAggr +
      ' height="180" width="40"></img>' +
      "</br>" +
      "</br>" +
      "<h5 style=color:SlateBlue;>" +
      t("aggregatedFillingDoc_AggregatedDoc_comp") +
      "</a>" +
      "</br>" +
      "</br>" +
      "  <img src=" +
      addAggrCompDoc +
      ' height="180" width="40"></img>' +
      " " +
      " " +
      t("aggregatedFillingDoc_AggregatedDoc") +
      "</a>" +
      "</br>" +
      "</br>" +
      "  <img src=" +
      addAggrDoc +
      ' height="180" width="40"></img>' +
      " " +
      " " +
      t("aggregatedFillingDoc") +
      "</br>" +
      "</br>" +
      "  <img src=" +
      searchDoc +
      ' height="180" width="40"></img>' +
      "</br>" +
      "</br>" +
      " " +
      " " +
      t("aggregatedFillingDoc_SearchResult") +
      "</br>" +
      "  <img src=" +
      selectDoc +
      ' height="180" width="40"></img>' +
      "</br>" +
      "</br>" +
      "<h5 style=color:SlateBlue;>" +
      t("addAttachment") +
      "</h5>" +
      "<hr>" +
      " " +
      " " +
      t("attachmentillingDoc_ClickAdd") +
      "</br>" +
      "  <img src=" +
      addAttchment +
      ' height="180" width="40"></img>' +
      "</br>" +
      " " +
      " " +
      t("attachmentillingDoc_ClickSubmit") +
      '<a href="#" data-toggle="tooltip"  title=" ' +
      t("termsContentAttachment") +
      '">' +
      "</br>" +
      " " +
      " " +
      t("attachmentillingDoc_SubmittedDone") +
      "  <img src=" +
      submitPath +
      ' height="180" width="40"></img>' +
      "</br>",
  };
  const explination = {
    title: t("addDocumentOptions"),

    articles: [
      { ...addNaturalDocument },
      { ...addNaturalDocumentWithAttachment },
      { ...addAggregatedCompoundDocument },
      { ...addAggregatedDocument },
    ],
  };
  const json = {
    categories: [
      {
        title: "General",
        articles: [
          {
            title: t("How_To_Add_New_Document_Class"),

            body:
              t("addDocClass_Step1") +
              "</br>" +
              "</br>" +
              "  <img src=" +
              docClass +
              ' height="180" width="60"></img>' +
              t("addDocClass_Step2") +
              "</br>" +
              "</br>" +
              "  <img src=" +
              addClass +
              ' height="180" width="60"></img>' +
              t("addDocClass_Step3") +
              "</br>" +
              "</br>" +
              "  <img src=" +
              fillClassInfo +
              ' height="180" width="40"></img>' +
              t("addDocClass_Step4"),
          },
          {
            title: t("How_To_Add_New_Metadata_Model"),

            body:
              t("addMetaDataModel_SelectMetaDataModel") +
              "</br>" +
              "</br>" +
              "  <img src=" +
              metadataModel +
              ' height="180" width="60"></img>' +
              "</br>" +
              t("addMetaDataModel_ClickAdd") +
              "</br>" +
              "</br>" +
              "  <img src=" +
              addMetadataModel +
              ' height="180" width="60"></img>' +
              t("addMetaDataModel_EnterName") +
              "</br>" +
              t("addMetaDataModel_SelectClass") +
              "</br>" +
              t("addMetaDataModel_ClickNext") +
              "</br>" +
              "</br>" +
              "<h5 style=color:SlateBlue;>" +
              t("addMetaDataModel_SelectModelType") +
              "</h5>" +
              "<hr>" +
              t("addMetaDataModel_DetectType") +
              "</br>" +
              "</br>" +
              "  <img src=" +
              modelTypes +
              ' height="180" width="60"></img>' +
              t("addMetaDataModel_ModelsTypes") +
              "</br>" +
              "</br>" +
              " " +
              "<h6 style=color:SlateBlue;>" +
              t("addMetaDataModel_AddNaturalModel") +
              "</h6>" +
              " " +
              " " +
              t("addMetaDataModel_AddNaturalModelBeginning") +
              "</br>" +
              "</br>" +
              " " +
              "<h6 style=color:SlateBlue;>" +
              t("addMetaDataModel_AddCompoundModel") +
              "</h6>" +
              " " +
              " " +
              t("addMetaDataModel_AddCompoundModelBeginning") +
              "</br>" +
              " " +
              " " +
              t("addMetaDataModel_AddCompoundModelStep1") +
              "</br>" +
              " " +
              " " +
              t("addMetaDataModel_AddCompoundModelStep2") +
              "</br>" +
              " " +
              " " +
              t("addMetaDataModel_AddCompoundModelStep3") +
              "</br>" +
              " " +
              " " +
              t("addMetaDataModel_AddCompoundModelStep4") +
              "</br>" +
              "</br>" +
              " " +
              "<h6 style=color:SlateBlue;>" +
              t("addMetaDataModel_AddAggregatedCompoundModel") +
              "</br>" +
              "</br>" +
              "  <img src=" +
              aggrCompModel +
              ' height="180" width="60"></img>' +
              "</h6>" +
              " " +
              " " +
              t("addMetaDataModel_AddAggregatedCompoundModelBeginning") +
              "</br>" +
              " " +
              " " +
              t("addMetaDataModel_AddAggregatedCompoundModelStep1") +
              "</br>" +
              " " +
              " " +
              t("addMetaDataModel_AddAggregatedCompoundModelStep2") +
              "</br>" +
              " " +
              " " +
              t("addMetaDataModel_AddAggregatedCompoundModelStep3") +
              "</br>" +
              " " +
              " " +
              t("addMetaDataModel_AddAggregatedCompoundModelStep4") +
              "</br>" +
              " " +
              " " +
              t("addMetaDataModel_AddAggregatedCompoundModelStep5") +
              "</br>" +
              " " +
              " " +
              t("addMetaDataModel_AddAggregatedCompoundModelStep6") +
              "</br>" +
              " " +
              " " +
              t("addMetaDataModel_AddAggregatedCompoundModelStep7") +
              "</br>" +
              "</br>" +
              " " +
              "<h6 style=color:SlateBlue;>" +
              t("addMetaDataModel_AddAggregatedModel") +
              "</h6>" +
              " " +
              " " +
              t("addMetaDataModel_AddAggregatedModelBeginning") +
              "</br>" +
              " " +
              " " +
              t("addMetaDataModel_AddAggregatedModelStep1") +
              "</br>" +
              " " +
              " " +
              t("addMetaDataModel_AddAggregatedModelStep2") +
              "</br>" +
              " " +
              " " +
              t("addMetaDataModel_AddAggregatedModelStep3") +
              "</br>" +
              " " +
              " " +
              t("addMetaDataModel_AddCompoundModelStep4") +
              "</br>" +
              "</br>" +
              t("addMetaDataModel_AddModelAttribuits") +
              "</br>" +
              "</br>" +
              "  <img src=" +
              modelAttr +
              ' height="180" width="60"></img>' +
              "</h5>" +
              "<hr>" +
              t("addMetaDataModel_ِAddAttrribuitName") +
              "</br>" +
              t("addMetaDataModel_ِRequired") +
              "</br>" +
              t("addMetaDataModel_ِِAttribuitType") +
              "</br>" +
              t("addMetaDataModel_ِِAddAttribuit") +
              "</br>" +
              t("addMetaDataModel_SelectNextForReview") +
              "</br>" +
              "</br>" +
              "<h5 style=color:SlateBlue;>" +
              t("addMetaDataModel_ReviewModel") +
              "</h5>" +
              "<hr>" +
              t("addMetaDataModel_ReviewConfirm"),
          },
          {
            title: t("How_To_Add_New_DocumentSet"),

            body:
              t("addOrphanDocumentSetStep1") +
              "</br>" +
              "</br>" +
              "  <img src=" +
              docSet +
              ' height="180" width="40"></img>' +
              t("addOrphanDocumentSetStep3") +
              "</br>" +
              "</br>" +
              "  <img src=" +
              addDocSet +
              ' height="180" width="40"></img>' +
              t("addOrphanDocumentSetStep4") +
              "</br>" +
              "</br>",
          },
          {
            title: t("How_To_Add_New_SubSet"),

            body:
              t("addOrphanDocumentSetStep1") +
              "</br>" +
              "</br>" +
              "  <img src=" +
              docSet +
              ' height="180" width="40"></img>' +
              t("addSubDocumentSetStep2") +
              "</br>" +
              "</br>" +
              "  <img src=" +
              addDocSet +
              ' height="180" width="40"></img>' +
              t("addSubDocumentSetStep4") +
              "</br>" +
              "</br>" +
              t("addSubDocumentSetStep6"),
          },
          {
            title: t("How_To_Add_Document_To_Set"),

            body:
              t("addOrphanDocumentSetStep1") +
              "</br>" +
              "</br>" +
              "  <img src=" +
              docSet +
              ' height="180" width="40"></img>' +
              t("addDocumentToSetStep2") +
              "</br>" +
              "</br>" +
              t("addSubDocumentSetStep3") +
              "</br>" +
              "</br>" +
              "  <img src=" +
              addDocToSet +
              ' height="180" width="40"></img>' +
              "</br>" +
              "</br>" +
              t("addDocumentToSetStep5") +
              "</br>" +
              "</br>" +
              t("addDocumentToSetStep6"),
          },

          {
            title: t("How_To_Display_Documents"),
            body:
              t("updateDocumentStep1") +
              "</br>" +
              "</br>" +
              "<img src=" +
              browseDocuments +
              ' height="180" width="40"></img>' +
              " " +
              t("updateDocumentStep2") +
              "</br>" +
              "<h6 style=color:SlateBlue;>" +
              t("updateDocumentStep2_A") +
              "</br>" +
              "</br>" +
              "</h6>" +
              " " +
              " " +
              " " +
              t("updateDocumentStep2_AٍStep1") +
              "</br>" +
              "</br>" +
              "<img src=" +
              searchDoc +
              ' height="180" width="40"></img>' +
              " " +
              " " +
              " " +
              "<h6 style=color:SlateBlue;>" +
              t("updateDocumentStep2_B") +
              "</h6>" +
              " " +
              " " +
              " " +
              t("updateDocumentStep2_BStep1") +
              "</br>" +
              "</br>" +
              "<img src=" +
              searchByValue +
              ' height="180" width="40"></img>' +
              " " +
              " " +
              " ",
          },
          {
            title: t("What_Actions_Can_Be_Performed_On_A_Document"),
            body:
              t("opeationsBegining") +
              " " +
              "</br>" +
              "<h6 style=color:SlateBlue;>" +
              t("deleteDocument") +
              "</h6>" +
              "<hr>" +
              " " +
              " " +
              " " +
              t("deleteDocumentSteps") +
              "</br>" +
              "</br>" +
              "<img src=" +
              deleteDoc +
              ' height="180" width="40"></img>' +
              "<h6 style=color:SlateBlue;>" +
              t("updateDocument") +
              "</h6>" +
              "<hr>" +
              " " +
              t("updateDocumentStep3") +
              "</br>" +
              "</br>" +
              "<img src=" +
              updateDoc +
              ' height="180" width="40"></img>' +
              "</br>" +
              " " +
              t("updateDocumentStep4") +
              "</br>" +
              " " +
              t("updateDocumentStep5") +
              "</br>" +
              " " +
              " " +
              t("updateDocumentStep5_A") +
              "</br>" +
              " " +
              " " +
              t("updateDocumentStep5_B") +
              "</br>" +
              " " +
              t("updateDocumentStep6") +
              "</br>" +
              " " +
              t("updateDocumentStep7") +
              "</br>" +
              "</br>" +
              "<h6 style=color:SlateBlue;>" +
              t("viewDocument") +
              "</h6>" +
              "<hr>" +
              " " +
              t("viewDocumentSteps") +
              "</br>" +
              "</br>" +
              "<img src=" +
              viewDoc +
              ' height="180" width="40"></img>' +
              "<h6 style=color:SlateBlue;>" +
              t("printDocument") +
              "</h6>" +
              "<hr>" +
              " " +
              t("printDocumentSteps") +
              "</br>" +
              "</br>" +
              "<img src=" +
              printDoc +
              ' height="180" width="40"></img>' +
              "<h6 style=color:SlateBlue;>" +
              t("downloadDoc") +
              "</h6>" +
              "<hr>" +
              " " +
              t("downloadDocSteps") +
              "</br>" +
              "</br>" +
              "<img src=" +
              downloadDoc +
              ' height="180" width="40"></img>' +
              "<h6 style=color:SlateBlue;>" +
              t("archive") +
              "</h6>" +
              "<hr>" +
              " " +
              t("archiveSteps") +
              "</br>" +
              "</br>" +
              "<img src=" +
              archiveDoc +
              ' height="180" width="40"></img>' +
              "<h6 style=color:SlateBlue;>" +
              t("viewHistory") +
              "</h6>" +
              "<hr>" +
              " " +
              t("viewHistoryStep1") +
              "</br>" +
              "</br>" +
              "<img src=" +
              historyDoc +
              ' height="180" width="40"></img>' +
              " " +
              t("viewHistoryStep2") +
              "</br>" +
              "</br>" +
              "<h6 style=color:SlateBlue;>" +
              t("sendByEmail") +
              "</h6>" +
              "<hr>" +
              " " +
              t("sendByEmailStep1") +
              "</br>" +
              "</br>" +
              "<img src=" +
              emailDoc +
              ' height="180" width="40"></img>' +
              " " +
              t("sendByEmailStep2") +
              "</br>" +
              "</br>" +
              "<img src=" +
              composeEmail +
              ' height="180" width="40"></img>' +
              " " +
              t("sendByEmailStep3") +
              "</br>" +
              " " +
              t("sendByEmailStep4") +
              "</br>" +
              " " +
              t("sendByEmailStep5") +
              "</br>" +
              "<h6 style=color:SlateBlue;>" +
              t("viewAttachments") +
              "</h6>" +
              "<hr>" +
              " " +
              t("viewAttachments1") +
              "</br>" +
              "</br>" +
              "<img src=" +
              viewAttachments +
              ' height="180" width="40"></img>' +
              " " +
              t("viewAttachments2") +
              "</br>" +
              "</br>" +
              " ",
          },
          {
            title: t("How_To_Modify_Your_Password"),
            body:
              " " +
              "</br>" +
              "<img src=" +
              profile +
              ' height="90" width="40"></img>' +
              t("modifyPasswordStep1") +
              "</br>" +
              "</br>" +
              "<img src=" +
              changePassword +
              ' height="180" width="40"></img>' +
              t("modifyPasswordStep2") +
              "</br>" +
              " " +
              t("modifyPasswordStep3") +
              "</br>" +
              " " +
              t("modifyPasswordStep4") +
              "</br>" +
              t("modifyPasswordStep5") +
              "</br>" +
              t("modifyPasswordStep6") +
              "</br>",
          },
          {
            title: t("selectLanguage"),
            body:
              " " +
              "</br>" +
              "<img src=" +
              profile +
              ' height="90" width="40"></img>' +
              t("selectLanguageStep1") +
              "</br>" +
              t("selectLanguageStep2") +
              "</br>" +
              " " +
              t("selectLanguageStep3") +
              "</br>",
          },
          {
            title: t("logout"),
            body: t("logoutStep") + "</br>",
          },
          {
            title: t("logIn"),
            body:
              " " +
              t("logInStep1") +
              "</br>" +
              t("logInStep2") +
              "</br>" +
              " " +
              t("logInStep3") +
              "</br>" +
              " " +
              t("logInStep4") +
              "</br>" +
              t("logInStep5") +
              "</br>" +
              t("logInStep6") +
              "</br>",
          },
          {
            title: t("How_To_Add_New_User"),
            body:
              " " +
              t("addNewUserStep1") +
              "</br>" +
              t("addNewUserStep2") +
              "</br>" +
              "</br>" +
              "<img src=" +
              signUp +
              ' height="90" width="40"></img>' +
              " " +
              t("addNewUserStep3") +
              "</br>" +
              " " +
              t("addNewUserStep4") +
              "</br>" +
              t("addNewUserStep5") +
              "</br>" +
              t("addNewUserStep6") +
              "</br>" +
              " " +
              t("addNewUserStep7") +
              "</br>" +
              " " +
              t("addNewUserStep8") +
              "</br>",
          },
          {
            title: t("Edit_User_Profile"),
            body:
              t("editeUserProfileStep1") +
              "</br>" +
              "</br>" +
              "<img src=" +
              editProfile +
              ' height="180" width="40"></img>' +
              t("editeUserProfileStep2") +
              "</br>" +
              " " +
              t("editeUserProfileStep3") +
              "</br>" +
              " " +
              t("editeUserProfileStep4") +
              "</br>",
          },
          {
            title: t("Configure_Email"),
            body:
              t("cofigureEmailStep1") +
              "</br>" +
              t("cofigureEmailStep2") +
              "</br>" +
              "<img src=" +
              configureEmail +
              ' height="180" width="40"></img>' +
              "</br>" +
              " " +
              t("cofigureEmailStep3") +
              "</br>" +
              " " +
              t("cofigureEmailStep4") +
              "</br>" +
              t("cofigureEmailStep5") +
              "</br>" +
              t("cofigureEmailStep6") +
              "</br>" +
              " " +
              t("cofigureEmailStep7") +
              "</br>" +
              " " +
              t("cofigureEmailStep8") +
              "</br>" +
              " " +
              t("cofigureEmailStep9") +
              "</br>",
          },
          {
            title: t("terms1"),
            body:
              t("termsContentNaturalDoc") +
              "</br>" +
              t("termsContentAgregatedDoc") +
              "</br>" +
              t("termsContentCompoundDoc") +
              "</br>" +
              t("termsContentDocCLass") +
              "</br>" +
              '<div id="hello">' +
              t("termsContentScannedCopy") +
              "</div>" +
              "</br>" +
              t("termsContentMetaDataModel") +
              "</br>" +
              t("termsContentAttachment"),
          },
        ],
        categories: [
          {
            title: t("How_To_Add_New_Document"),
            categories: [{ ...explination }],
            articles: [
              {
                title: t("whatAboutAddNewDoc"),
                body:
                  t("Documentation_beginnings1") +
                  '<a href="#hello" data-toggle="tooltip"  title=" ' +
                  t("termsContentScannedCopy") +
                  '">' +
                  t("Documentation_beginnings_ScannedCopy") +
                  "</a>" +
                  t("Documentation_beginnings2"),
              },
            ],
          },
        ],
      },
    ],
  };
  return <FAQ json={json} onArticleRating={onArticleRating} />;
}
export default FaqFunction;
