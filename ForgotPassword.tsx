import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { forgotPassword } from "../../../../api/userRequests";
import ConfirmResetOTP from "./confirmResetOtp";

interface ForgotPasswordProps {
    open: boolean;
    handleClose: () => void;
}

export default function ForgotPassword({
    open,
    handleClose,
}: ForgotPasswordProps) {
    const [otpOpen, setOtpOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Track loading state
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async (email: string) => {
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
                handleClose();
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
            {/* <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: "form",
                    onSubmit: async (
                        event: React.FormEvent<HTMLFormElement>
                    ) => {
                        event.preventDefault();
                        event.stopPropagation();
                        const formData = new FormData(event.currentTarget);
                        const { email } = Object.fromEntries(
                            formData.entries()
                        ) as {
                            email: string;
                        };
                        await handleSubmit(email);
                    },
                }}
            >
                <DialogTitle>ResetPassword</DialogTitle>
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: "100%",
                    }}
                >
                    <DialogContentText>
                        Enter Email To Send OTP
                    </DialogContentText>
                    <OutlinedInput
                        autoFocus
                        required
                        id="email"
                        name="email"
                        placeholder="Email address"
                        type="email"
                        fullWidth
                        disabled={loading}
                    />
                </DialogContent>
                <DialogActions sx={{ pb: 3, px: 3, gap: 3 }}>
                    <Button
                        onClick={handleClose}
                        disabled={loading}
                        sx={{ color: "black" }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={loading}
                        sx={{ backgroundColor: "black" }}
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog> */}
            <Dialog
  open={open}
  onClose={handleClose}
  PaperProps={{
    component: "form",
    onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const formData = new FormData(event.currentTarget);
      const { email } = Object.fromEntries(formData.entries()) as { email: string };
      await handleSubmit(email);
    },
    sx: {
      borderRadius: "16px",
      p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
      boxShadow: 24,
      width: { xs: "90%", sm: "80%", md: "400px" },
      animation: "fadeIn 0.3s ease-in-out",
      "@keyframes fadeIn": {
        from: { opacity: 0, transform: "translateY(-20px)" },
        to: { opacity: 1, transform: "translateY(0)" },
      },
    },
  }}
>
  <DialogTitle
    sx={{
      textAlign: "center",
      fontSize: { xs: "1.25rem", md: "1.5rem" },
      fontWeight: 600,
      color: "#333",
    }}
  >
    Reset Password
  </DialogTitle>
  <DialogContent
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      width: "100%",
      mt: 1,
    }}
  >
    <DialogContentText
      sx={{
        textAlign: "center",
        color: "#666",
        fontSize: { xs: "0.875rem", md: "1rem" },
      }}
    >
      Enter your email to receive a one-time password (OTP).
    </DialogContentText>
    <OutlinedInput
      autoFocus
      required
      id="email"
      name="email"
      placeholder="Email address"
      type="email"
      fullWidth
      disabled={loading}
      sx={{
        borderRadius: "8px",
        backgroundColor: "#fafafa",
        fontSize: { xs: "0.875rem", md: "1rem" },
      }}
    />
  </DialogContent>
  <DialogActions
    sx={{
      pb: { xs: 2, md: 3 },
      px: { xs: 2, md: 3 },
      justifyContent: "center",
      gap: 2,
    }}
  >
    <Button
      onClick={handleClose}
      disabled={loading}
      variant="outlined"
      sx={{
        color: "#555",
        textTransform: "none",
        fontWeight: 500,
        borderColor: "#ccc",
        fontSize: { xs: "0.75rem", md: "0.875rem" },
      }}
    >
      Cancel
    </Button>
    <Button
      variant="contained"
      type="submit"
      disabled={loading}
      sx={{
        backgroundColor: "#3b82f6",
        color: "#fff",
        textTransform: "none",
        fontWeight: 500,
        fontSize: { xs: "0.75rem", md: "0.875rem" },
        "&:hover": {
          backgroundColor: "#333",
        },
      }}
    >
      Continue
    </Button>
  </DialogActions>
</Dialog>

            <ConfirmResetOTP open={otpOpen} setOpen={setOtpOpen} />
        </>
    );
}
