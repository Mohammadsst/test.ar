import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";

import React, { useEffect, useState } from "react";
import { getUser } from "../../../../../public/utils/functions";
import axiosInstance from "../../../../api/axiosInstance";
import { getUserOTPRequest } from "../../../../api/userRequests";
import { TokenType } from "../../../../types";
import { useNavigate } from "react-router-dom"; // Use useNavigate in v6
// Get token and user details
const token = localStorage.getItem("vendorlogin");
const user = getUser(token) as TokenType;
const vendorId = user?.user_id;

const Wallet: React.FC = () => {
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requestedAmount, setRequestedAmount] = useState<number | "">("");
    const [error, setError] = useState<string | null>(null);
    const [dialogueOpen, setDialogueOpen] = useState(false);
    const [amountAfterFee, setAmountAfterFee] = useState<number>(0);
    const feePercentage = 2; // Fee percentage

    const { enqueueSnackbar } = useSnackbar();

    // Fetch total balance on component load
    useEffect(() => {
        const fetchTotalRevenue = async () => {
            try {
                const response = await axiosInstance.get(
                    `/dashboard/vendor/${vendorId}/order-summary/`
                );
                setTotalBalance(parseFloat(response.data.total_revenue));
            } catch (error) {
                console.error("Error fetching total revenue:", error);
            }
        };

        fetchTotalRevenue();
    }, []);

    // Open modal for requesting money
    const handleRequestMoneyClick = () => {
        setIsModalOpen(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setRequestedAmount("");
        setError(null);
    };

    // Handle request submission
    const handleRequestSubmit = async () => {
        if (
            typeof requestedAmount === "number" &&
            requestedAmount > 0 &&
            requestedAmount <= totalBalance
        ) {
            const calculatedAmount = requestedAmount;
            setAmountAfterFee(calculatedAmount);

            try {
                const res = await getUserOTPRequest(user.user_id);
                if (res.data.success) {
                    setDialogueOpen(true);
                }
            } catch (error) {
                console.error("Error fetching OTP request:", error);
            }
            handleCloseModal();
        } else {
            setError("Requested amount must be greater than 0 and not exceed the total balance.");
        }
    };

    return (
        <Box sx={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                Wallet
            </Typography>

            {/* Total Balance Summary */}
            <Grid container spacing={3} sx={{ marginBottom: 10 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ backgroundColor: "green", color: "white" }}>
                        <CardContent>
                            <Typography variant="h5">Total Balance</Typography>
                            <Typography variant="h3">
                                {totalBalance.toFixed(2)} EGP
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Request Money Button */}
            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleRequestMoneyClick}
            >
                Request Money
            </Button>

            {/* Request Money Modal */}
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="request-money-modal"
                aria-describedby="modal-to-request-money"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Request Money
                    </Typography>

                    <TextField
                        fullWidth
                        label="Amount to Request"
                        variant="outlined"
                        type="number"
                        value={requestedAmount}
                        onChange={(e) => {
                            setRequestedAmount(Number(e.target.value));
                            setError(null); // Reset error on new input
                        }}
                        sx={{ mb: 2 }}
                    />

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Note: A commission will be deducted from the requested amount.
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleRequestSubmit}
                    >
                        Submit Request
                    </Button>
                </Box>
            </Modal>

            {/* OTP Dialog */}
            <FormDialog
                open={dialogueOpen}
                amountAfterFee={amountAfterFee}
                setOpen={setDialogueOpen}
            />
        </Box>
    );
};

export default Wallet;

function FormDialog({
    open,
    amountAfterFee,
    setOpen,
}: {
    amountAfterFee: number;
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate(); // Use navigate hook instead of history
    const [isSubmitted, setIsSubmitted] = useState(false); // To track if the request is successful

    const handleClose = () => {
        setOpen(false);
    };

    async function handleSubmit(otp: string) {
        try {
            const response = await axiosInstance.post(
                `/account/admin/payout/`,
                {
                    amount: amountAfterFee,
                    otp,
                    vendor_id: user.user_id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            enqueueSnackbar("Request sent successfully", {
                variant: "success",
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });
            setIsSubmitted(true); // Set to true when the request is successful
        } catch (error: any) {
            enqueueSnackbar(
                error.response?.data?.error || "Failed to process request",
                { variant: "error", anchorOrigin: { vertical: "top", horizontal: "right" } }
            );
        }
    }

    const handleRedirect = () => {
        // Close the dialog before navigating
        setOpen(false);

        // Use navigate to redirect to the wallet page
        navigate("/wallet"); // Ensure this path matches your route
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                component: "form",
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const otp = formData.get("otp") as string;
                    handleSubmit(otp);
                },
            }}
        >
            <DialogTitle>Confirm Request Money </DialogTitle>
            <DialogContent>
                {isSubmitted ? (
                    // Success Message
                    <Box sx={{ textAlign: "center", padding: "20px" }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Request Sent to Admin Successfully!
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleRedirect}>
                            Return to Wallet
                        </Button>
                    </Box>
                ) : (
                    // OTP Input Form
                    <>
                        <DialogContentText>Enter the OTP sent to your email or phone.</DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="otp"
                            name="otp"
                            label="OTP"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                    </>
                )}
            </DialogContent>
            {!isSubmitted && (
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Confirm</Button>
                </DialogActions>
            )}
        </Dialog>
    );
}