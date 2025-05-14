import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Chip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getUser } from "../../../../../public/utils/functions";
import axiosInstance from "../../../../api/axiosInstance";
import { TokenType } from "../../../../types";

interface OrderRow {
  id: string;
  customerName: string;
  productDetails: string; // Product names with quantity (if more than one)
  orderDate: string;
  totalPrice: string;
  totalQuantity: number; // Total quantity of all products in the order
  isPaid: boolean;
}

const OrdersDashboard = () => {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);

  const token = localStorage.getItem("vendorlogin");
  const user = getUser(token) as TokenType;
  const vendorId = user?.user_id;

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      try {
        const ordersResponse = await axiosInstance.get(
          `/dashboard/vendor/${vendorId}/productorderdetails/`
        );

        const { order_details, order_count } = ordersResponse.data;
        setTotalOrders(order_count);

        // Group products by order_id
        const groupedOrders = order_details.reduce((acc: any, item: any) => {
          const id = item.order_id;

          if (!acc[id]) {
            acc[id] = {
              id: item.order_id,
              customerName: item.customer_name,
              productDetails: `${item.product_name} (${item.quantity})`,
              totalQuantity: item.quantity, // Start tracking total quantity
              orderDate: new Date(item.order_date).toLocaleDateString(),
              totalPrice: item.total_order_price,
              isPaid: item.is_paid,
            };
          } else {
            // Append product names and quantities if multiple products exist
            acc[id].productDetails += `, ${item.product_name} (${item.quantity})`;
            acc[id].totalQuantity += item.quantity;
          }
          return acc;
        }, {} as Record<string, any>);

        // Convert grouped orders to DataGrid row format
        const formattedOrders: OrderRow[] = Object.values(groupedOrders).map(
          (order: any) => ({
            ...order,
            // If order has only one product, remove the quantity notation
            productDetails:
              order.totalQuantity === 1
                ? order.productDetails.split(" (")[0] // Remove quantity for single-product orders
                : order.productDetails,
          })
        );

        // Sort orders: Unpaid first
        formattedOrders.sort((a, b) => Number(a.isPaid) - Number(b.isPaid));

        setRows(formattedOrders);
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) {
      fetchOrderData();
    }
  }, [vendorId]);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "productDetails",
      headerName: "Products",
      flex: 2,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalQuantity",
      headerName: "Total Quantity",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "orderDate",
      headerName: "Order Date",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalPrice",
      headerName: "Total Price",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "isPaid",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) =>
        params.value ? (
          <Chip label="Paid" color="success" />
        ) : (
          <Chip label="Unpaid" color="error" />
        ),
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ marginBottom: 7 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#133E87", color: "white" }}>
            <CardContent>
              <Typography variant="h5">Total Orders</Typography>
              <Typography variant="h3">{totalOrders}</Typography>
              <ShoppingCartIcon fontSize="large" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Orders Table */}
      <Box sx={{ height: "auto", width: "100%" }}>
        <Typography variant="h6" gutterBottom>
          Order Details
        </Typography>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="400px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            slots={{
              toolbar: GridToolbar,
            }}
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
                textAlign: "center",
              },
              "& .MuiDataGrid-cell": {
                padding: 1,
                textAlign: "center",
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default OrdersDashboard;
