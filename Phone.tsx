import LoadingButton from "@mui/lab/LoadingButton";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { t } from "i18next";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { getUser } from "../../../../public/utils/functions";
import { getUserInfo, updateUserInfo } from "../../../api/userRequests";
import Loader from "../../../components/reusables/Loader";
import { TokenType } from "../../../types";

interface props {
    navigate: () => void;
}

const AddressData: React.FC<props> = ({ navigate }) => {
    const [requestLoading, setRequestLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const token = localStorage.getItem("accessToken");
    const user = getUser(token) as TokenType;
    const id = user?.user_id;

    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ["account", "users", id],
        queryFn: () => getUserInfo(id),
    });

    const schema = z.object({
        phoneNumber: z
            .string()
            .min(6, { message: "Must be 6 or more characters long" })
            .max(15, { message: "Must be 15 characters or less" })
            .regex(/^\+?[0-9]+$/, {
                message: "Only numbers are allowed",
            }),
    });

    const formik = useFormik({
        initialValues: {
            phoneNumber: data?.data.phone || "",
        },
        enableReinitialize: true,
        validationSchema: toFormikValidationSchema(schema),
        onSubmit: async (values) => {
            const info = { phone: values.phoneNumber };
            if (!formik.dirty) {
                navigate();
                return;
            }
            try {
                setRequestLoading(true);
                const response = await updateUserInfo(info, user?.user_id);
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
            }
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center mt-44">
                <Loader isLoading={true}></Loader>
            </div>
        );
    }

    if (error) {
        return <div>Error loading user information.</div>;
    }

    return (
        <div className="w-full  tablet:w-96 p-10 mx-auto my-5 bg-white">
            <p className="mb-5 font-semibold text-gray-700">
                {t("confirmPhone")}
            </p>
            <form onSubmit={formik.handleSubmit}>
                <Box className="flex flex-wrap gap-9">
                    {/* Phone Number */}
                    <FormControl className="flex w-full">
                        <FormLabel htmlFor="phoneNumber">
                            {t("phoneNumber")}
                        </FormLabel>
                        <div className="flex items-center w-full gap-4">
                            <TextField
                                className="w-10/12"
                                required
                                name="phoneNumber"
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
                                    typeof formik.errors.phoneNumber ===
                                        "string"
                                        ? formik.errors.phoneNumber
                                        : ""
                                }
                                color={
                                    formik.errors.phoneNumber
                                        ? "error"
                                        : "primary"
                                }
                            />
                        </div>
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
                        }}
                    >
                        <p className="font-semibold">{t("next")}</p>
                    </Button>
                )}
            </form>
        </div>
    );
};
export default AddressData;
