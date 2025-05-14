import { useFormik } from "formik";
import { useEffect, useState } from "react";
import {
    Box, Button, FormControl, FormLabel, MenuItem, Select, TextField
} from "@mui/material";
import axiosInstance from "../../../../api/axiosInstance";

export default function UpdateForm({ onSubmit, product }) {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);

    useEffect(() => {
        axiosInstance.get("/products/category/").then((res) => setCategories(res.data));
        axiosInstance.get("/products/brand/").then((res) => setBrands(res.data));
        axiosInstance.get("/products/color/").then((res) => setColors(res.data));
        axiosInstance.get("/products/size/").then((res) => setSizes(res.data));
    }, []);

    const formik = useFormik({
        initialValues: {
            productName: product?.name || "",
            productDescription: product?.description || "",
            category: categories.find(cat => cat.name === product?.category_details)?.id || "",
            brand: brands.find(brand => brand.name === product?.category_details)?.id || "",
            // category: product?.category_details?.id || "",
            // brand: product?.brand_details?.id || "",
            color: product?.color_details?.map(c => c.id) || [],
            size: product?.size_details?.map(s => s.id) || [],
            specifications: product?.specifications || [{ key: "", value: "" }],
            image_uploads: [],
            price_before_discount: product?.price_before_discount || 0,
            price_after_discount: product?.price || 0,
            stock_quantity: product?.stock || 0,
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                if (key === "image_uploads") {
                    values.image_uploads.forEach(file => formData.append("image_uploads", file));
                } else if (key === "specifications") {
                    formData.append(key, JSON.stringify(values[key]));
                } else if (key === "color" || key === "size") {
                    values[key].forEach(val => formData.append(key, val));
                } else {
                    formData.append(key, values[key]);
                }
            });
            onSubmit(formData);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <Box className="flex flex-wrap gap-9">
                {/* Product Name */}
                <FormControl className="w-5/12">
                    <FormLabel>Product Name</FormLabel>
                    <TextField name="productName" value={formik.values.productName} onChange={formik.handleChange} />
                </FormControl>

                {/* Product Description */}
                <FormControl className="w-5/12">
                    <FormLabel>Product Description</FormLabel>
                    <TextField name="productDescription" value={formik.values.productDescription} onChange={formik.handleChange} multiline rows={4} />
                </FormControl>
{/* Category */}
<FormControl className="w-5/12">
    <FormLabel>Category</FormLabel>
    <Select
        name="category"
        value={formik.values.category}
        onChange={formik.handleChange}
    >
        {categories.map(category => (
            <MenuItem key={category.id} value={category.id}>
                {category.translations?.en?.name || category.name}
            </MenuItem>
        ))}
    </Select>
</FormControl>

{/* Brand */}
<FormControl className="w-5/12">
    <FormLabel>Brand</FormLabel>
    <Select
        name="brand"
        value={formik.values.brand}
        onChange={formik.handleChange}
    >
        {brands.map(brand => (
            <MenuItem key={brand.id} value={brand.id}>
                {brand.translations?.en?.name || brand.name}
            </MenuItem>
        ))}
    </Select>
</FormControl>


                {/* Color Multi-Select */}
                <FormControl className="w-5/12">
                    <FormLabel>Color</FormLabel>
                    <Select multiple name="color" value={formik.values.color} onChange={e => formik.setFieldValue("color", e.target.value)}>
                        {colors.map(color => (
                            <MenuItem key={color.id} value={color.id}>{color.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Size Multi-Select */}
                <FormControl className="w-5/12">
                    <FormLabel>Size</FormLabel>
                    <Select multiple name="size" value={formik.values.size} onChange={e => formik.setFieldValue("size", e.target.value)}>
                        {sizes.map(size => (
                            <MenuItem key={size.id} value={size.id}>{size.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Price Before Discount */}
                <FormControl className="w-5/12">
                    <FormLabel>Price Before Discount</FormLabel>
                    <TextField type="number" name="price_before_discount" value={formik.values.price_before_discount} onChange={formik.handleChange} />
                </FormControl>

                {/* Price After Discount */}
                <FormControl className="w-5/12">
                    <FormLabel>Price After Discount</FormLabel>
                    <TextField type="number" name="price_after_discount" value={formik.values.price_after_discount} onChange={formik.handleChange} />
                </FormControl>

                {/* Stock Quantity */}
                <FormControl className="w-5/12">
                    <FormLabel>Stock Quantity</FormLabel>
                    <TextField type="number" name="stock_quantity" value={formik.values.stock_quantity} onChange={formik.handleChange} />
                </FormControl>

                {/* Image Upload */}
                <FormControl className="w-5/12">
                    <FormLabel>Upload Images</FormLabel>
                    <input type="file" multiple accept="image/*" onChange={(event) => formik.setFieldValue("image_uploads", Array.from(event.target.files))} />
                </FormControl>

                {/* Specifications */}
                <FormControl className="w-5/12">
                    <FormLabel>Specifications</FormLabel>
                    <div className="flex flex-col gap-2">
                        {formik.values.specifications.map((spec, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <TextField className="w-1/2" label="Key" value={spec.key} onChange={e => {
                                    const newSpecifications = [...formik.values.specifications];
                                    newSpecifications[index].key = e.target.value;
                                    formik.setFieldValue("specifications", newSpecifications);
                                }} />
                                <TextField className="w-1/2" label="Value" value={spec.value} onChange={e => {
                                    const newSpecifications = [...formik.values.specifications];
                                    newSpecifications[index].value = e.target.value;
                                    formik.setFieldValue("specifications", newSpecifications);
                                }} />
                                <Button variant="outlined" color="error" onClick={() => {
                                    const newSpecifications = formik.values.specifications.filter((_, i) => i !== index);
                                    formik.setFieldValue("specifications", newSpecifications);
                                }}>Remove</Button>
                            </div>
                        ))}
                        <Button variant="contained" color="primary" onClick={() =>
                            formik.setFieldValue("specifications", [...formik.values.specifications, { key: "", value: "" }])
                        }>Add Specification</Button>
                    </div>
                </FormControl>

                <Button type="submit" variant="contained" className="w-1/5">Update Product</Button>
            </Box>
        </form>
    );
}