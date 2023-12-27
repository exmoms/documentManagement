import { FormHelperText } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
// import { postData } from "../../api/PostData";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  margin: {
    margin: theme.spacing(1),
  },
  textField: {
    width: "100%",
  },
}));

export default function EditUserProfileByAdmin(props) {
  const { t } = useTranslation();
  const classes = useStyles();

  const [email, setemail] = useState("");
  const [tel, settel] = useState("");
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  useEffect(() => {
    if (props.profileData !== null) {
      setemail(props.profileData.email);
      settel(
        props.profileData.phoneNumber === null
          ? ""
          : props.profileData.phoneNumber
      );
    }
  }, [props]);

  const onChange = (event) => {
    if (event.target.name === "edit-profile-by-admin-email") {
      setemail(event.target.value);
    }
    if (event.target.name === "edit-profile-by-admin-tel") {
      settel(event.target.value);
    }
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              value={email}
              onChange={onChange}
              name="edit-profile-by-admin-email"
              label={t("email")}
              type="email"
              id="edit-profile-by-admin-email"
              autoComplete="email"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              value={tel}
              onChange={onChange}
              name="edit-profile-by-admin-tel"
              label={t("phone_number")}
              type="tel"
              id="edit-profile-by-admin-tel"
              autoComplete="tel"
            />
          </Grid>
          <FormControl
            className={clsx(classes.margin, classes.textField)}
            variant="outlined"
          >
            <InputLabel
              error={!!props.errors.newPasswordErrors}
              htmlFor="edit-profile-by-admin-outlined-adornment-password"
            >
              {t("new_password")}
            </InputLabel>
            <OutlinedInput
              error={!!props.errors.newPasswordErrors}
              id="edit-profile-by-admin-outlined-adornment-password"
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                  id="iconButton"
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={120}
            />
            <FormHelperText
              error={!!props.errors.newPasswordErrors}
              id="edit-profile-by-admin-outlined-adornment-password-helper-text"
            >
              {props.errors.newPasswordErrors}
            </FormHelperText>
          </FormControl>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              name="edit-profile-by-admin-confirmPassword"
              label={t("confirmNewPassword_label")}
              type="password"
              error={!!props.errors.confirmErrors}
              helperText={props.errors.confirmErrors}
              id="edit-profile-by-admin-confirmPassword"
              autoComplete="current-password"
            />
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}
