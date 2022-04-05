import { useEffect, useState, memo } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { Formik } from "formik";
import { useSelector, useDispatch, batch } from "react-redux";
import {
  Box,
  Button,
  Container,
  Stack,
  Alert,
  Link,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import { unsetErr, unsetStatus } from "src/actions/errors";
import { login } from "src/actions/auth";
import ShowFeedback from "src/utils/ShowFeedback";
import useShowFeedback from "src/utils/ShowFeedback/useShowFeedback";
import { AuthService } from "src/api/AuthService";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, err, loading } = useSelector((state) => state.app);
  const [formAlert, setFormAlert] = useState(false);
  const { alertOpen, msg, errAlertOpen, errMsg, severity, close } =
    useShowFeedback();
  let count = 0;
  let timeout;

  useEffect(() => {
    return () => {
      batch(() => {
        dispatch(unsetErr());
        dispatch(unsetStatus());
      });
    };
  }, []);
  useEffect(() => {
    if (status?.info?.severity) {
      setFormAlert(true);
    }
    if (status?.info?.code === "userlogin") {
      const token = status.payload.token;
      const user = status.payload.user;
      AuthService.setToken(token);
      AuthService.setAuthenticatedUser(user);
      timeout && clearTimeout();
      timeout = setTimeout(() => {
        navigate("/app/dashboard", { replace: true });
      }, 5000);
    }
  }, [status]);
  useEffect(() => {
    if (err.length > 0) {
      setFormAlert(true);
    }
  }, [err]);

  //form control
  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Must be a valid email")
      .max(255)
      .required("Email is required"),
    password: Yup.string().max(255).required("Password is required"),
  });

  return (
    <>
      <Helmet>
        <title>Login | Jumbobids</title>
      </Helmet>
      <ShowFeedback
        alertOpen={alertOpen}
        close={close}
        severity={severity}
        msg={msg}
      />
      {errMsg.map((error) => (
        <ShowFeedback
          key={++count}
          alertOpen={errAlertOpen}
          close={close}
          severity={severity}
          msg={error.msg}
          title="Ooops!"
        />
      ))}
      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          // height: '100%',
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm"  style={{ marginTop:'80px' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              batch(() => {
                dispatch(unsetErr());
                dispatch(unsetStatus());
              });
              dispatch(login(values));
              actions.setSubmitting(loading);
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  
                  <Typography align="center" color="textPrimary" gutterBottom variant="h1" style={{ textShadow: '0 0 24px #222',fontSize: '40px',fontWeight:900, textTransform: 'uppercase', padding:'5px' }}>
                    Welcome to Jumbobids
                  </Typography>
                  <Typography align="center" color="textPrimary" gutterBottom variant="h2">
                    Sign in
                  </Typography>
                </Box>
                {/*
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <Button
                      color="primary"
                      fullWidth
                      startIcon={<FacebookIcon />}
                      onClick={handleSubmit}
                      size="large"
                      variant="contained"
                    >
                      Login with Facebook
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <Button
                      fullWidth
                      startIcon={<GoogleIcon />}
                      onClick={handleSubmit}
                      size="large"
                      variant="contained"
                    >
                      Login with Google
                    </Button>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    pb: 1,
                    pt: 3
                  }}
                >
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="body1"
                  >
                    or login with email address
                  </Typography>
                </Box> */}
                {Boolean(status?.info?.message) && formAlert && (
                  <Box sx={{ width: "100%", paddingInline: "10px" }}>
                    <Stack sx={{ width: "100%" }} spacing={2}>
                      <Alert
                        severity={status.info.severity}
                        onClose={() => setFormAlert(false)}
                      >
                        {status.info.message}
                      </Alert>
                    </Stack>
                  </Box>
                )}
                {err.length > 0 &&
                  formAlert &&
                  err.map((error) => (
                    <Box sx={{ width: "100%", paddingInline: "10px" }}>
                      <Stack sx={{ width: "100%" }} spacing={2}>
                        <Alert
                          severity="error"
                          onClose={() => setFormAlert(false)}
                        >
                          {error.msg}
                        </Alert>
                      </Stack>
                    </Box>
                  ))}
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <Typography
                  variant="caption"
                  sx={{
                    display: 'grid',
                    justifyItems: 'end',
                    color: 'text.secondary',
                  }}
                >
                  <Link
                    component={RouterLink}
                    to="/forgotpassword"
                    underline="hover"
                  >
                    Forgot password?
                  </Link>
                </Typography>
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  sx={{
                    mt: 0
                  }}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    {loading ? (
                      <CircularProgress style={{ color: "white" }} />
                    ) : (
                      "Sign in now"
                    )}
                  </Button>
                </Box>
                {/* <Typography color="textSecondary" variant="body1">
                  Don&apos;t have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="h6"
                    underline="hover"
                  >
                    Sign up
                  </Link>
                </Typography> */}
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default memo(Login);
