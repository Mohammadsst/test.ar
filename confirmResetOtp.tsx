import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import * as React from "react";
// import { t } from "i18next";
import { useSnackbar } from "notistack";
import { verifyResetOTP } from "../../../../api/userRequests";
import NewPassword from "../../../../components/reusables/newPassword";
import { confirmResetOTPparams } from "../../../../types";

export default function ConfirmResetOTP({
    open,
    setOpen,
}: confirmResetOTPparams) {
    const { enqueueSnackbar } = useSnackbar();
    const [resetPasswordDialogueOpen, setResetPasswordDialogueOpen] =
        React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };
    const [loading, setLoading] = React.useState(false);

    async function handleSubmit(otp: number) {
        try {
            setLoading(true);
            const response = await verifyResetOTP(otp);
            console.log(response);
            /* @ts-ignore */
            if (response.status == 200) {
                enqueueSnackbar("OTP verified! password reset successfully.", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
                setResetPasswordDialogueOpen(true);
                handleClose();
            } else {
                enqueueSnackbar("Invalid OTP", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
            }
        } catch (error: any) {
            console.log(error);
            enqueueSnackbar(
                error.response?.data?.message ||
                    "Failed to verify OTP. Please try again.",
                {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                }
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <React.Fragment>
            {/* <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: "form",
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        event.stopPropagation();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(
                            (formData as any).entries()
                        );
                        const otp = formJson.otp;
                        console.log(otp);
                        handleSubmit(otp);
                    },
                }}
            >
                <DialogTitle>Email Reset Confirmation</DialogTitle>
                <DialogContent sx={{ width: "30vw", padding: "20px" }}>
                    <DialogContentText>
                        Enter OTP to reset password
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="otp"
                        name="otp"
                        label="Enter OTP"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions className="gap-3">
                    <Button onClick={handleClose} sx={{ color: "black" }}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        sx={{ backgroundColor: "black", color: "white" }}
                    >
                        Confirm OTP
                    </Button>
                </DialogActions>
            </Dialog> */}
            <Dialog
  open={open}
  onClose={handleClose}
  PaperProps={{
    component: "form",
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries(formData.entries());
      const otp = formJson.otp;
      console.log(otp);
      handleSubmit(otp);
    },
    sx: {
      borderRadius: "16px",
      p: { xs: 2, sm: 3, md: 4 },
      width: { xs: "90%", sm: "80%", md: "30vw" },
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
    Email Reset Confirmation
  </DialogTitle>
  <DialogContent
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      width: "100%",
      p: { xs: 2, sm: 3, md: 4 },
    }}
  >
    <DialogContentText
      sx={{
        textAlign: "center",
        color: "#666",
        fontSize: { xs: "0.875rem", md: "1rem" },
      }}
    >
      Enter OTP to reset password
    </DialogContentText>
    <TextField
      autoFocus
      required
      margin="dense"
      id="otp"
      name="otp"
      label="Enter OTP"
      type="text"
      fullWidth
      variant="standard"
    />
  </DialogContent>
  <DialogActions
    sx={{
      justifyContent: "center",
      gap: { xs: 1, md: 3 },
      pb: { xs: 2, md: 3 },
      px: { xs: 2, md: 3 },
    }}
  >
    <Button
      onClick={handleClose}
      sx={{
        color: "#555",
        textTransform: "none",
        fontWeight: 500,
        fontSize: { xs: "0.75rem", md: "0.875rem" },
        borderColor: "#ccc",
      }}
    >
      Cancel
    </Button>
    <Button
      type="submit"
      disabled={loading}
      sx={{
        backgroundColor: "#3B82F6", // Tailwind blue-500
        color: "#fff",
        textTransform: "none",
        fontWeight: 500,
        fontSize: { xs: "0.75rem", md: "0.875rem" },
        "&:hover": {
          backgroundColor: "#2563EB", // Tailwind blue-600
        },
      }}
    >
      Confirm OTP
    </Button>
  </DialogActions>
</Dialog>

            <NewPassword
                open={resetPasswordDialogueOpen}
                setOpen={setResetPasswordDialogueOpen}
            ></NewPassword>
        </React.Fragment>
    );
}
