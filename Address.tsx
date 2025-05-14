// External Libraries
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

// Material-UI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";

// Localization
import LoadingButton from "@mui/lab/LoadingButton";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { getUser } from "../../../../public/utils/functions";
import { getUserInfo, updateUserInfo } from "../../../api/userRequests";
import { TokenType } from "../../../types";

interface AddressDataProps {
    address?: string;
    navigate?: () => void;
}

// Functional component with default props
const AddressData: React.FC<AddressDataProps> = ({
    address = "addressInfo",
    navigate = () => console.log("navigate"),
}) => {
    const [requestLoading, setRequestLoading] = useState(false);
    const token = localStorage.getItem("accessToken");
    const user = getUser(token) as TokenType;
    const id = user?.user_id;

    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ["account", "users", id],
        queryFn: () => getUserInfo(id),
    });

    const schema = z.object({
        country: z.string(),
        state: z.string(),
        city: z.string(),
        postal_code: z.string().max(15),
        address_1: z.string(),
        address_2: z.string(),
    });

    const formik = useFormik({
        initialValues: {
            country: data?.data?.shipping_address?.country || "",
            state: data?.data?.shipping_address?.state || "",
            city: data?.data?.shipping_address?.city || "",
            postal_code: data?.data?.shipping_address?.postal_code || "",
            address_1: data?.data?.shipping_address?.address_1 || "",
            address_2: data?.data?.shipping_address?.address_2 || "",
        },
        validationSchema: toFormikValidationSchema(schema),
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (!formik.dirty) {
                console.log("not dirty");
                navigate && navigate();
                return;
            }
            try {
                setRequestLoading(true);
                const shipping_address = values;
                const response = await updateUserInfo(
                    { shipping_address },
                    user.user_id
                );
                if (response.status === 200) {
                    enqueueSnackbar("Your info updated successfully", {
                        variant: "success",
                        anchorOrigin: { vertical: "top", horizontal: "right" },
                    });
                    refetch();
                } else {
                    enqueueSnackbar("Couldn't update your info", {
                        variant: "error",
                        anchorOrigin: { vertical: "top", horizontal: "right" },
                    });
                }
            } catch (error) {
                console.error(error);
                enqueueSnackbar("An error occurred while updating your info", {
                    variant: "error",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
            } finally {
                setRequestLoading(false);
                navigate && navigate();
            }
        },
    });

    isLoading && <div>Loading</div>;

    error && <div>error</div>;

    return (
        <>
            <div className=" w-full tablet:w-[600px] p-10 mx-auto my-5 bg-white">
                <p className="mb-5 font-semibold text-gray-700">{t(address)}</p>
                <form onSubmit={formik.handleSubmit}>
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
                                    typeof formik.errors.country === "string"
                                        ? formik.errors.country
                                        : ""
                                }
                                color={
                                    formik.errors.country ? "error" : "primary"
                                }
                            />
                        </FormControl>

                        {/* State */}
                        <FormControl>
                            <FormLabel htmlFor="state">{t("state")}</FormLabel>
                            <TextField
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
                                // helperText={formik.touched.state && formik.errors.state}
                                helperText={
                                    formik.touched.state &&
                                    typeof formik.errors.state === "string"
                                        ? formik.errors.state
                                        : ""
                                }
                                color={
                                    formik.errors.state ? "error" : "primary"
                                }
                            />
                        </FormControl>

                        {/* City */}
                        <FormControl>
                            <FormLabel htmlFor="city">{t("city")}</FormLabel>
                            <TextField
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
                                // helperText={formik.touched.city && formik.errors.city}
                                helperText={
                                    formik.touched.city &&
                                    typeof formik.errors.city === "string"
                                        ? formik.errors.city
                                        : ""
                                }
                                color={formik.errors.city ? "error" : "primary"}
                            />
                        </FormControl>

                        {/* Postal Code */}
                        <FormControl>
                            <FormLabel htmlFor="postal_code">
                                {t("postalCode")}
                            </FormLabel>
                            <TextField
                                fullWidth
                                name="postal_code"
                                id="postal_code"
                                placeholder="Postal Code"
                                value={formik.values.postal_code}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.postal_code &&
                                    Boolean(formik.errors.postal_code)
                                }
                                // helperText={
                                //   formik.touched.postal_code && formik.errors.postal_code
                                // }
                                helperText={
                                    formik.touched.postal_code &&
                                    typeof formik.errors.postal_code ===
                                        "string"
                                        ? formik.errors.postal_code
                                        : ""
                                }
                                color={
                                    formik.errors.postal_code
                                        ? "error"
                                        : "primary"
                                }
                            />
                        </FormControl>

                        {/* Address 1 */}
                        <FormControl>
                            <FormLabel htmlFor="address_1">
                                {t("address1")}
                            </FormLabel>
                            <TextField
                                fullWidth
                                name="address_1"
                                id="address_1"
                                placeholder="Address Line 1"
                                value={formik.values.address_1}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.address_1 &&
                                    Boolean(formik.errors.address_1)
                                }
                                // helperText={formik.touched.address_1 && formik.errors.address_1}
                                helperText={
                                    formik.touched.address_1 &&
                                    typeof formik.errors.address_1 === "string"
                                        ? formik.errors.address_1
                                        : ""
                                }
                                color={
                                    formik.errors.address_1
                                        ? "error"
                                        : "primary"
                                }
                            />
                        </FormControl>

                        {/* Address 2 */}
                        <FormControl>
                            <FormLabel htmlFor="address_2">
                                {t("address2")}
                            </FormLabel>
                            <TextField
                                fullWidth
                                name="address_2"
                                id="address_2"
                                placeholder="Notes"
                                value={formik.values.address_2}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.address_2 &&
                                    Boolean(formik.errors.address_2)
                                }
                                // helperText={formik.touched.address_2 && formik.errors.address_2}
                                helperText={
                                    formik.touched.address_2 &&
                                    typeof formik.errors.address_2 === "string"
                                        ? formik.errors.address_2
                                        : ""
                                }
                                color={
                                    formik.errors.address_2
                                        ? "error"
                                        : "primary"
                                }
                            />
                        </FormControl>
                    </Box>
                    {requestLoading ? (
                        <LoadingButton
                            loading
                            loadingIndicator={t("loading")}
                            variant="contained"
                            className="w-1/5"
                            sx={{
                                background: "black",
                                borderRadius: "3px",
                                marginTop: "30px",
                            }}
                        >
                            {t("submit")}
                        </LoadingButton>
                    ) : (
                        <Button
                            type="submit"
                            disabled={!formik.isValid}
                            variant="contained"
                            className="w-1/5"
                            sx={{
                                background: "#c40000",
                                borderRadius: "3px",
                                marginTop: "30px",
                                width: "100px",
                            }}
                        >
                            <p className="font-semibold">
                                {t("updateAddress")}
                            </p>
                        </Button>
                    )}
                </form>
            </div>
        </>
    );
};

export default AddressData;
