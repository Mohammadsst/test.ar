import { GoogleOAuthProvider } from "@react-oauth/google";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

// Material-UI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import Divider from "@mui/material/Divider";

// Local imports
import {
    Card,
    SignUpContainer,
} from "../../../components/reusables/CustomMUIComponents";
import FormDialog from "../../../components/reusables/dialogue";

import countries from "./countries";

// API Requests
import { registerUser } from "../../../api/userRequests";

// Localization
import { t } from "i18next";
import GoogleAuth from "./GoogleAuth"

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [dialogueOpen, setDialogueOpen] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const countryItems = useMemo(
        () =>
            countries.map((country, index) => (
                <MenuItem key={index} value={country.code}>
                    {`${country.code} (${country.name})`}
                </MenuItem>
            )),
        []
    );

    const schema = z
        .object({
            fullname: z
                .string()
                .min(5, { message: "Must be 5 or more characters long" })
                .max(50, { message: "Must be 50 characters long or less" }),
            email: z
                .string()
                .email({ message: "Invalid email address" })
                .min(1, { message: "The Email address is required" }),
            password: z
                .string()
                .min(8, { message: "Must be 8 or more characters long" })
                .max(30, { message: "Must be 30 characters or less" }),
            confirmPassword: z
                .string()
                .min(8, { message: "Must be 8 or more characters long" })
                .max(30, { message: "Must be 30 characters or less" }),
            phoneNumber: z
                .string()
                .min(6, { message: "Must be 6 or more characters long" })
                .max(15, { message: "Must be 15 characters or less" })
                .regex(/^[0-9]+$/, {
                    message: "Only numbers are allowed",
                }),
        })
        .superRefine(({ confirmPassword, password }, ctx) => {
            if (confirmPassword !== password) {
                ctx.addIssue({
                    code: "custom",
                    message: "The passwords did not match",
                    path: ["confirmPassword"],
                });
            }
        });

    const formik = useFormik({
        initialValues: {
            fullname: "",
            email: "",
            password: "",
            confirmPassword: "",
            countryCode: "",
            phoneNumber: "",
        },
        validationSchema: toFormikValidationSchema(schema),
        onSubmit: async (values) => {
            try {
                const final = {
                    email: values.email,
                    full_name: values.fullname,
                    password1: values.password,
                    password2: values.confirmPassword,
                    phone: (values.countryCode + values.phoneNumber).replace(
                        /\s/g,
                        ""
                    ),
                };
                console.log("Submitted");
                console.log(final);
                setRequestLoading(true);
                const response = await registerUser(final);
                console.log(response);

                setRequestLoading(false);
                /* @ts-ignore */

                const statusCode = response?.status;
                if (statusCode == 201) {
                    localStorage.setItem("email", values.email.toLowerCase());
                    setDialogueOpen(true);
                } else if (statusCode == 500) {
                    enqueueSnackbar("An Unexpected error occured", {
                        variant: "error",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right",
                        },
                    });
                } else {
                    /* @ts-ignore */

                    const errors = response.response?.data;
                    Object.keys(errors).forEach((key) => {
                        const value = errors[key];
                        enqueueSnackbar(`${value}`, {
                            variant: "error",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right",
                            },
                        });
                    });
                }
            } catch (error: any) {
                console.log("Unexpected Error occured", error);
                enqueueSnackbar(`An Unexpected error occured`, {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
            }
        },
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    return (
        <>
            <div className="tablet:w-3/5 w-full max-h-fit mx-auto mt-20 mobile:mt-32 rounded-md overflow-hidden desktop:shadow-[0_0_10px_rgba(0,0,0,0.5)] desktop:bg-mainColor flex justify-center align-middle desktop:justify-between">
                <div className="hidden tablet:w-5/6 w-full p-10 py-48 desktop:block">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            color: "white",
                            textAlign: "center",
                            fontWeight: "500",
                            width: "100%",
                            fontSize: "clamp(2rem, 10vw, 2.15rem)",
                            marginBottom: "100px",
                        }}
                    >
                        {t("welcomeHeader")}
                    </Typography>{" "}
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            color: "white",
                            textAlign: "center",
                            width: "100%",
                            marginBottom: "30px",
                            fontSize: "clamp(1rem, 5vw, 1.15rem)",
                        }}
                    >
                        {t("welcomemessage")}
                    </Typography>{" "}
                    <Typography sx={{ textAlign: "center" }}>
                        <span>
                            <NavLink
                                to="/signin"
                                style={{
                                    alignSelf: "center",
                                    marginLeft: "8px",
                                    marginRight: "8px",
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    sx={{
                                        width: "50%",
                                        color: "white",
                                        borderColor: "white",
                                        borderRadius: "25px",
                                    }}
                                >
                                    {t("login")}
                                </Button>
                            </NavLink>
                        </span>
                    </Typography>
                </div>
                <div className="tablet:w-5/6 w-full px-3 tablet:px-0 desktop:w-1/2">
                    <form onSubmit={formik.handleSubmit}>
                        <CssBaseline enableColorScheme />
                        <SignUpContainer
                            direction="column"
                            justifyContent="space-between"
                        >
                            <Card variant="outlined">
                                <Typography
                                    component="h1"
                                    variant="h4"
                                    sx={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        width: "100%",
                                        fontSize: "clamp(2rem, 10vw, 2.15rem)",
                                    }}
                                >
                                    {t("register")}
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 2,
                                    }}
                                >
                                    {/* full name */}
                                    <FormControl>
                                        <FormLabel htmlFor="fullname">
                                            {t("fullName")}
                                        </FormLabel>
                                        <TextField
                                            autoComplete="fullname"
                                            name="fullname"
                                            required
                                            fullWidth
                                            id="fullname"
                                            placeholder="Jon Snow"
                                            onBlur={formik.handleBlur}
                                            value={formik.values.fullname}
                                            onChange={formik.handleChange}
                                            error={
                                                formik.touched.fullname &&
                                                Boolean(formik.errors.fullname)
                                            }
                                            helperText={
                                                formik.touched.fullname &&
                                                formik.errors.fullname
                                            }
                                            color={
                                                formik.errors.fullname
                                                    ? "error"
                                                    : "primary"
                                            }
                                        />
                                    </FormControl>

                                    {/* email */}
                                    <FormControl>
                                        <FormLabel htmlFor="email">
                                            {t("email")}
                                        </FormLabel>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            placeholder="your@email.com"
                                            name="email"
                                            autoComplete="email"
                                            variant="outlined"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.email &&
                                                Boolean(formik.errors.email)
                                            }
                                            helperText={
                                                formik.touched.email &&
                                                formik.errors.email
                                            }
                                            color={
                                                formik.errors.email
                                                    ? "error"
                                                    : "primary"
                                            }
                                        />
                                    </FormControl>

                                    {/* password */}
                                    <FormControl>
                                        <FormLabel htmlFor="password">
                                            {t("password")}
                                        </FormLabel>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            placeholder="••••••"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            id="password"
                                            variant="outlined"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.password &&
                                                Boolean(formik.errors.password)
                                            }
                                            helperText={
                                                formik.touched.password &&
                                                formik.errors.password
                                            }
                                            color={
                                                formik.errors.password
                                                    ? "error"
                                                    : "primary"
                                            }
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() =>
                                                                setShowPassword(
                                                                    (prev) =>
                                                                        !prev
                                                                )
                                                            }
                                                            onMouseDown={(
                                                                event
                                                            ) =>
                                                                event.preventDefault()
                                                            } // Prevent focus loss
                                                        >
                                                            {showPassword ? (
                                                                <Visibility />
                                                            ) : (
                                                                <VisibilityOff />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </FormControl>

                                    {/*Confirm password */}
                                    <FormControl>
                                        <FormLabel htmlFor="confirmPassword">
                                            {t("confirmPassword")}
                                        </FormLabel>
                                        <TextField
                                            required
                                            fullWidth
                                            name="confirmPassword"
                                            placeholder="••••••"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            id="confirmPassword"
                                            autoComplete="new-password"
                                            variant="outlined"
                                            value={
                                                formik.values.confirmPassword
                                            }
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched
                                                    .confirmPassword &&
                                                Boolean(
                                                    formik.errors
                                                        .confirmPassword
                                                )
                                            }
                                            helperText={
                                                formik.touched
                                                    .confirmPassword &&
                                                formik.errors.confirmPassword
                                            }
                                            color={
                                                formik.errors.confirmPassword
                                                    ? "error"
                                                    : "primary"
                                            }
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() =>
                                                                setShowConfirmPassword(
                                                                    (prev) =>
                                                                        !prev
                                                                )
                                                            }
                                                            onMouseDown={(
                                                                event
                                                            ) =>
                                                                event.preventDefault()
                                                            } // Prevent focus loss
                                                        >
                                                            {showConfirmPassword ? (
                                                                <Visibility />
                                                            ) : (
                                                                <VisibilityOff />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </FormControl>

                                    {/* Phone number */}
                                    <FormLabel htmlFor="phoneNumber">
                                        {t("phoneNumber")}
                                    </FormLabel>

                                    {/* country code */}
                                    <div className="flex ">
                                        <FormControl
                                            variant="outlined"
                                            style={{
                                                marginRight: "16px",
                                                minWidth: "120px",
                                            }}
                                        >
                                            <InputLabel id="country-code-label">
                                                {t("countryCode")}
                                            </InputLabel>
                                            <Select
                                                labelId="country-code-label"
                                                id="countryCode"
                                                name="countryCode"
                                                value={
                                                    formik.values.countryCode
                                                }
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={
                                                    formik.touched
                                                        .countryCode &&
                                                    Boolean(
                                                        formik.errors
                                                            .countryCode
                                                    )
                                                }
                                            >
                                                {countryItems}
                                            </Select>
                                        </FormControl>

                                        <TextField
                                            required
                                            name="phoneNumber"
                                            placeholder="111111111"
                                            type="text"
                                            id="phoneNumber"
                                            variant="outlined"
                                            value={formik.values.phoneNumber}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.phoneNumber &&
                                                Boolean(
                                                    formik.errors.phoneNumber
                                                )
                                            }
                                            helperText={
                                                formik.touched.phoneNumber &&
                                                formik.errors.phoneNumber
                                            }
                                            color={
                                                formik.errors.phoneNumber
                                                    ? "error"
                                                    : "primary"
                                            }
                                            fullWidth
                                        />
                                    </div>

                                    {requestLoading ? (
                                        <LoadingButton
                                            loading
                                            loadingIndicator={t("pleaseWait")}
                                            fullWidth
                                            variant="contained"
                                            sx={{
                                                background: "black",
                                                borderRadius: "7px",
                                                marginTop: "10px",
                                            }}
                                        >
                                            {t("register")}
                                        </LoadingButton>
                                    ) : (
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{
                                                background: "black",
                                                borderRadius: "7px",
                                                marginTop: "10px",
                                            }}
                                        >
                                            {t("register")}
                                        </Button>
                                    )}
                                </Box>

                                <Divider>
                                    <Typography
                                        sx={{ color: "text.secondary" }}
                                    >
                                        or
                                    </Typography>
                                </Divider>

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 3,
                                        justifyContent: "center",
                                        paddingBottom: "10px",
                                    }}
                                >
                                    <GoogleOAuthProvider
                                        clientId={
                                            import.meta.env.VITE_CLIENT_ID
                                        }
                                    >
                                     <GoogleAuth/>
                                    </GoogleOAuthProvider>
                                </Box>
                            </Card>
                        </SignUpContainer>
                    </form>
                </div>
            </div>
            <FormDialog
                open={dialogueOpen}
                setOpen={setDialogueOpen}
            ></FormDialog>
        </>
    );
}
