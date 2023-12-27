const CREATE_DOC_STYLES = (theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
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
  label: {
    padding: theme.spacing(3, 0, 5),
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  table: {
    minWidth: 200,
  },
  margin: {
    margin: theme.spacing(2),
    textAlign:"initial"
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  buttonForm: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  buttonTable: {
    marginTop: theme.spacing(0),
    marginLeft: theme.spacing(0),
  },
  docMediaContainer: {
    position: "relative",
    margin: "auto",
    width: "100%",
    maxWidth: "400px",
  },
  media: {
    padding: "5px",
    width: "100%",
    height: "auto",
  },
  deleteImgBtn: {
    position: "absolute",
    top: "90%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    msTransform: "translate(-50%, -50%)",
    backgroundColor: "#555",
    color: "white",
    fontSize: "16px",
    padding: "12px 24px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    textAlign: "center",
  },
  buttonUploadScannedDoc: {
    justifyContent: "center",
  },
});

export default CREATE_DOC_STYLES;
