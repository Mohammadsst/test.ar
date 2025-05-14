import { Rating } from "@mui/material";
import { t } from "i18next";
import { useState } from "react";
import { Trans } from "react-i18next";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axiosInstance";
import { calculateAverageRating } from "../../../constants";
import "../../../styles/product-overview.css";
import { Product } from "../../../types";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {TiShoppingCart } from "react-icons/ti";
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

 function ProductOverview({ product }: { product: Product }) {
    const [mainImage, setMainImage] = useState(
        (product?.images && product?.images.length > 0 ? product?.images[0].image : "") ||
        "https://clarionhealthcare.com/wp-content/uploads/2020/12/default-fallback-image.png"
    );
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState("");
    const queryClient = useQueryClient();
    const averageRating = parseFloat(
        calculateAverageRating(product?.reviews || []).toString()
    );
    const addToCart = async () => {
        try {
            await axiosInstance.post(
                "/order/addcart/",
                {
                    product_id: product?.id,
                    quantity: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            queryClient.invalidateQueries({ queryKey: ["userCart"] });
            
            toast.success("Product added to cart successfully!");
        } catch (error) {
            toast.error("Failed to add Product to cart!");
            console.error("Error adding product to cart:", error);
        }
    };
  

    return (
        <div className="bg-white">
            <div className="pt-6 pb-10">
                <nav aria-label="Breadcrumb">
                    <ol
                        role="list"
                        className="flex items-center max-w-2xl px-4 mx-auto space-x-2 sm:px-6 lg:max-w-7xl lg:px-8"
                    >
                        <li className="text-sm">
                            <a
                                href="#"
                                aria-current="page"
                                className="font-medium text-gray-500 hover:text-gray-600"
                            >
                                {product?.productName}
                            </a>
                        </li>
                    </ol>
                </nav>

                <div className="flex flex-col w-full lg:flex-row">
                    {/* Image gallery */}
                    <div className="flex justify-center flex-1 px-6 mt-6 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center lg:items-start max-w-fit">
                            <div className="overflow-hidden rounded-lg w-96 h-96 aspect-h-3 aspect-w-2">
                                <img
                                    alt={product?.productName}
                                    src={mainImage}
                                    className="object-cover object-center w-full h-full"
                                />
                            </div>
                            <div className="flex justify-center mx-auto mt-4 space-x-4 lg:justify-start">
                                {product?.images?.length ? (
                                    product?.images?.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`w-20 h-20 aspect-h-1 aspect-w-1 overflow-hidden rounded-lg cursor-pointer border-2 ${
                                                mainImage === image.image
                                                    ? "border-blue-500"
                                                    : "border-transparent"
                                            } hover:border-blue-500 transition-all duration-300`}
                                            onClick={() =>
                                                setMainImage(image.image)
                                            }
                                        >
                                            <img
                                                alt={product?.productName}
                                                src={image.image}
                                                className="object-cover object-center w-full h-full"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <span>No images available</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 px-8 pt-10 sm:px-6 lg:col-span-2 lg:border-gray-200 lg:pr-8">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            {product?.productName}
                        </h1>
                        <p className="text-sm text-gray-600">
                            {product?.category_details?.translations?.en?.name || "No Category"} ||{" "}
                            {product?.brand_details?.translations?.en?.name || "No Brand"}
                        </p>
                        <p className="text-xl tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
                            {product?.price_after_discount}{" "}
                            <Trans i18nKey="currency" />
                            {product?.price_before_discount && (
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                    {product?.price_before_discount}{" "}
                                    <Trans i18nKey="currency" />
                                </span>
                            )}
                        </p>

                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-900">
                                <Trans i18nKey="available colors" />
                            </h3>
                            <div className="flex mt-2 space-x-2">
                            {product?.color_details?.length > 0 &&
                                product.color_details.map((color) => (
                                    <span
                                        className={classNames(
                                            "h-6 w-6 rounded-full border border-gray-300 cursor-pointer mx-2",
                                            selectedColor === color.name ? "ring-2 ring-offset-2 ring-indigo-500" : ""
                                        )}
                                        key={color.id}
                                        style={{
                                            backgroundColor: color.name.toLowerCase(),
                                        }}
                                        title={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-6">
                            <Rating
                                name="half-rating-read"
                                defaultValue={averageRating}
                                precision={0.1}
                                readOnly
                            />
                            {averageRating}
                            <span>
                                ({product?.reviews?.length || 0} {t("reviews")})
                            </span>
                        </div>

                        <div className="flex items-center mt-4">
                            <h3 className="text-sm font-medium text-gray-900">
                                {t("quantity")}
                            </h3>
                            <div className="flex items-center mx-2">
                                <button
                                    disabled={quantity === 0}
                                    onClick={() =>
                                        setQuantity((prev) =>
                                            Math.max(prev - 1, 0)
                                        )
                                    }
                                    className={`flex items-center justify-center w-10 h-10 text-gray-600 border border-gray-300 rounded-s-md hover:bg-gray-100 ${
                                        quantity === 0
                                            ? "text-gray-300 cursor-not-allowed hover:bg-transparent"
                                            : ""
                                    }`}
                                >
                                    −
                                </button>
                                <input
                                    type="text"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(
                                            parseInt(e.target.value) || 0
                                        )
                                    }
                                    className="w-16 h-10 px-2 text-center border-t border-b border-gray-300"
                                />
                                <button
                                    disabled={
                                        quantity === product?.stock_quantity
                                    }
                                    onClick={() =>
                                        setQuantity((prev) => prev + 1)
                                    }
                                    className={`flex items-center justify-center w-10 h-10 text-gray-600 border border-gray-300 rounded-e-md hover:bg-gray-100 ${
                                        quantity === product?.stock_quantity
                                            ? "text-gray-300 cursor-not-allowed hover:bg-transparent"
                                            : ""
                                    }`}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center my-4 font-bold">
                        {t("supplier")}  :  
                        <Link className="font-bold text-blue-600 underline" to={`/supplier/${product?.supplier_id}`}>
                            {product?.supplier_name}
                        </Link>
                        </div>
                        {/* <button
                            onClick={addToCart}
                            className="w-full py-2 mt-6 text-white bg-[#c40000] rounded"
                        >
                            <Trans i18nKey="addToCart" />
                        </button> */}
                        {product?.stock_quantity > 0 ? (
                            <button
                              onClick={addToCart}
                              className="w-full bg-[#C40000] text-white font-bold py-2 rounded-md flex items-center justify-center gap-2 hover:bg-red-700 transition"
                            >
                              <TiShoppingCart className="text-white text-lg" />
                              {t("addToCart")}
                            </button>
                          ) : (
                            <div className="w-full  bg-[#C40000] text-white font-bold py-2 rounded-md flex items-center justify-center gap-2 cursor-not-allowed">
                              {t("outOfStock")}
                            </div>
                          )}

                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProductOverview;