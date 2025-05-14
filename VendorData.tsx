// External Libraries
import { useFormik } from "formik";
import { useMemo, useState } from "react";
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
import {
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";

// Local imports
import { Card, SignUpContainer } from "../reusables/CustomMUIComponents";

import countries from "../../pages/users/SignUp/countries";

// Localization
import { t } from "i18next";
import { StepComponentProps, UserData } from "../../types/Vendor";

const VendorData: React.FC<StepComponentProps> = ({
    onNext,
    onPrev,
    setUserData,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                .max(30, { message: "Must be 30 characters long or less" }),
            email: z
                .string()
                .email({ message: "Invalid Email Address" })
                .min(1, { message: "The Email address is required" }),
            password: z
                .string()
                .min(8, { message: "Must be 8 or more characters long" })
                .max(30, { message: "Must be 30 characters or less" }),
            confirmPassword: z
                .string()
                .min(8, { message: "Must be 8 or more characters long" })
                .max(30, { message: "Must be 30 characters or less" }),
            countryCode: z
                .string()
                .min(1, { message: "You must choose your country code" }),
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
            const final = {
                full_name: values.fullname,
                email: values.email,
                password1: values.password,
                password2: values.confirmPassword,
                phone: (values.countryCode + values.phoneNumber).replace(
                    /\s/g,
                    ""
                ),
            };
            console.log("Submitted");
            console.log(final);
            /* @ts-ignore */
            setUserData((prevState: UserData) => ({
                ...prevState,
                user: { ...final },
            }));

            onNext();
        },
    });

    return (
        <>
            <div className="mx-auto mt-32 rounded shadow max-tablet:w-full">
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
                                {t("PersonalInfo")}
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
                                                            setShowPassword(
                                                                (prev) => !prev
                                                            )
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
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.confirmPassword &&
                                            Boolean(
                                                formik.errors.confirmPassword
                                            )
                                        }
                                        helperText={
                                            formik.touched.confirmPassword &&
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
                                                                (prev) => !prev
                                                            )
                                                        }
                                                        onMouseDown={(event) =>
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
                                            value={formik.values.countryCode}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.countryCode &&
                                                Boolean(
                                                    formik.errors.countryCode
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
                                            Boolean(formik.errors.phoneNumber)
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
                            </Box>
                            <div className="flex justify-between">
                                <Button
                                    variant="contained"
                                    sx={{
                                        background: "black",
                                        borderRadius: "7px",
                                        marginTop: "10px",
                                        width: "20%",
                                    }}
                                    onClick={onPrev}
                                >
                                    {t("previous")}
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        background: "black",
                                        borderRadius: "7px",
                                        marginTop: "10px",
                                        width: "20%",
                                    }}
                                    type="submit"
                                >
                                    {t("next")}
                                </Button>
                            </div>
                        </Card>
                    </SignUpContainer>
                </form>
            </div>
        </>
    );
};
export default VendorData;
