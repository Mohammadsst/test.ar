import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import {
    getUserWishlist,
    removeProductFromWishlist,
} from "../../../api/userRequests";
import Loader from "../../../components/reusables/Loader";
import "../../../styles/wishlist.css";
import { Product } from "../../../types";
import { FaHeart } from "react-icons/fa";
const BASE_URL = "http://127.0.0.1:8000";


export default function Wishlist() {
    const { data, error, isLoading,refetch } = useQuery({
        queryKey: ["account", "favorites", "products"],
        queryFn: () => getUserWishlist(),
    });

    async function removeFromWishlist(id: string) {
        console.log("Product with id:" + id + " was removed from wishlist");
        try {
            const response = await removeProductFromWishlist(id);
            console.log(response);
            
            if (response && response.status === 204) {
                await refetch();
            }
        } catch (error) {
            console.error("Error removing product from wishlist:", error);
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center mt-44">
                <Loader isLoading={true} />
            </div>
        );
    }

    if (error) {
        return <div>Error loading user wishlist.</div>;
    }
  

    return (
        <div className="w-full p-10 pb-20 mx-auto my-5 bg-white">
            {data?.data.length > 0 ? (
                <>
                    {/* <p className="mb-10 font-semibold text-gray-700">
                        {t("wishlist")}
                    </p> */}
                  <div className="text-center mb-12">
    <h1 className="flex justify-center items-center gap-2 text-3xl sm:text-4xl font-bold text-gray-800 tracking-wide">
    {t("wishlist")}
        <FaHeart className="text-mainColor text-2xl" />
       
    </h1>
    <div className="mt-2 h-1 w-20 bg-mainColor mx-auto rounded-full"></div>
</div>


                    <div className="flex flex-wrap items-center justify-center gap-4 h-96">
                        {data?.data.map((product: Product) => (
                            <div
                                key={product.id}
                                className="flex flex-col items-center w-64 p-4 bg-white rounded-lg shadow-lg"
                                style={{ height: "430px" }}
                            >
                                <img
                                    src={product?.images?.[0]?.image ? `${BASE_URL}${product.images[0].image}` : "https://via.placeholder.com/150"}
                                    alt={product.productName}
                                    className="object-cover w-48 h-48 mb-4 rounded-md"
                                />
                                <p className="text-sm font-medium text-gray-500">
                                    {product.brand_details.translations.en.name}
                                </p>
                                <p className="mt-2 mb-1 font-semibold text-center text-gray-800 line-clamp-2">
                                    {product.productName}
                                </p>
                                {/* <div className="flex items-center gap-2 mt-auto space-x-2">
                                    <span className="text-gray-500 line-through">
                                        {product.price_before_discount}{" "}
                                        {t("currency")}
                                    </span>
                                    <span className="font-bold text-mainColor">
                                        {product.price_after_discount}{" "}
                                        {t("currency")}
                                    </span>
                                </div> */}
                                <div className="flex items-center gap-2 mt-auto space-x-2">
                                        {product.price_before_discount !== product.price_after_discount && (
                                            <span className="text-gray-500 line-through">
                                                {product.price_before_discount} {t("currency")}
                                            </span>
                                        )}
                                        <span className="font-bold text-mainColor">
                                            {product.price_after_discount} {t("currency")}
                                        </span>
                                    </div>

                                <button
                                    onClick={() => removeFromWishlist(product.id)}
                                    className="px-4 py-2 mt-4 text-white rounded-full bg-mainColor"
                                >
                                    {t("remove")}
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center ">
                    <img
                        className="object-cover mt-5 mb-12 rounded-full shadow-2xl w-52 h-52"
                        src="/images/pexels-photo-4068314.webp"
                        alt="profile"
                    />
                    <p className="mb-3 text-xl font-bold text-gray-700">
                        {t("readyToMakeAWish")}
                    </p>
                    <p className="text-sm font-light text-gray-500">
                        {t("addToWishlistMessage")}
                    </p>
                </div>
            )}
        </div>
    );
}