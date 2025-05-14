import { MdLocalOffer, MdOutlineFavorite, MdOutlineStar } from "react-icons/md";
import { TiArrowSortedDown, TiShoppingCart } from "react-icons/ti";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaShoppingBag, FaTruck } from "react-icons/fa";
import { t } from "i18next";
import '../../styles/Product-automotion.css';
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import useFavorite from "../../Hooks/useFavorite";
import { useQuery, useQueryClient } from "@tanstack/react-query";
export const SupplierCard = ({ product, index }: any) => {
    const { isFavorite, toggleFavorite } = useFavorite(product?.id);
    const messages = [
        { icon: <FaTruck className="text-[#C40000]" />, text: t("fastDelivery") },
        { icon: <TiArrowSortedDown className="text-[#C40000]" />, text: t("lowerPrice") },
        { icon: <MdLocalOffer className="text-[#C40000]" />, text: t("dailyOffer") },
        { icon: <FaShoppingBag className="text-[#C40000]" />, text: t("shopLimits") },
    ];
    // reviews
    const { data: reviews, isLoading } = useQuery({
        queryKey: ["productReviews", product.id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/products/reviews/?product=${product.id}`);
            return response.data;
        },
        staleTime: 1000 * 60 * 1, // Cache for 5 minutes
    });

    // Discount
    const hasDiscount =
    product?.price_before_discount &&
    product?.price_after_discount &&
    product?.price_before_discount !== product?.price_after_discount;

  


    // ✅ Calculate Average Rating
    const totalReviews = reviews?.length || 0;
    const averageRating = totalReviews
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
        : "0";
    
    const BASE_URL = "http://127.0.0.1:8000";
    const queryClient = useQueryClient();
    const message = messages[index % messages.length];

    const discountPercentage = product?.price_before_discount && product?.price_after_discount
        ? ((product.price_before_discount - product.price_after_discount) / product.price_before_discount) * 100
        : 0;

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


    // ✅ Fetch Reviews for Specific Product
   
    };

    return (
        <div className="relative flex flex-col bg-white overflow-hidden border border-gray-200 rounded-xl shadow-md h-[18rem]">
            <div className="p-2 w-full h-full flex flex-col">
                {/* Image Section */}
                <div className="relative w-full h-40 mb-2">
                    {/* Best Seller Badge */}
                    {product?.total_sold > 50 && (
                        <span className="absolute px-2 py-1 text-xs text-white rounded-lg top-2 start-2 bg-stone-600 z-10">
                            Best Seller
                        </span>
                    )}
                    
                    {/* Favorite Button */}
                    <button 
                        className={`absolute top-2 end-2 flex items-center justify-center w-8 h-8 bg-white shadow-lg rounded-full cursor-pointer z-1 ${isFavorite ? "text-red-500" : "text-gray-500"}`}
                        onClick={toggleFavorite}
                    >
                        <MdOutlineFavorite className="text-lg" />
                    </button>

                    {/* Product Image */}
                    <Link to={`/products/${product?.id}`} className="block w-full h-full">
                        <div className="w-full h-full flex items-center justify-center">
                            <img
                                className="object-contain w-full h-full rounded-lg max-h-40"
                                src={product?.images?.[0]?.image ? `${BASE_URL}${product.images[0].image}` : "https://via.placeholder.com/150"}
                                alt={product?.productName || "Product Image"}
                            />
                        </div>
                    </Link>

                    {/* Bottom Badges */}
                    <div className="absolute bottom-2 flex justify-between w-full px-2">
                        {/* Views Badge */}
                        <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-md shadow-lg">
                            <div className="flex items-center">
                                <span className="text-xs">{averageRating}</span>
                                <MdOutlineStar className="text-xs text-red-500" />
                            </div>
                            <span className="text-xs text-gray-500">({totalReviews})</span>
                        </div>

                        
                        {/* Cart Button */}
                        {/* <button 
                            className="flex items-center justify-center w-8 h-8 text-black bg-white rounded-full shadow-lg cursor-pointer"
                            onClick={() => addToCart()}
                        >
                            <TiShoppingCart className="text-lg" />
                        </button> */}
                         {product.stock_quantity > 0 ? (
                          <div
                            className="flex items-center p-1 text-lg tablet:text-xl text-black bg-white rounded-md shadow-lg cursor-pointer"
                            onClick={() => addToCart()}
                          >
                            <TiShoppingCart />
                          </div>
                        ) : (
                          <div
                            className="flex items-center p-1 text-lg tablet:text-xl text-red-600 bg-white rounded-md shadow-lg cursor-not-allowed"
                            title="Out of Stock"
                          >
                             <IoMdCloseCircleOutline />
                          </div>
                        )}
                    </div>
                </div>

                {/* Product Details - Fixed height content area */}
                <div className="flex flex-col h-28 ]">
                    {/* Product Name - Fixed height */}
                    <h2 className="text-xs font-semibold text-gray-800 text-ellipsis line-clamp-2 h-8  mb-1">
                        <Link to={`/products/${product?.id}`}>{product?.productName}</Link>
                    </h2>
                    <div className="flex flex-col mt-1 gap-[2px]">
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
                    {/* Price Section - Fixed height - MODIFIED TO KEEP PRICE AND DISCOUNT IN SAME ROW */}
                    {/* <div className="flex items-center flex-wrap sm:flex-nowrap h-6 mb-1 gap-1 ">
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-extrabold text-gray-900">
                                {product?.price_after_discount} جنيه
                            </span>
                            
                            {product?.price_before_discount && product?.price_before_discount !== product?.price_after_discount && (
                                <span className="text-xs text-gray-500 line-through">
                                    {product?.price_before_discount}
                                </span>
                            )}
                        </div>
                        
                        {discountPercentage > 0 && (
                            <span className="px-1 py-0.5 text-xs font-bold rounded-md text-[#c40000] whitespace-nowrap">
                                {discountPercentage.toFixed(0)}% {t("discount")}
                            </span>
                        )}
                    </div> */}

                    {/* Messages Section - Fixed height */}
                    <div className="automotion-section mt-auto relative text-xs h-10">
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
                </div>
            </div>
        </div>
    );
};