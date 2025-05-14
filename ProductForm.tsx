import InfoIcon from "@mui/icons-material/Info";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    IconButton,
    MenuItem,
    Select,
    TextField,
    Tooltip,
} from "@mui/material";
import { useFormik } from "formik";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { getUser } from "../../../../../public/utils/functions";
import axiosInstance from "../../../../api/axiosInstance";
import { TokenType } from "../../../../types";

export default function ProductForm({ onSubmit, buttons, product }) {
    console.log("🚀 ~ ProductForm ~ product:", product);
    const [categories, setCategories] = useState([]);
    const [brand, setBrand] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);

    // Submit handler
    const handleSubmit = async (values) => {
        try {
            await onSubmit(values);
            console.log(" Product submitted localy successfully");
        } catch (error) {
            console.error("Error submitting product:", error);
        }
    };
    const token = localStorage.getItem("vendorlogin");
    const user = getUser(token) as TokenType;
    const userId = user.user_id;

    // Validation schema

    const schema = z.object({
        productName: z.string().min(2, { message: "Product name is required" }),
        productDescription: z.string().min(4, { message: "Product description is required" }),
        category: z
            .number()
            .positive({ message: "Category must be a positive number (pk)." }),
        brand: z
            .number()
            .positive({ message: "Brand must be a positive number (pk)." }),
        color: z.number().positive({
            message: "Color is required and should be a list of strings.",
        }),
        size: z.number().min(1, { message: "Size is required." }),
        specifications: z
            .array(
                z.object({
                    key: z.string().min(1, { message: "Key is required." }),
                    value: z.string().min(1, { message: "Value is required." }),
                })
            )
            .min(1, { message: "Specifications must have at least one item." }),
        image_uploads: z
            .array(z.instanceof(File))
            .nonempty({ message: "Image uploads must be a list of files." }),

        price_before_discount: z
            .number()
            .positive({ message: "Must be positive." }),
        price_after_discount: z
            .number()
            .positive({ message: "Must be positive." }),
        stock_quantity: z
            .number()
            .min(0, { message: "Stock must be 0 or more." }),
    });

    // const formik = useFormik({
    //     initialValues: {
    //         productName: "",
    //         category: 0,
    //         brand: 0,
    //         color: 0,
    //         size: 0,
    //         specifications: [{ key: "", value: "" }],
    //         image_uploads: [],
    //         price_before_discount: 0,
    //         price_after_discount: 0,
    //         stock_quantity: 0,
    //         supplier: { userId },
    //     },
    //     validationSchema: toFormikValidationSchema(schema),
    //     onSubmit: handleSubmit,
    // });
    const formik = useFormik({
        initialValues: {
            productName: product?.productName || "",
            productDescription: product?.productDescription || "",
            category: product?.category_details?.id || 0,
            brand: product?.brand_details?.id || 0,
            color: product?.color_details?.map((c) => c.id) || [],
            size: product?.size_details?.map((s) => s.id) || [],
            specifications: product?.specifications || [{ key: "", value: "" }],
            image_uploads: [],
            price_before_discount: product?.price_before_discount || 0,
            price_after_discount: product?.price_after_discount || 0,
            stock_quantity: product?.stock_quantity || 0,
            supplier: userId,
        },
        enableReinitialize: true, // Ensure values update when `product` changes
        validationSchema: toFormikValidationSchema(schema),
        onSubmit: handleSubmit,
    });
    

    useEffect(() => {
        // Fetch categories using Axios instance
        axiosInstance
            .get("/products/category/")
            .then((response) => {
                console.log("Categories Data:", response.data);
                setCategories(response.data.results || response.data || []);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    useEffect(() => {
        // Fetch brands using Axios instance
        axiosInstance
            .get("/products/brand/")
            .then((response) => {
                console.log("brand Data:", response.data);
                setBrand(response.data.results || response.data || []);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    useEffect(() => {
        fetchColors();
        fetchSizes();
    }, []);

    const fetchColors = async () => {
        const response = await axiosInstance.get("/products/color/");
        setColors(response.data);
    };

    const fetchSizes = async () => {
        const response = await axiosInstance.get("/products/size/");
        setSizes(response.data);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Box className="flex flex-wrap gap-9">
                {/* Product Name In English*/}
                <FormControl className="w-5/12">
                    <FormLabel
                        htmlFor="productName"
                        className="flex items-center"
                    >
                        {t("Product Name")}
                        <Tooltip
                            title="Enter the Product Name In ENGLISH here"
                            placement="right"
                        >
                            <IconButton
                                size="small"
                                aria-label="Info about product name"
                            >
                                <InfoIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </FormLabel>
                    <TextField
                        className="w-full"
                        name="productName"
                        id="productName"
                        onBlur={formik.handleBlur}
                        value={formik.values.productName}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.productName &&
                            Boolean(formik.errors.productName)
                        }
                        helperText={
                            formik.touched.productName &&
                            typeof formik.errors.productName === "string"
                                ? formik.errors.productName
                                : ""
                        }
                    />
                </FormControl>
                {/* Product Description */}
<FormControl className="w-5/12">
    <FormLabel htmlFor="productDescription">{t("Product Description")}</FormLabel>
    <TextField
        className="w-full"
        name="productDescription"
        id="productDescription"
        onBlur={formik.handleBlur}
        value={formik.values.productDescription}
        onChange={formik.handleChange}
        error={
            formik.touched.productDescription &&
            Boolean(formik.errors.productDescription)
        }
        helperText={
            formik.touched.productDescription &&
            typeof formik.errors.productDescription === "string"
                ? formik.errors.productDescription
                : ""
        }
        multiline
        rows={4} // Allows multi-line text input
    />
</FormControl>

                

                {/* Category */}
                <FormControl className="w-5/12">
                    <FormLabel htmlFor="category">{t("Category")}</FormLabel>
                    <Select
                        className="w-full"
                        name="category"
                        id="category"
                        onBlur={formik.handleBlur}
                        value={formik.values.category}
                        onChange={(event) =>
                            formik.setFieldValue("category", event.target.value)
                        } // Set the ID of the selected category
                        error={
                            formik.touched.category &&
                            Boolean(formik.errors.category)
                        }
                        sx={{
                            color: "black",
                            backgroundColor: "white",
                            "& .MuiSelect-icon": { color: "black" }, // Set arrow icon color if needed
                        }}
                    >
                        {categories.map((category) => (
                            <MenuItem
                                key={category.id}
                                value={category?.id}
                                sx={{ color: "black" }}
                            >
                                {/* change the  language to arabic to see the arabic name */}
                                {category.translations.en.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Brand */}
                <FormControl className="w-5/12">
                    <FormLabel htmlFor="brand">{t("Brand")}</FormLabel>
                    <Select
                        className="w-full"
                        name="brand"
                        id="brand"
                        onBlur={formik.handleBlur}
                        value={formik.values.brand}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.brand && Boolean(formik.errors.brand)
                        }
                        sx={{
                            color: "black",
                            backgroundColor: "white",
                            "& .MuiSelect-icon": { color: "black" }, // Set arrow icon color if needed
                        }}
                    >
                        {brand.map((brand) => (
                            <MenuItem
                                key={brand.id}
                                value={brand?.id} // Adjust based on your data structure
                                sx={{ color: "black" }}
                            >
                                {/* Change the language to Arabic to see the Arabic name */}
                                {brand.translations.en.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Color */}
                <FormControl className="w-5/12">
                    <FormLabel htmlFor="color">{t("Color")}</FormLabel>
                    <Select
                        className="w-full"
                        name="color"
                        id="color"
                        onBlur={formik.handleBlur}
                        value={formik.values.color}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.color && Boolean(formik.errors.color)
                        }
                        sx={{
                            color: "black",
                            backgroundColor: "white",
                            "& .MuiSelect-icon": { color: "black" },
                        }}
                    >
                        {colors.map((color) => (
                            <MenuItem
                                key={color.id}
                                value={color.id}
                                sx={{ color: "black" }}
                            >
                                {color.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Size */}
                <FormControl className="w-5/12">
                    <FormLabel htmlFor="size">{t("Size")}</FormLabel>
                    <Select
                        className="w-full"
                        name="size"
                        id="size"
                        onBlur={formik.handleBlur}
                        value={formik.values.size}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.size && Boolean(formik.errors.size)
                        }
                        sx={{
                            color: "black",
                            backgroundColor: "white",
                            "& .MuiSelect-icon": { color: "black" },
                        }}
                    >
                        {sizes.map((size) => (
                            <MenuItem
                                key={size.id}
                                value={size?.id}
                                sx={{ color: "black" }}
                            >
                                {size.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Specifications */}
                <FormControl className="w-5/12">
                    <FormLabel htmlFor="specifications">
                        {t("Specifications")}
                    </FormLabel>
                    <div className="flex flex-col gap-2">
                        {formik.values.specifications.map(
                            (
                                spec: { key: string; value: string },
                                index: number
                            ) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <TextField
                                        className="w-1/2"
                                        label={t("Key")}
                                        value={spec.key}
                                        onChange={(e) => {
                                            const newSpecifications = [
                                                ...formik.values.specifications,
                                            ];
                                            newSpecifications[index].key =
                                                e.target.value;
                                            formik.setFieldValue(
                                                "specifications",
                                                newSpecifications
                                            );
                                        }}
                                    />
                                    <TextField
                                        className="w-1/2"
                                        label={t("Value")}
                                        value={spec.value}
                                        onChange={(e) => {
                                            const newSpecifications = [
                                                ...formik.values.specifications,
                                            ];
                                            newSpecifications[index].value =
                                                e.target.value;
                                            formik.setFieldValue(
                                                "specifications",
                                                newSpecifications
                                            );
                                        }}
                                    />
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => {
                                            const newSpecifications =
                                                formik.values.specifications.filter(
                                                    (_, i) => i !== index
                                                );
                                            formik.setFieldValue(
                                                "specifications",
                                                newSpecifications
                                            );
                                        }}
                                    >
                                        {t("Remove")}
                                    </Button>
                                </div>
                            )
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                                formik.setFieldValue("specifications", [
                                    ...formik.values.specifications,
                                    { key: "", value: "" },
                                ])
                            }
                        >
                            {t("Add Specification")}
                        </Button>
                    </div>
                </FormControl>

                {/* Image Uploads */}
                <FormControl className="w-5/12">
                    <FormLabel htmlFor="image_uploads">
                        {t("Image Upload")}
                    </FormLabel>
                    <input
                        type="file"
                        multiple
                        id="image_uploads"
                        name="image_uploads"
                        accept="image/*"
                        onChange={(event) => {
                            const files = Array.from(
                                event.currentTarget.files || []
                            );
                            formik.setFieldValue("image_uploads", files); // Store the array of File objects
                        }}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.image_uploads &&
                        formik.errors.image_uploads && (
                            <p className="text-red-600">
                                {typeof formik.errors.image_uploads === "string"
                                    ? formik.errors.image_uploads
                                    : Array.isArray(formik.errors.image_uploads)
                                    ? formik.errors.image_uploads.join(", ")
                                    : "There was an error with the image uploads."}
                            </p>
                        )}
                </FormControl>

                {/* Price Before Discount */}
                <FormControl className="w-5/12">
                    <FormLabel htmlFor="price_before_discount">
                        {t("Price Before Discount")}
                    </FormLabel>
                    <TextField
                        className="w-full"
                        type="number"
                        name="price_before_discount"
                        id="price_before_discount"
                        onBlur={formik.handleBlur}
                        value={formik.values.price_before_discount}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.price_before_discount &&
                            Boolean(formik.errors.price_before_discount)
                        }
                        helperText={
                            formik.touched.price_before_discount &&
                            typeof formik.errors.price_before_discount ===
                                "string"
                                ? formik.errors.price_before_discount
                                : ""
                        }
                    />
                </FormControl>

                {/* Price After Discount */}
                <FormControl className="w-5/12">
                    <FormLabel htmlFor="price_after_discount">
                        {t("Price After Discount")}
                    </FormLabel>
                    <TextField
                        className="w-full"
                        type="number"
                        name="price_after_discount"
                        required
                        id="price_after_discount"
                        onBlur={formik.handleBlur}
                        value={formik.values.price_after_discount}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.price_after_discount &&
                            Boolean(formik.errors.price_after_discount)
                        }
                        helperText={
                            formik.touched.price_after_discount &&
                            typeof formik.errors.price_after_discount ===
                                "string"
                                ? formik.errors.price_after_discount
                                : ""
                        }
                        color={
                            formik.errors.price_after_discount
                                ? "error"
                                : "primary"
                        }
                    />
                </FormControl>

                {/* Stock Quantity */}
                <FormControl className="w-5/12">
                    <FormLabel htmlFor="stock_quantity">
                        {t("Stock Quantity")}
                    </FormLabel>
                    <TextField
                        className="w-full"
                        type="number"
                        name="stock_quantity"
                        required
                        id="stock_quantity"
                        onBlur={formik.handleBlur}
                        value={formik.values.stock_quantity}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.stock_quantity &&
                            Boolean(formik.errors.stock_quantity)
                        }
                        helperText={
                            formik.touched.stock_quantity &&
                            typeof formik.errors.stock_quantity === "string"
                                ? formik.errors.stock_quantity
                                : ""
                        }
                        color={
                            formik.errors.stock_quantity ? "error" : "primary"
                        }
                    />
                </FormControl>

                <FormControl className="w-5/12">
                    <FormLabel htmlFor="supplier">{t("Supplier ID")}</FormLabel>
                    <TextField
                        className="w-full"
                        disabled
                        value={userId}
                        name="supplier"
                    />
                </FormControl>
            </Box>
            <Button
                type="submit"
                variant="contained"
                // disabled={!formik.dirty || !formik.isValid}
                className="w-1/5"
                sx={{
                    background: "primary",
                    borderRadius: "3px",
                    marginTop: "30px",
                }}
            >
                <p className="font-semibold">{buttons}</p>
            </Button>
        </form>
    );
}