// import { t } from "i18next";
// import { useState } from "react";
// import { Rating } from "@mui/material";
// import "../../../styles/product-info.css";
// import { Product } from "../../../types";
// import { Link } from "react-router-dom";

// export default function ProductInfo({ product }: { product: Product }) {
//     const [activeTab, setActiveTab] = useState("product-details");

//     function classNames(...classes: string[]) {
//         return classes.filter(Boolean).join(" ");
//     }

//     // const averageRating = parseFloat(
//     //     calculateAverageRating(product.reviews).toString()
//     // );

//     return (
//         <div className="mt-6">
//             {/* Navigation Buttons */}
//             <div className="flex border-b border-gray-300 justify-center gap-6 pb-5 sm:gap-14">
//                 <button
//                     className={classNames(
//                         activeTab === "product-details"
//                             ? "text-gray-900"
//                             : "text-gray-400",
//                         "text-sm font-medium hover:text-gray-700 focus:outline-none transition-colors duration-300"
//                     )}
//                     onClick={() => setActiveTab("product-details")}
//                 >
//                     {t("productDetails")}
//                 </button>
//                 <button
//                     className={classNames(
//                         activeTab === "reviews"
//                             ? "text-gray-900"
//                             : "text-gray-400",
//                         "text-sm font-medium hover:text-gray-700 focus:outline-none transition-colors duration-300"
//                     )}
//                     onClick={() => setActiveTab("reviews")}
//                 >
//                     {t("reviews")} ({product?.reviews?.length || 0})
//                 </button>
//             </div>

//             {/* Content */}
//             <div className="mb-9 mt-8">
//                 {/* Product Details Tab */}
//                 {activeTab === "product-details" && (
//                     <div className="flex flex-col justify-center p-6 gap-8 items-start lg:flex-row">
//                         {/* Product Description */}
//                         <div className="w-full lg:w-5/12">
//                             <h2 className="text-gray-900 text-lg font-medium">
//                                 {t("productDetails")}
//                             </h2>
//                             <div
//                                 className="text-gray-700 mt-4"
//                                 style={{
//                                     direction: /[\u0600-\u06FF]/.test(
//                                         product?.productDescription
//                                     )
//                                         ? "rtl"
//                                         : "ltr",
//                                 }}
//                             >
//                                 {product?.productDescription
//                                     ? product.productDescription.split("\n").map((line, index) => (
//                                         <p key={index} style={{ margin: "0 0 0.5em 0" }}>
//                                             {line}
//                                         </p>
//                                     ))
//                                     : <p>No description available.</p>
//                                 }
//                             </div>
//                         </div>

//                         {/* Product Highlights */}
//                         {product.specifications && (
//     <div className="w-full lg:w-5/12">
//         <h2 className="text-gray-900 text-lg font-medium">
//             {t("highlights")}
//         </h2>
//         <ul className="list-disc text-gray-600 text-sm custom-scrollbar max-h-40 mt-4 overflow-y-auto pl-5">
//             {/* Check if specifications is an array */}
//             {Array.isArray(product.specifications) ? (
//                 product.specifications.map((spec, index) => (
//                     <li key={index} className="mb-2">
//                         <div className="p-2 w-full">
//                             <strong>{spec.key}:</strong> {spec.value}
//                         </div>
//                     </li>
//                 ))
//             ) : (
//                 // If specifications is an object, use Object.entries
//                 Object.entries(product.specifications).map(([key, value], index) => (
//                     <li key={index} className="mb-2">
//                         <div className="p-2 w-full">
//                             <strong>{key}:</strong> {typeof value === "object" && value !== null ? value.value : value}
//                         </div>
//                     </li>
//                 ))
//             )}
//         </ul>
//     </div>
// )}

//                         <div className="font-bold my-6">
//                             {/* TODO add reviews */}
//                             {t("supplier")}  :
//                             <Link className="text-blue-600 font-bold underline" to={`/supplier/${product?.supplier_id}`}>
//                                 {product?.supplier_name}
//                             </Link>
//                         </div>
//                     </div>
//                 )}

//                 {/* Reviews Tab */}
//                 {activeTab === "reviews" && (
//                     <div className="max-w-3xl mx-auto px-4">
//                         {product.reviews.length > 0 ? (
//                             <div className="custom-scrollbar max-h-80 mt-4 overflow-y-auto space-y-6">
//                                 {product.reviews.map((review, index) => (
//                                     <div
//                                         key={index}
//                                         className="border-b border-gray-300 pb-6"
//                                     >
//                                         <div className="flex space-x-4">
//                                             {/* Avatar */}
//                                             <div className="flex-shrink-0">
//                                                 <img
//                                                     className="h-10 rounded-full w-10 object-cover"
//                                                     src={
//                                                         review.avatar ||
//                                                         "/images/pexels-photo-4068314.webp"
//                                                     } // Fallback avatar
//                                                     alt={`${review.user_name}'s avatar`}
//                                                 />
//                                             </div>

//                                             {/* Review Content */}
//                                             <div className="flex-1">
//                                                 {/* Username and Rating */}
//                                                 <div className="flex justify-between items-center">
//                                                     <div className="text-gray-900 text-sm font-medium">
//                                                         {review.user_name}
//                                                     </div>
//                                                     <Rating
//                                                         name="half-rating-read"
//                                                         defaultValue={
//                                                             review.rating
//                                                         }
//                                                         precision={0.5}
//                                                         readOnly
//                                                     />
//                                                 </div>
//                                                 {/* Review Comment */}
//                                                 <p className="text-gray-600 text-sm mt-2">
//                                                     {review.review_text}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="text-center min-h-32">
//                                 {t("noReviews")}
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

import { t } from "i18next";
import { useState } from "react";
import { Rating } from "@mui/material";
import "../../../styles/product-info.css";
import { Product } from "../../../types";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function ProductInfo({ product }: { product: Product }) {
    const [activeTab, setActiveTab] = useState("product-details");
    const [rating, setRating] = useState<number>(0);
    const [reviewText, setReviewText] = useState<string>("");
    const [reviews, setReviews] = useState(product.reviews || []);
    const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(true);

    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(" ");
    }

    // ✅ Ensure only reviews related to the product are displayed
    const productReviews = reviews.filter((review) => review.product === product.id);

    // ✅ Handle Submit / Update Review
    const handleReviewSubmit = async () => {
        if (!rating) {
            toast.error(t("ratingRequired"));
            return;
        }

        try {
            let response;
            if (editingReviewId) {
                // Update Review
                response = await axios.put(
                    `http://127.0.0.1:8000/en/api/products/reviews/${editingReviewId}/`,
                    { rating, review_text: reviewText },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success(t("reviewUpdated"));
            } else {
                // Create Review
                response = await axios.post(
                    "http://127.0.0.1:8000/en/api/products/reviews/",
                    { product: product.id, rating, review_text: reviewText },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success(t("reviewAdded"));
            }

            setReviews((prev) => {
                if (editingReviewId) {
                    return prev.map((review) =>
                        review.id === editingReviewId ? response.data : review
                    );
                }
                return [...prev, response.data];
            });

            // ✅ Hide form after submitting a review
            setShowForm(false);
            setRating(0);
            setReviewText("");
            setEditingReviewId(null);
        } catch (error) {
            toast.error(t("reviewError"));
        }
    };

    // ✅ Handle Edit Click
    const handleEdit = (reviewId: number, currentRating: number, currentText: string) => {
        setEditingReviewId(reviewId);
        setRating(currentRating);
        setReviewText(currentText);
        setShowForm(true);
    };

    // ✅ Handle Delete Review
    const handleDelete = async (reviewId: number) => {
        if (!window.confirm(t("deleteConfirm"))) return;

        try {
            await axios.delete(
                `http://127.0.0.1:8000/en/api/products/reviews/${reviewId}/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setReviews((prev) => prev.filter((review) => review.id !== reviewId));
            toast.success(t("reviewDeleted"));
        } catch (error) {
            toast.error(t("deleteError"));
        }
    };

    return (
        <div className="mt-6">
            {/* Navigation Buttons */}
            <div className="flex border-b border-gray-300 justify-center gap-6 pb-5 sm:gap-14">
                <button
                    className={classNames(
                        activeTab === "product-details" ? "text-gray-900" : "text-gray-400",
                        "text-sm font-medium hover:text-gray-700 transition-colors duration-300"
                    )}
                    onClick={() => setActiveTab("product-details")}
                >
                    {t("productDetails")}
                </button>
                <button
                    className={classNames(
                        activeTab === "reviews" ? "text-gray-900" : "text-gray-400",
                        "text-sm font-medium hover:text-gray-700 transition-colors duration-300"
                    )}
                    onClick={() => setActiveTab("reviews")}
                >
                    {t("reviews")} ({productReviews.length || 0})
                </button>
            </div>

            {/* Content */}
            <div className="mb-9 mt-8">
             {/* Product Details Tab */}
                 {activeTab === "product-details" && (
                    <div className="flex flex-col justify-center p-6 gap-8 items-start lg:flex-row">
                        {/* Product Description */}
                        <div className="w-full lg:w-5/12">
                            <h2 className="text-gray-900 text-lg font-medium">
                                {t("productDetails")}
                            </h2>
                            <div
                                className="text-gray-700 mt-4"
                                style={{
                                    direction: /[\u0600-\u06FF]/.test(
                                        product?.productDescription
                                    )
                                        ? "rtl"
                                        : "ltr",
                                }}
                            >
                                {product?.productDescription
                                    ? product.productDescription.split("\n").map((line, index) => (
                                        <p key={index} style={{ margin: "0 0 0.5em 0" }}>
                                            {line}
                                        </p>
                                    ))
                                    : <p>No description available.</p>
                                }
                            </div>
                        </div>

                        {/* Product Highlights */}
                        {product.specifications && (
    <div className="w-full lg:w-5/12">
        <h2 className="text-gray-900 text-lg font-medium">
            {t("highlights")}
        </h2>
        <ul className="list-disc text-gray-600 text-sm custom-scrollbar max-h-40 mt-4 overflow-y-auto pl-5">
            {/* Check if specifications is an array */}
            {Array.isArray(product.specifications) ? (
                product.specifications.map((spec, index) => (
                    <li key={index} className="mb-2">
                        <div className="p-2 w-full">
                            <strong>{spec.key}:</strong> {spec.value}
                        </div>
                    </li>
                ))
            ) : (
                // If specifications is an object, use Object.entries
                Object.entries(product.specifications).map(([key, value], index) => (
                    <li key={index} className="mb-2">
                        <div className="p-2 w-full">
                            <strong>{key}:</strong> {typeof value === "object" && value !== null ? value.value : value}
                        </div>
                    </li>
                ))
            )}
        </ul>
    </div>
)}

                        <div className="font-bold my-6">
                            {/* TODO add reviews */}
                            {t("supplier")}  :
                            <Link className="text-blue-600 font-bold underline" to={`/supplier/${product?.supplier_id}`}>
                                {product?.supplier_name}
                            </Link>
                        </div>
                    </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                    <div className="max-w-3xl mx-auto px-4">
                        {/* ✅ Show Review Form Only If User Hasn't Added a Review */}
                        {token && showForm && (
                            <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg">
                                <h2 className="text-gray-700 text-lg font-bold">
                                    {editingReviewId ? t("updateReview") : t("addReview")}
                                </h2>

                                {/* ⭐⭐⭐⭐⭐ Star Rating */}
                                <div className="flex mt-3 space-x-1">
                                    <Rating
                                        name="user-rating"
                                        value={rating}
                                        precision={0.5}
                                        onChange={(_, newValue) => setRating(newValue || 0)}
                                    />
                                </div>

                                {/* Review Text Input */}
                                <textarea
                                    className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-mainColor mt-4"
                                    placeholder={t("writeComment")}
                                    rows={3}
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                ></textarea>

                                {/* Submit Button */}
                                <button
                                    onClick={handleReviewSubmit}
                                    className="bg-mainColor rounded-lg text-white w-full font-semibold hover:bg-opacity-90 mt-4 py-2 transition"
                                >
                                    {editingReviewId ? t("update") : t("send")}
                                </button>
                            </div>
                        )}

                        {!token && <p className="text-red-500 mt-4">{t("loginRequired")}</p>}

                        {/* ✅ Show Only Reviews Related to the Product */}
                        {productReviews.length > 0 ? (
                            <div className="custom-scrollbar max-h-80 mt-4 overflow-y-auto space-y-6">
                                {productReviews.map((review) => (
                                    <div key={review.id} className="border-b border-gray-300 pb-6">
                                        {/* Review Content */}
                                        <div className="flex-1">
                                            {/* Username and Rating */}
                                            {/* <div className="flex justify-between items-center">
                                                <div className="text-gray-900 text-sm font-medium">
                                                    {review.user_name}
                                                </div> */}
                                                <div className="flex justify-between items-center mt-4">
              <div className="flex items-center">
                <img src="/images/pexels-photo-4068314.webp" alt="User Icon" className="h-6 rounded-full w-6 mr-2" />
                <span className="text-gray-900 text-sm font-medium">{review.user_name}</span>
              </div>
                                                <Rating
                                                    name="half-rating-read"
                                                    value={review.rating}
                                                    precision={0.5}
                                                    readOnly
                                                />
                                            </div>
                                            {/* Review Comment */}
                                            <p className="text-gray-600 text-sm mt-2">{review.review_text}</p>

                                            {/* ✅ Edit & Delete Buttons Only for Logged-in User */}
                                            {review.user === parseInt(userId || "0") && (
                                                <div className="mt-2 space-x-4">
                                                    <button onClick={() => handleEdit(review.id, review.rating, review.review_text)} className="text-blue-600 hover:underline">
                                                        {t("edit")}
                                                    </button>
                                                    <button onClick={() => handleDelete(review.id)} className="text-red-600 hover:underline">
                                                        {t("delete")}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center min-h-32">{t("noReviews")}</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}