import { t } from "i18next";
import { FaShoppingBag, FaTruck } from "react-icons/fa";
import { TiArrowSortedDown, TiShoppingCart } from "react-icons/ti";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { MdLocalOffer, MdOutlineFavorite, MdOutlineStar } from "react-icons/md";
import useFavorite from "../../../Hooks/useFavorite";
import {useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";
import "../../../styles/Product-automotion.css";
import { Link } from "react-router-dom";

export default function ProductYouLikeCard({ product, index }: any) {
    const BASE_URL = "http://127.0.0.1:8000";

    const messages = [
        { icon: <FaTruck className="text-[#C40000] text-xl" />, text: t("fastDelivery") },
        { icon: <TiArrowSortedDown className="text-[#C40000] text-xl" />, text: t("lowerPrice") },
        { icon: <MdLocalOffer className="text-[#C40000] text-xl" />, text: t("dailyOffer") },
        { icon: <FaShoppingBag className="text-[#C40000] text-xl" />, text: t("shopLimits") },
    ];

    // const discountPercentage =
    //     ((product?.price_before_discount - product?.price_after_discount) /
    //         product?.price_before_discount) *
    //     100;
    const { data: reviews, isLoading } = useQuery({
        queryKey: ["productReviews", product.id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/products/reviews/?product=${product.id}`);
            return response.data;
        },
        staleTime: 1000 * 60 * 1, // Cache for 5 minutes
    });

    // ✅ Calculate Average Rating
    const totalReviews = reviews?.length || 0;
    const averageRating = totalReviews
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
        : "0";

    const hasDiscount =
    product?.price_before_discount &&
    product?.price_after_discount &&
    product?.price_before_discount !== product?.price_after_discount;

    const discountPercentage = hasDiscount
    ? ((product?.price_before_discount - product?.price_after_discount) /
        product?.price_before_discount) * 100
    : 0;
    const { isFavorite, toggleFavorite } = useFavorite(product?.id);
    const queryClient = useQueryClient();

    const addToCart = async () => {
        try {
            await axiosInstance.post(
                "/order/addcart/",
                { product_id: product?.id, quantity: 1 },
                { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
            );

            queryClient.invalidateQueries({ queryKey: ["userCart"] });
            toast.success("Product added to cart successfully!");
        } catch (error) {
            toast.error("Failed to add Product to cart!");
            console.error("Error adding product to cart:", error);
        }
    };

    return (
        <div className="w-[220px] rounded-lg shadow-md p-2 mb-5 relative bg-white">
            {/* صورة المنتج */}
            <div className="relative">
            <Link  to={`/products/${product?.id}`}>
            <img
                    className="w-full h-[180px] object-contain rounded-md"
                    src={product?.images?.[0]?.image ? `${BASE_URL}${product.images[0].image}` : "https://via.placeholder.com/150"}
                    alt={product?.name || "Product Image"}
                />
                    </Link>
                

                {/* زر الإضافة إلى المفضلة */}
                <div
                    className={`absolute top-2 left-2 flex items-center justify-center text-xl bg-white shadow-lg p-1.5 rounded-full cursor-pointer hover:scale-110 transition-transform ${
                        isFavorite ? "text-red-500" : "text-gray-500"
                    }`}
                    onClick={toggleFavorite}
                >
                    <MdOutlineFavorite />
                </div>

                {/* شارة التقييم */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-white rounded-md shadow-lg">
                <span className="text-sm  text-gray-900">{averageRating}</span>
                    <MdOutlineStar className="text-sm text-red-500" />
                    <span className="text-sm text-gray-700">({totalReviews})</span>
                                    
                </div>
            </div>

            {/* شارة الخصم */}
            {discountPercentage > 0 && (
                <div className="absolute top-0 right-0 bg-[#C40000] text-white px-2 py-1 rounded-bl-lg font-bold text-xs shadow-md">
                    {discountPercentage.toFixed(0)}% OFF
                </div>
            )}

            {/* تفاصيل المنتج */}
            <div className="p-2">
                <h2 className="pb-1 text-[15px] h-[45px] text-ellipsis w-full font-semibold text-gray-800 truncate text-wrap">
                    <Link className="text-ellipsis line-clamp-2" to={`/products/${product?.id}`}>
                        {product?.productName}
                    </Link>
                </h2>

                {/* <div className="flex items-center gap-1">
                    <span className="font-bold text-[15px] text-gray-900">{product.price_before_discount} جنيه</span>
                    {discountPercentage && (
                        <span className="text-sm text-gray-500 line-through font-medium">{product.price_after_discount} جنيه</span>
                    )}
                </div> */}
                  {/* <div className="flex flex-wrap tablet:flex-nowrap items-center mt-1">
                                <strong className="text-[12px] tablet:text-[12px] font-extrabold pe-1 text-gray-900">
                                    {product?.price_after_discount}جنيه
                                </strong>
                                {hasDiscount && (
                                <>
                        <div className="flex items-end gap-1">
                            <span className="text-[9px] tablet:text-[11px] text-gray-500 line-through">
                                {product?.price_before_discount}
                            </span>
                        </div>
                        
                    </>
            )}
                    </div> */}
                     <div className="flex flex-col mt-1 gap-[2px] min-h-[65px]">
  {hasDiscount && (
    <>
      <strong className="text-[13px] tablet:text-[14px] font-extrabold text-red-600">
        {product?.price_after_discount} {t("carancy")}
       
      </strong>
      <span className="text-[11px] tablet:text-[12px] text-gray-500 line-through">
        {product?.price_before_discount} {t("carancy")}
      </span>
      <span
  className="bg-[#EAF4EC] text-green-900 text-[10px] tablet:text-[11px] px-2 py-[2px] rounded-lg font-bold ml-auto text-end"
>
  وفّر:&nbsp;
  {product?.price_before_discount - product?.price_after_discount} ج.م
</span>



    </>
  )}
  {!hasDiscount && (
   
    <strong className="text-[13px] tablet:text-[14px] font-extrabold text-red-600">
      {product?.price_after_discount} {t("carancy")}
    </strong>
  )}
</div>
            </div>

            {/* رسائل العروض */}
            <div className="automotion-section mt-auto relative text-xs h-10 mx-3">
                {messages.map((msg, msgIndex) => (
                    <div
                        key={msgIndex}
                        className="message"
                        style={{
                            animationDelay: `${((index + msgIndex) % messages.length) * 4}s`,
                        }}
                    >
                        <span className="flex items-center gap-1 text-xs font-bold">
                            {msg.icon}
                            <span>{msg.text}</span>
                        </span>
                    </div>
                ))}
            </div>

            {/* زر الإضافة إلى السلة */}
            {/* <div className="flex justify-center mt-2">
                <button
                    onClick={addToCart}
                    className="w-full bg-[#C40000] text-white font-bold py-2 rounded-md flex items-center justify-center gap-2 hover:bg-red-700 transition"
                >
                    <TiShoppingCart className="text-white text-lg" />
                    {t("addToCart")}
                </button>
            </div> */}
            <div className="flex justify-center mt-2">
  {product?.stock_quantity > 0 ? (
    <button
      onClick={addToCart}
      className="w-full bg-[#C40000] text-white font-bold py-2 rounded-md flex items-center justify-center gap-2 hover:bg-red-700 transition"
    >
      <TiShoppingCart className="text-white text-lg" />
      {t("addToCart")}
    </button>
  ) : (
    <div className="w-full bg-gray-200 text-red-600 font-bold py-2 rounded-md flex items-center justify-center gap-2 cursor-not-allowed">
      {t("outOfStock")}
    </div>
  )}
</div>


        </div>
    );
}
