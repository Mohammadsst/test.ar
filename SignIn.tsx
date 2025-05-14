import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import ForgotPassword from "./ForgotPassword";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import { t } from "i18next";
import { useSnackbar } from "notistack";
import { selectUserStatus, signIn } from "../../../redux/slices/userSlice";

import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import {
    Card,
    SignUpContainer as SignInContainer,
} from "../../../components/reusables/CustomMUIComponents";
import { TransitionsModal } from "../../../components/reusables/PopUpModal";
import FormDialog from "../../../components/reusables/dialogue";
import GoogleAuth from "../SignUp/GoogleAuth";
interface loginFormData {
    email: string;
    password: string;
}

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [dialogueOpen, setDialogueOpen] = useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const status = useSelector(selectUserStatus);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (values: loginFormData) => {
        try {
            const data = {
                ...values,
                email: values.email.toLowerCase(), // Normalize email to lowercase
            };

            console.log("Submitting data:", data);
            /* @ts-ignore */

            const response = await dispatch(signIn(data));
            console.log("Response from signIn:", response);

            if (signIn.fulfilled.match(response)) {
                enqueueSnackbar("Logged In successfully", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
                navigate("/", { replace: true });
            } else if (signIn.rejected.match(response)) {
                /* @ts-ignore */
                const status = response.payload?.status;

                switch (status) {
                    case 401:
                        enqueueSnackbar(`${t("invalidCredentials")}`, {
                            variant: "error",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right",
                            },
                        });
                        break;
                    case 403:
                        /* @ts-ignore */
                        handleInactiveAccount(response.payload.message);
                        break;
                    case 404:
                        enqueueSnackbar("User Not Found", {
                            variant: "error",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right",
                            },
                        });
                        break;
                    default:
                        enqueueSnackbar("Unexpected error occurred", {
                            variant: "error",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right",
                            },
                        });
                }
            }
        } catch (error: any) {
            enqueueSnackbar(
                `${
                    error?.response?.data?.detail ||
                    "Unexpected error occurred, please try again in a few minutes."
                }`,
                {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                }
            );
        }
    };

    const handleInactiveAccount = (message: string) => {
        if (
            message ===
            "Your vendor account is not verified yet. Please wait while we review your documents for verification."
        ) {
            enqueueSnackbar("Inactive vendor account", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            });
            setModalOpen(true);
        } else {
            setDialogueOpen(true);
            enqueueSnackbar("Inactive user account", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            });
        }
    };

    const schema = z.object({
        email: z
            .string()
            .email({ message: "Invalid email address" })
            .min(1, { message: "The Email address is required" }),
        password: z.string().min(1, { message: "The password is required" }),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: toFormikValidationSchema(schema),
        onSubmit: async (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="tablet:w-3/5 w-full max-h-fit mx-auto mt-20 mobile:mt-32 rounded-md overflow-hidden desktop:shadow-[0_0_10px_rgba(0,0,0,0.5)] desktop:bg-mainColor flex justify-center align-middle desktop:justify-between">
            <div className="tablet:w-5/6 w-full px-3 tablet:px-0 desktop:w-1/2">
                <form onSubmit={formik.handleSubmit}>
                    <SignInContainer
                        direction="column"
                        justifyContent="space-between"
                        className="!h-full"
                    >
                        <Card variant="outlined">
                            <Typography
                                component="h1"
                                variant="h4"
                                sx={{
                                    width: "100%",
                                    fontSize: "clamp(2rem, 10vw, 2.15rem)",
                                }}
                            >
                                {t("login")}
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "100%",
                                    gap: 2,
                                }}
                            >
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
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <FormLabel htmlFor="password">
                                            {t("password")}
                                        </FormLabel>
                                        <Link
                                            component="button"
                                            type="button"
                                            onClick={handleClickOpen}
                                            variant="body2"
                                            sx={{
                                                alignSelf: "baseline",
                                                color: "black",
                                            }}
                                        >
                                            {t("forgotPassword")}
                                        </Link>
                                    </Box>
                                    <TextField
                                        fullWidth
                                        name="password"
                                        placeholder="••••••"
                                        type={
                                            showPassword ? "text" : "password"
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
                                                            handleClickShowPassword()
                                                        }
                                                        onMouseDown={(event) =>
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

                                {status == "loading" ? (
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
                                        {t("login")}
                                    </LoadingButton>
                                ) : (
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{
                                            background: "black",
                                            borderRadius: "10px",
                                        }}
                                    >
                                        {t("login")}
                                    </Button>
                                )}
                            </Box>
                            <Divider>
                                <Typography sx={{ color: "text.secondary" }}>
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
                               <GoogleAuth/>
                            </Box>
                        </Card>
                    </SignInContainer>
                    <ForgotPassword open={open} handleClose={handleClose} />
                </form>
            </div>
            <div className="hidden w-1/2 p-10 pt-20 desktop:block">
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
                    {t("NewComerMessage")}
                </Typography>{" "}
                <Typography sx={{ textAlign: "center" }}>
                    <span>
                        <NavLink
                            to="/signup"
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
                                {t("register")}
                            </Button>
                        </NavLink>
                    </span>
                </Typography>
            </div>
            <TransitionsModal
                open={modalOpen}
                setOpen={setModalOpen}
                dialogueText={t("accountUnderReview")}
            ></TransitionsModal>
            <FormDialog
                open={dialogueOpen}
                setOpen={setDialogueOpen}
            ></FormDialog>
        </div>
    );
}
