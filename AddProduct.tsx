import { Typography } from "@mui/material";
import { t } from "i18next";
import { enqueueSnackbar } from "notistack";
import { getUser } from "../../../../../public/utils/functions";
import axiosInstance from "../../../../api/axiosInstance";
import { TokenType } from "../../../../types";
import ProductForm from "./ProductForm";

export default function AddProduct() {
    // onSubmit function to handle form submission
    const handleSubmit = async (productData: any) => {
        const token = localStorage.getItem("vendorlogin");
        console.log("Token:", token);

        const user = getUser(token) as TokenType;
        const userId = user.user_id;

        try {
            // Create a FormData object
            const formData = new FormData();

            // Append product data fields
            formData.append("productName", productData.productName);
            formData.append("productDescription", productData.productDescription);

            // Append category and brand IDs
            formData.append("category", productData.category.toString()); // Backend expects category ID
            formData.append("brand", productData.brand.toString()); // Backend expects brand ID

            // Handle color (array of IDs)
            formData.append("color", productData.color.toString());

            // Handle size (array of IDs)
            formData.append("size", productData.size.toString());

            // Append specifications (JSON object or stringified JSON)
            // if (productData.specifications) {
            //     formData.append(
            //         "specifications",
            //         typeof productData.specifications === "string"
            //             ? productData.specifications
            //             : JSON.stringify(productData.specifications)
            //     );
            // }
            // Append specifications (JSON object)
if (productData.specifications) {
    formData.append("specifications", JSON.stringify(productData.specifications));
}


            // Handle image uploads
            if (Array.isArray(productData.image_uploads)) {
                productData.image_uploads.forEach((file: File) => {
                    formData.append("image_uploads", file); // Append each file object
                });
            }
            // Append other numeric and text fields
            formData.append(
                "price_before_discount",
                productData.price_before_discount
            );
            formData.append(
                "price_after_discount",
                productData.price_after_discount
            );
            formData.append("stock_quantity", productData.stock_quantity);
            formData.append("supplier", userId); // Assuming this is a text field
            formData.append("is_available", "true");

            for (let pair of formData.entries()) {
                console.log(pair[0] + ": " + pair[1]);
            }
            // Send FormData to the API
            const response = await axiosInstance.post("/products/", formData, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            console.log("API response:", response);

            // Success handling
            if (response.status === 200 || response.status === 201) {
                console.log("Product Data Submitted:", productData);
                enqueueSnackbar("Product submitted successfully!", {
                    variant: "success",
                });
            } else {
                alert("Failed to add product");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            enqueueSnackbar(
                `An error occurred while adding the product: ${
                    error.message || error
                }`,
                { variant: "error" }
            );
        }
    };

    return (
        <>
            <Typography style={{ fontSize: 40, marginBottom: 20 }}>
                {t("Add Product")}
            </Typography>
            <ProductForm
                /* @ts-ignore */

                product={FormData}
                onSubmit={handleSubmit}
                buttons={"Add Product"}
            />
        </>
    );
}