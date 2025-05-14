// import {
//     Avatar,
//     Box,
//     Card,
//     CardContent,
//     Divider,
//     Grid,
//     Typography
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import { getUser } from "../../../../../public/utils/functions";
// import { TokenType } from "../../../../types";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@mui/material";

// interface AddressType {
//     id: number;
//     country: string;
//     state?: string;
//     city: string;
//     postal_code?: string;
//     address_1?: string;
//     address_2?: string;
// }

// const Profile: React.FC = () => {
//     const [user, setUser] = useState<TokenType & { profile_picture?: string; address?: AddressType } | null>(null);

//     useEffect(() => {
//         const token = localStorage.getItem("vendorlogin");

//         if (token) {
//             const decodedUser = getUser(token) as TokenType;

//             const fullName = localStorage.getItem("vendorFullName") || "Vendor";
//             const email = localStorage.getItem("vendorEmail") || "No Email";
//             const profilePicture = localStorage.getItem("vendorProfilePic") || "/static/images/avatar/default.jpg";
//             const addressData = localStorage.getItem("vendorAddress");
//             const phone = localStorage.getItem("vendorPhone");

//             const address: AddressType | null = addressData ? JSON.parse(addressData) : null;

//             setUser({
//                 ...decodedUser,
//                 full_name: fullName,
//                 email: email,
//                 profile_picture: profilePicture,
//                 address: address ?? undefined,
//                 phone: phone
//             });
//         }
//     }, []);
//     const navigate = useNavigate();

//     const handleResetPassword = () => {
//         navigate("/vendor-reset-password"); // 🔁 update route if needed
//     };

//     return (
//         <Box
//             sx={{
//                 backgroundColor: "#f9fafb",
//                 minHeight: "100vh",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 padding: 4,
//             }}
//         >
//             <Card
//                 sx={{
//                     backgroundColor: "#fff",
//                     borderRadius: 4,
//                     boxShadow: "0px 8px 16px rgba(0,0,0,0.1)",
//                     padding: 4,
//                     width: "100%",
//                     maxWidth: 600,
//                     textAlign: "center",
//                 }}
//             >
//                 <CardContent>
//                     <Avatar
//                         alt={user?.full_name || "Vendor"}
//                         src={user?.profile_picture}
//                         sx={{
//                             width: 120,
//                             height: 120,
//                             margin: "0 auto",
//                             border: "4px solid #e0e0e0",
//                             mb: 2,
//                         }}
//                     />
//                     <Typography variant="h5" fontWeight={700} color="primary.main">
//                         {user?.full_name || "Vendor"}
//                     </Typography>
//                     <Typography variant="subtitle2" color="text.secondary" mb={2}>
//                         Vendor Profile
//                     </Typography>

//                     <Divider sx={{ my: 3 }} />

//                     <Grid container spacing={2}>
//                         <Grid item xs={12}>
//                             <Typography variant="body1" fontWeight={500}>
//                                 📧 Email:
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary">
//                                 {user?.email || "Not available"}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Typography variant="body1" fontWeight={500}>
//                                 phoneNumber:
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary">
//                                 {user?.phone || "Not available"}
//                             </Typography>
//                         </Grid>

//                         <Grid item xs={12}>
//                             <Typography variant="body1" fontWeight={500}>
//                                 📍 Address:
//                             </Typography>
//                             {user?.address ? (
//                                 <Typography variant="body2" color="text.secondary">
//                                     {user.address.address_1 && `${user.address.address_1}, `}
//                                     {user.address.city}, {user.address.country}
//                                     {user.address.postal_code && ` - ${user.address.postal_code}`}
//                                 </Typography>
//                             ) : (
//                                 <Typography variant="body2" color="text.disabled">
//                                     No address available
//                                 </Typography>
//                             )}
//                         </Grid>
//                     </Grid>
//                     <Button
//     variant="outlined"
//     color="primary"
//     onClick={handleResetPassword}
//     sx={{ mt: 4 }}
// >
//     Reset Password
// </Button>
//                 </CardContent>
//             </Card>
//         </Box>
//     );
// };

// export default Profile;

// import {
//     Avatar,
//     Box,
//     Card,
//     CardContent,
//     Divider,
//     Grid,
//     Typography,
//     Button,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import { getUser } from "../../../../../public/utils/functions";
// import { TokenType } from "../../../../types";
// import { forgotPassword } from "../../../../api/userRequests";
// import { useSnackbar } from "notistack";
// import ConfirmResetOTP from "../../../../pages/users/SignIn/confirmResetOtp";

// interface AddressType {
//     id: number;
//     country: string;
//     state?: string;
//     city: string;
//     postal_code?: string;
//     address_1?: string;
//     address_2?: string;
// }

// const Profile: React.FC = () => {
//     const [user, setUser] = useState<TokenType & { profile_picture?: string; address?: AddressType } | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [otpOpen, setOtpOpen] = useState(false);
//     const { enqueueSnackbar } = useSnackbar();

//     useEffect(() => {
//         const token = localStorage.getItem("vendorlogin");

//         if (token) {
//             const decodedUser = getUser(token) as TokenType;

//             const fullName = localStorage.getItem("vendorFullName") || "Vendor";
//             const email = localStorage.getItem("vendorEmail") || "No Email";
//             const profilePicture = localStorage.getItem("vendorProfilePic") || "/static/images/avatar/default.jpg";
//             const addressData = localStorage.getItem("vendorAddress");
//             const phone = localStorage.getItem("vendorPhone");

//             const address: AddressType | null = addressData ? JSON.parse(addressData) : null;

//             setUser({
//                 ...decodedUser,
//                 full_name: fullName,
//                 email: email,
//                 profile_picture: profilePicture,
//                 address: address ?? undefined,
//                 phone: phone
//             });
//         }
//     }, []);

//     const handleResetPassword = async () => {
//         const email = localStorage.getItem("vendorEmail");
//         if (!email) {
//             enqueueSnackbar("Vendor email not found", { variant: "error" });
//             return;
//         }

//         setLoading(true);
//         try {
//             const response = await forgotPassword(email.toLowerCase());

//             if (response.status === 200) {
//                 localStorage.setItem("forgotEmail", email.toLowerCase());
//                 enqueueSnackbar("An OTP was sent to your email", { variant: "success" });
//                 setOtpOpen(true);
//             } else {
//                 throw new Error(response?.error?.response?.data?.message || "Unexpected error");
//             }
//         } catch (error: any) {
//             enqueueSnackbar(error.message, { variant: "error" });
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box
//             sx={{
//                 backgroundColor: "#f9fafb",
//                 minHeight: "100vh",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 padding: 4,
//             }}
//         >
//             <Card
//                 sx={{
//                     backgroundColor: "#fff",
//                     borderRadius: 4,
//                     boxShadow: "0px 8px 16px rgba(0,0,0,0.1)",
//                     padding: 4,
//                     width: "100%",
//                     maxWidth: 600,
//                     textAlign: "center",
//                 }}
//             >
//                 <CardContent>
//                     <Avatar
//                         alt={user?.full_name || "Vendor"}
//                         src={user?.profile_picture}
//                         sx={{
//                             width: 120,
//                             height: 120,
//                             margin: "0 auto",
//                             border: "4px solid #e0e0e0",
//                             mb: 2,
//                         }}
//                     />
//                     <Typography variant="h5" fontWeight={700} color="primary.main">
//                         {user?.full_name || "Vendor"}
//                     </Typography>
//                     <Typography variant="subtitle2" color="text.secondary" mb={2}>
//                         Vendor Profile
//                     </Typography>

//                     <Divider sx={{ my: 3 }} />

//                     <Grid container spacing={2}>
//                         <Grid item xs={12}>
//                             <Typography variant="body1" fontWeight={500}>
//                                 📧 Email:
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary">
//                                 {user?.email || "Not available"}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Typography variant="body1" fontWeight={500}>
//                                 📞 Phone:
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary">
//                                 {user?.phone || "Not available"}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Typography variant="body1" fontWeight={500}>
//                                 📍 Address:
//                             </Typography>
//                             {user?.address ? (
//                                 <Typography variant="body2" color="text.secondary">
//                                     {user.address.address_1 && `${user.address.address_1}, `}
//                                     {user.address.city}, {user.address.country}
//                                     {user.address.postal_code && ` - ${user.address.postal_code}`}
//                                 </Typography>
//                             ) : (
//                                 <Typography variant="body2" color="text.disabled">
//                                     No address available
//                                 </Typography>
//                             )}
//                         </Grid>
//                     </Grid>

//                     <Button
//                         variant="outlined"
//                         color="primary"
//                         onClick={handleResetPassword}
//                         sx={{ mt: 4 }}
//                         disabled={loading}
//                     >
//                         Reset Password
//                     </Button>
//                 </CardContent>
//             </Card>

//             <ConfirmResetOTP open={otpOpen} setOpen={setOtpOpen} />
//         </Box>
//     );
// };

// export default Profile;
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    Typography,
    Button,
    useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getUser } from "../../../../../public/utils/functions";
import { TokenType } from "../../../../types";
import { forgotPassword } from "../../../../api/userRequests";
import { useSnackbar } from "notistack";
import ConfirmResetOTP from "../LoginVendor/confirmResetOtp";

interface AddressType {
    id: number;
    country: string;
    state?: string;
    city: string;
    postal_code?: string;
    address_1?: string;
    address_2?: string;
}

const Profile: React.FC = () => {
    const [user, setUser] = useState<TokenType & { profile_picture?: string; address?: AddressType } | null>(null);
    const [loading, setLoading] = useState(false);
    const [otpOpen, setOtpOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();

    useEffect(() => {
        const token = localStorage.getItem("vendorlogin");

        if (token) {
            const decodedUser = getUser(token) as TokenType;

            const fullName = localStorage.getItem("vendorFullName") || "Vendor";
            const email = localStorage.getItem("vendorEmail") || "No Email";
            const profilePicture = localStorage.getItem("vendorProfilePic") || "/static/images/avatar/default.jpg";
            const addressData = localStorage.getItem("vendorAddress");
            const phone = localStorage.getItem("vendorPhone");
            const address: AddressType | null = addressData ? JSON.parse(addressData) : null;

            setUser({
                ...decodedUser,
                full_name: fullName,
                email: email,
                profile_picture: profilePicture,
                address: address ?? undefined,
                phone: phone
            });
        }
    }, []);

    const handleResetPassword = async () => {
        const email = localStorage.getItem("vendorEmail");
        if (!email) {
            enqueueSnackbar("Vendor email not found", { variant: "error" });
            return;
        }

        setLoading(true);
        try {
            const response = await forgotPassword(email.toLowerCase());

            if (response.status === 200) {
                localStorage.setItem("forgotEmail", email.toLowerCase());
                enqueueSnackbar("An OTP was sent to your email", { variant: "success" });
                setOtpOpen(true);
            } else {
                throw new Error(response?.error?.response?.data?.message || "Unexpected error");
            }
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.mode === "light" ? "#f9fafb" : "#121212",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 4,
            }}
        >
            <Card
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 4,
                    boxShadow: theme.shadows[6],
                    padding: 4,
                    width: "100%",
                    maxWidth: 600,
                    textAlign: "center",
                }}
            >
                <CardContent>
                    <Avatar
                        alt={user?.full_name || "Vendor"}
                        src={user?.profile_picture}
                        sx={{
                            width: 120,
                            height: 120,
                            margin: "0 auto",
                            border: `4px solid ${theme.palette.divider}`,
                            mb: 2,
                        }}
                    />
                    <Typography variant="h5" fontWeight={700} color="primary">
                        {user?.full_name || "Vendor"}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" mb={2}>
                        Vendor Profile
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="body1" fontWeight={600}>
                                📧 Email:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user?.email || "Not available"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="body1" fontWeight={600}>
                                📞 Phone:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user?.phone || "Not available"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="body1" fontWeight={600}>
                                📍 Address:
                            </Typography>
                            {user?.address ? (
                                <Typography variant="body2" color="text.secondary">
                                    {user.address.address_1 && `${user.address.address_1}, `}
                                    {user.address.city}, {user.address.country}
                                    {user.address.postal_code && ` - ${user.address.postal_code}`}
                                </Typography>
                            ) : (
                                <Typography variant="body2" color="text.disabled">
                                    No address available
                                </Typography>
                            )}
                        </Grid>
                    </Grid>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleResetPassword}
                        sx={{
                            mt: 4,
                            textTransform: "none",
                            fontWeight: 600,
                            boxShadow: "none",
                            ":hover": {
                                boxShadow: "0 0 8px rgba(0,0,0,0.2)",
                            },
                        }}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Reset Password"}
                    </Button>
                </CardContent>
            </Card>

            <ConfirmResetOTP open={otpOpen} setOpen={setOtpOpen} />
        </Box>
    );
};

export default Profile;
