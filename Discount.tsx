import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import axios from "axios";

// API Base URL
const API_BASE_URL = "http://127.0.0.1:8000/en/api/products/";

const Discount: React.FC = () => {
  // States
  const [promoCode, setPromoCode] = useState("");
  const [promoPercentage, setPromoPercentage] = useState<number | "">("");
  const [promoLimit, setPromoLimit] = useState<number>(250);  // Default usage limit set to 250
  const [expiryDate, setExpiryDate] = useState("");
  const [promoCodes, setPromoCodes] = useState([]);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [errors, setErrors] = useState<any>({});  // Store validation errors

  const getAuthToken = () => {
    return localStorage.getItem("vendorlogin");
  };

  // Promo Code Generator
  const generatePromoCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setPromoCode(code);
  };

  // Handle Promo Code Creation
  const handleGeneratePromoCode = async () => {
    const token = getAuthToken();
    setErrors({}); // Reset errors before making a request

    if (!token) {
      setSnackMessage("Authentication token not found. Please log in.");
      setSnackOpen(true);
      return;
    }

    // Validate form fields
    if (!promoCode) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        code: "Promo Code is required.",
      }));
    }
    if (!promoPercentage) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        discount_percentage: "Discount Percentage is required.",
      }));
    }
    if (!expiryDate) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        expiry_date: "Expiry Date is required.",
      }));
    }

    // If there are errors, stop the request
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Send the POST request to create the promo code
    try {
      const response = await axios.post(
        `${API_BASE_URL}coppun/create/`,
        {
          code: promoCode,
          discount_percentage: promoPercentage,
          usage_limit: promoLimit,
          expiry_date: expiryDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSnackMessage("Promo code created successfully!");
      setSnackOpen(true);
      fetchPromoCodes(); // Refresh the promo codes list
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorData = error.response.data;
        if (errorData.code) {
          setErrors((prevErrors: any) => ({
            ...prevErrors,
            code: "Promo Code already exists.",
          }));
        }
        if (errorData.discount_percentage) {
          setErrors((prevErrors: any) => ({
            ...prevErrors,
            discount_percentage: errorData.discount_percentage[0],
          }));
        }
        if (errorData.expiry_date) {
          setErrors((prevErrors: any) => ({
            ...prevErrors,
            expiry_date: errorData.expiry_date[0],
          }));
        }
        if (errorData.usage_limit) {
          setErrors((prevErrors: any) => ({
            ...prevErrors,
            usage_limit: errorData.usage_limit[0],
          }));
        }
      } else {
        setSnackMessage("Failed to create promo code. Please check the data.");
        setSnackOpen(true);
      }
    }
  };

  // Fetch Promo Codes List
  const fetchPromoCodes = async () => {
    const token = getAuthToken();
    if (!token) {
      setSnackMessage("Authentication token not found. Please log in.");
      setSnackOpen(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}coppun/details/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPromoCodes(response.data);
    } catch (error) {
      setSnackMessage("Failed to fetch promo codes.");
      setSnackOpen(true);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const expiredPromoCodes = promoCodes.filter((promo) => promo.is_expired);
  const validPromoCodes = promoCodes.filter((promo) => !promo.is_expired);

  return (
    <Box sx={{ padding: "30px", backgroundColor: "#f5f7fa", borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom color="primary" textAlign="center">
        Promotions and Discounts
      </Typography>

      <Grid container spacing={3}>
        {/* Generate Promo Code Section */}
        <Grid item xs={12} sm={6}>
          <Card elevation={5} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generate Promo Code
              </Typography>

              <TextField
                label="Promo Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                fullWidth
                sx={{ marginBottom: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={generatePromoCode} edge="end">
                        <AutorenewIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.code}
                helperText={errors.code}
              />

              <TextField
                label="Discount Percentage (EGP)"
                type="number"
                value={promoPercentage}
                onChange={(e) => setPromoPercentage(Number(e.target.value))}
                fullWidth
                sx={{ marginBottom: 2 }}
                error={!!errors.discount_percentage}
                helperText={errors.discount_percentage}
              />

              <TextField
                label="Usage Limit"
                type="number"
                value={promoLimit}
                onChange={(e) => setPromoLimit(Number(e.target.value))}
                fullWidth
                sx={{ marginBottom: 2 }}
                error={!!errors.usage_limit}
                helperText={errors.usage_limit}
                disabled={false}  // Allow users to modify limit if necessary
              />

              <TextField
                label="Expiry Date"
                type="datetime-local"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                fullWidth
                sx={{ marginBottom: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.expiry_date}
                helperText={errors.expiry_date}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleGeneratePromoCode}
                sx={{ marginTop: 2, width: "100%" }}
              >
                Generate Promo Code
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Promo Code Lists Section */}
        <Grid item xs={12} sm={6}>
          {/* Valid Promo Codes Table */}
          <Card elevation={5} sx={{ marginBottom: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Promo Codes
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Discount (EGP)</TableCell>
                    <TableCell>Users Used</TableCell>
                    <TableCell>Remaining Uses</TableCell>
                    <TableCell>Expiry Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {validPromoCodes.map((promo, index) => (
                    <TableRow key={index}>
                      <TableCell>{promo.code}</TableCell>
                      <TableCell>{promo.discount_percentage}</TableCell>
                      <TableCell>{promo.users_used}</TableCell>
                      <TableCell>{promo.remaining_uses}</TableCell>
                      <TableCell>{promo.expiry_date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Expired Promo Codes Table */}
          <Card elevation={5} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Expired Promo Codes
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Discount (EGP)</TableCell>
                    <TableCell>Users Used</TableCell>
                    <TableCell>Remaining Uses</TableCell>
                    <TableCell>Expiry Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expiredPromoCodes.map((promo, index) => (
                    <TableRow key={index}>
                      <TableCell>{promo.code}</TableCell>
                      <TableCell>{promo.discount_percentage}</TableCell>
                      <TableCell>{promo.users_used}</TableCell>
                      <TableCell>{promo.remaining_uses}</TableCell>
                      <TableCell>{promo.expiry_date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert onClose={() => setSnackOpen(false)} severity="info" sx={{ width: "100%" }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Discount;