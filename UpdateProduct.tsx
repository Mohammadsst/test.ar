/* eslint-disable */
/* @ts-ignore */
import EditIcon from "@mui/icons-material/Edit";
import {
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from "@mui/material";
import {
    DataGrid,
    GridColDef,
    GridRowsProp,
    GridToolbar,
} from "@mui/x-data-grid";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../api/axiosInstance";
import { Product } from "../../../../types";
import UpdateForm from "./UpdateForm";
export default function ProductGrid() {
    const [rows, setRows] = useState<GridRowsProp>([]);
    const [open, setOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("vendorlogin");

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(
                    "/products/vendorproduct/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: {
                            page: page + 1, // API pages are 1-based
                            pageSize,
                        },
                    }
                );

                const formattedRows = response.data.map((product: Product) => ({
                    id: product.id,
                    name: product.productName,
                    category:
                        product.category_details.translations.en?.name ||
                        "Unknown",
                    brand:
                        product.brand_details.translations.en?.name ||
                        "Unknown",
                    stock: product.stock_quantity,
                    totalSold: product.total_sold,
                    discount:
                        product.price_before_discount -
                        product.price_after_discount,
                    price: product.price_after_discount,
                }));

                setRows(formattedRows);
                setRowCount(response.data.length);
            } catch (error) {
                console.error("Error fetching products:", error);
                setRows([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page, pageSize]);

    const handleEdit = (product: Product) => {
        setCurrentProduct(product);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentProduct(null);
    };

    const formik = useFormik({
        initialValues: {
            productName: currentProduct?.name || "",
            category: currentProduct?.category || "",
            brand: currentProduct?.brand || "",
            price_before_discount: currentProduct?.price || "",
            stock_quantity: currentProduct?.stock || "",
            total_sold: currentProduct?.totalSold || "",
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            const token = localStorage.getItem("accessToken");
            // Create an object with only the fields that need to be updated
            const updatedFields = {};
            if (values.productName !== currentProduct?.name)
                /* @ts-ignore */
                updatedFields.name = values.productName;
            if (values.category !== currentProduct?.category)
                /* @ts-ignore */
                updatedFields.category = values.category;
            if (values.brand !== currentProduct?.brand)
                /* @ts-ignore */
                updatedFields.brand = values.brand;
            if (values.price_before_discount !== currentProduct?.price)
                /* @ts-ignore */
                updatedFields.price_before_discount =
                    values.price_before_discount;
            if (values.stock_quantity !== currentProduct?.stock)
                /* @ts-ignore */
                updatedFields.stock_quantity = values.stock_quantity;
            if (values.total_sold !== currentProduct?.totalSold)
                /* @ts-ignore */
                updatedFields.total_sold = values.total_sold;

            try {
                const response = await axiosInstance.put(
                    `/products/vendorproduct/${currentProduct.id}/`,
                    {
                        updatedFields,
                    },
                    {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Product updated:", response.data);
                handleClose();
            } catch (error) {
                console.error("Error updating product:", error);
            }
        },
    });

    const columns: GridColDef[] = [
        {
            field: "name",
            headerName: "Product Name",
            flex: 1,
            headerAlign: "center",
        },
        {
            field: "category",
            headerName: "Category",
            flex: 1,
            headerAlign: "center",
        },
        { field: "brand", headerName: "Brand", flex: 1, headerAlign: "center" },
        {
            field: "stock",
            headerName: "Stock Quantity",
            flex: 1,
            headerAlign: "center",
        },
        {
            field: "totalSold",
            headerName: "Total Sold",
            flex: 0.5,
            headerAlign: "center",
        },
        {
            field: "discount",
            headerName: "Discount Amount",
            flex: 1,
            headerAlign: "center",
        },
        { field: "price", headerName: "Price", flex: 1, headerAlign: "center" },
        {
            field: "update",
            headerName: "Update",
            flex: 0.5,
            sortable: false,
            headerAlign: "center",
            renderCell: (params) => (
                <IconButton
                    onClick={() => handleEdit(params.row)}
                    color="primary"
                >
                    <EditIcon />
                </IconButton>
            ),
        },
    ];

    return (
        <div style={{ height: "auto", width: "100%", margin: "20px auto" }}>
            <Typography style={{ fontSize: 40, marginBottom: 20 }}>
                Your Products
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
                    /* @ts-ignore */

                    pageSize={pageSize}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
                    paginationMode="server"
                    rowCount={rowCount}
                    onPageChange={(newPage) => setPage(newPage)}
                    /* @ts-ignore */
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    disableSelectionOnClick
                    sx={{
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f5f5f5",
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                        },
                        "& .MuiDataGrid-cell": {
                            textAlign: "center",
                        },
                    }}
                />
            )}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Update Product</DialogTitle>
                <DialogContent>
                    <UpdateForm
                        /* @ts-ignore */
                        product={currentProduct}
                        onSubmit={formik.handleSubmit}
                        buttons="Update Product"
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}