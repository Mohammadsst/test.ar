// External Libraries
import { useFormik } from "formik";
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

// Local imports
import { Card, SignUpContainer } from "../reusables/CustomMUIComponents";

// Localization
import LoadingButton from "@mui/lab/LoadingButton";
import { t } from "i18next";
import { StepComponentProps, UserData } from "../../types/Vendor";

const AddressData: React.FC<StepComponentProps> = ({
    onNext,
    onPrev,
    setUserData,
    isLoading,
}) => {
    const schema = z.object({
        country: z.string().min(1),
        state: z.string().min(1),
        city: z.string().min(1),
        postalCode: z.string().max(15).min(1),
        address1: z.string().min(1),
        address2: z.string().optional(),
    });

    const formik = useFormik({
        initialValues: {
            country: "",
            state: "",
            city: "",
            postalCode: "",
            address1: "",
            address2: "",
        },
        validationSchema: toFormikValidationSchema(schema),
        onSubmit: async (values) => {
            const final = {
                country: values.country,
                state: values.state,
                city: values.city,
                postal_code: values.postalCode,
                address1: values.address1,
                address2: values.address2,
            };
            console.log("Submitted");
            console.log(final);

            /* @ts-ignore */
            setUserData((prevState: UserData) => {
                const updatedUserData = {
                    ...prevState,
                    address: { ...final },
                };
                // Call onNext with the updated user data
                onNext(); // Pass the complete updated user data here
                return updatedUserData; // Ensure the state is updated
            });
        },
    });

    return (
        <>
            <div className="w-full m-2 mx-auto mt-32 rounded shadow">
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
                                {t("addressInfo")}
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}
                            >
                                {/* Country */}
                                <FormControl>
                                    <FormLabel htmlFor="country">
                                        {t("country")}
                                    </FormLabel>
                                    <TextField
                                        required
                                        fullWidth
                                        name="country"
                                        id="country"
                                        placeholder="Your country"
                                        value={formik.values.country}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.country &&
                                            Boolean(formik.errors.country)
                                        }
                                        helperText={
                                            formik.touched.country &&
                                            formik.errors.country
                                        }
                                        color={
                                            formik.errors.country
                                                ? "error"
                                                : "primary"
                                        }
                                    />
                                </FormControl>

                                {/* State */}
                                <FormControl>
                                    <FormLabel htmlFor="state">
                                        {t("state")}
                                    </FormLabel>
                                    <TextField
                                        required
                                        fullWidth
                                        name="state"
                                        id="state"
                                        placeholder="Your State"
                                        value={formik.values.state}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.state &&
                                            Boolean(formik.errors.state)
                                        }
                                        helperText={
                                            formik.touched.state &&
                                            formik.errors.state
                                        }
                                        color={
                                            formik.errors.state
                                                ? "error"
                                                : "primary"
                                        }
                                    />
                                </FormControl>

                                {/* City */}
                                <FormControl>
                                    <FormLabel htmlFor="city">
                                        {t("city")}
                                    </FormLabel>
                                    <TextField
                                        required
                                        fullWidth
                                        name="city"
                                        id="city"
                                        placeholder="Your City"
                                        value={formik.values.city}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.city &&
                                            Boolean(formik.errors.city)
                                        }
                                        helperText={
                                            formik.touched.city &&
                                            formik.errors.city
                                        }
                                        color={
                                            formik.errors.city
                                                ? "error"
                                                : "primary"
                                        }
                                    />
                                </FormControl>

                                {/* Postal Code */}
                                <FormControl>
                                    <FormLabel htmlFor="postalCode">
                                        {t("postalCode")}
                                    </FormLabel>
                                    <TextField
                                        required
                                        fullWidth
                                        name="postalCode"
                                        id="postalCode"
                                        placeholder="Postal Code"
                                        value={formik.values.postalCode}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.postalCode &&
                                            Boolean(formik.errors.postalCode)
                                        }
                                        helperText={
                                            formik.touched.postalCode &&
                                            formik.errors.postalCode
                                        }
                                        color={
                                            formik.errors.postalCode
                                                ? "error"
                                                : "primary"
                                        }
                                    />
                                </FormControl>

                                {/* Address 1 */}
                                <FormControl>
                                    <FormLabel htmlFor="address1">
                                        {t("address1")}
                                    </FormLabel>
                                    <TextField
                                        required
                                        fullWidth
                                        name="address1"
                                        id="address1"
                                        placeholder="Address Line 1"
                                        value={formik.values.address1}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.address1 &&
                                            Boolean(formik.errors.address1)
                                        }
                                        helperText={
                                            formik.touched.address1 &&
                                            formik.errors.address1
                                        }
                                        color={
                                            formik.errors.address1
                                                ? "error"
                                                : "primary"
                                        }
                                    />
                                </FormControl>

                                {/* Address 2 */}
                                <FormControl>
                                    <FormLabel htmlFor="address2">
                                        {t("address3")}
                                    </FormLabel>
                                    <TextField
                                        fullWidth
                                        name="address2"
                                        id="address2"
                                        placeholder="Work Address"
                                        value={formik.values.address2}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.address2 &&
                                            Boolean(formik.errors.address2)
                                        }
                                        helperText={
                                            formik.touched.address2 &&
                                            formik.errors.address2
                                        }
                                        color={
                                            formik.errors.address2
                                                ? "error"
                                                : "primary"
                                        }
                                    />
                                </FormControl>
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
                                {isLoading ? (
                                    <LoadingButton
                                        loading
                                        loadingIndicator="Loading…"
                                        fullWidth
                                        variant="contained"
                                        sx={{
                                            background: "black",
                                            borderRadius: "7px",
                                            marginTop: "10px",
                                            width: "20%",
                                        }}
                                    >
                                        {t("submit")}
                                    </LoadingButton>
                                ) : (
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
                                        {t("submit")}
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </SignUpContainer>
                </form>
            </div>
        </>
    );
};

export default AddressData;
