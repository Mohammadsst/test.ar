import Button from "@mui/material/Button";
import { t } from "i18next";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { getUser } from "../../../../public/utils/functions";
import { forgotPassword } from "../../../api/userRequests";
import { TokenType } from "../../../types";
import ConfirmResetOTP from "../../users/SignIn/confirmResetOtp";

export default function ForgotPassword() {
    const [otpOpen, setOtpOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Track loading state
    const { enqueueSnackbar } = useSnackbar();
    const token = localStorage.getItem("accessToken");
    const { email } = getUser(token) as TokenType;
    console.log(email);

    const handleSubmit = async () => {
        setLoading(true); // Start loading
        try {
            const response = await forgotPassword(email.toLowerCase());
            /* @ts-ignore */
            if (response.status === 200) {
                localStorage.setItem("forgotEmail", email.toLowerCase());
                enqueueSnackbar(
                    "An OTP was sent to your email to verify it's you.",
                    {
                        variant: "success",
                        anchorOrigin: { vertical: "top", horizontal: "right" },
                    }
                );
                setOtpOpen(true);
            } else {
                throw new Error(
                    /* @ts-ignore */
                    response.error?.response?.data?.message ||
                        "Unexpected error"
                );
            }
        } catch (error: any) {
            enqueueSnackbar(error.message, {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <>
            <div className="w-full p-10 mx-auto my-5 bg-white">
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{ backgroundColor: "black" }}
                >
                    {t("updatePassword")}
                </Button>
                <ConfirmResetOTP open={otpOpen} setOpen={setOtpOpen} />
            </div>
        </>
    );
}
