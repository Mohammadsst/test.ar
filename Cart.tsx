import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { deleteOrderItem, getUserCart, updateOrderItem } from "../../api/userRequests";
import Loader from "../../components/reusables/Loader";
import axiosInstance from "../../api/axiosInstance";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const navigate = useNavigate();
    const [updatedQuantities, setUpdatedQuantities] = useState<Record<string, number>>({});

    const { data, error, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ["order", "cart", "details"],
        queryFn: () => getUserCart(),
    });

    useEffect(() => {
        if (data?.data.items) {
            setUpdatedQuantities(
                data.data.items.reduce((acc, item) => {
                    acc[item.id] = item.quantity;
                    return acc;
                }, {} as Record<string, number>)
            );
        }
    }, [data]);

    const handleQuantityChange = async (itemId: string, quantity: number) => {
        setUpdatedQuantities(prev => ({
            ...prev,
            [itemId]: quantity
        }));
    
        try {
            await updateOrderItem(itemId, quantity);
            setTimeout(() => refetch(), 500);
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        try {
            await deleteOrderItem(itemId);
            refetch();
        } catch (error) {
            console.log(error);
        }
    };

    const newTotalPrice = useMemo(() => {
        return data?.data.items.reduce((total, item) => {
            const quantity = updatedQuantities[item.id] ?? item.quantity;
            return total + quantity * item.product.price_after_discount;
        }, 0).toFixed(2);
    }, [updatedQuantities, data]);

    if (isLoading || isRefetching) {
        return (
            <div className="flex items-center justify-center mt-44">
                <Loader isLoading={true} />
            </div>
        );
    }

    if (error) {
        return <div>Error loading user cart.</div>;
    }

    if (data?.data.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center my-20">
                <img
                    className="object-cover mt-5 mb-12 rounded-full shadow-2xl w-52 h-52"
                    src="https://images.pexels.com/photos/20614095/pexels-photo-20614095/free-photo-of-shopping-cart-against-orange-background.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Empty Cart"
                />
                <p className="mb-3 text-xl font-bold text-gray-700">{t("cartEmpty")}</p>
                <p className="text-sm font-light text-gray-500">{t("startShopping")}</p>
            </div>
        );
    }

    // const handleCreateOrder = async () => {
    //     try {
    //         const token = localStorage.getItem("accessToken");
    //         if (!token) {
    //             console.log("Authentication token not found. Please log in.");
    //             return;
    //         }
    //         await refetch(); 

    //         localStorage.removeItem('orderId'); // new addition
    //         const response = await axiosInstance.post(`/order/checkout/`, {}, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         localStorage.setItem('orderId', response.data.order_id);
    //         console.log(response);
    //         navigate("/profile/checkout");
    //     } catch (error) {
    //         console.log(error);
    //         const message =
    //         error?.response?.data?.detail || 
    //         "An unexpected error occurred while creating your order.";

    //         toast.error(message, { position: "top-right" });
    //     }
    // };
    const handleCreateOrder = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.log("Authentication token not found. Please log in.");
                return;
            }
    
            await refetch(); 
    
            localStorage.removeItem('orderId');
            const response = await axiosInstance.post(`/order/checkout/`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            localStorage.setItem('orderId', response.data.order_id);
            navigate("/profile/checkout");
    
        } catch (error: any) {
            console.log(error);
    
            const detail = error?.response?.data?.detail;
    
            if (Array.isArray(detail)) {
                // Multiple errors from backend — show all with toast
                detail.forEach((msg: string) => {
                    toast.error(msg, { position: "top-right" });
                });
            } else {
                const message =
                    detail ||
                    "An unexpected error occurred while creating your order.";
                toast.error(message, { position: "top-right" });
            }
        }
    };
    

    return (
        <div className="max-w-4xl p-6 mx-auto my-10 bg-white rounded-lg shadow-lg">
            <h2 className="mb-6 text-3xl font-semibold">Your Cart</h2>
            <div className="space-y-8">
                {data?.data.items.map((item: any) => (
                    <div key={item.id} className="flex items-center p-4 space-x-6 border-b border-gray-200">
                        <div className="flex items-center justify-center overflow-hidden w-36 h-36 me-5">
                            <img
                                src={item?.product?.images[0]?.image || "/images/pexels-photo-4068314.webp"}
                                alt={item.product?.name}
                                className="object-cover w-full h-full border-2 border-gray-200 rounded-lg"
                            />
                        </div>

                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900">{item.product.name}</h3>
                            <span className="flex align-middle">
                                <label className="mx-1 text-lg text-gray-700">{t("price")} {":  "}</label>
                                <p className="text-lg text-gray-600">
                                    {item.product.price_after_discount} {t("currency")}
                                </p>
                            </span>

                            <div className="flex items-center mt-3">
                                <label className="mr-4 text-lg font-semibold text-gray-700">{t("quantity")} :</label>
                                <select
                                    value={updatedQuantities[item.id] ?? item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                    className="w-24 h-10 px-2 py-1 font-semibold text-center text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                >
                                    {[...Array(10)].map((_, index) => (
                                        <option key={index + 1} value={index + 1}>
                                            {index + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <p className="mt-3 text-lg font-semibold text-gray-900">
                                {t("subtotal")} : {(updatedQuantities[item.id] ?? item.quantity) * item.product.price_after_discount} {t("currency")}
                            </p>
                            <button
                                onClick={() => handleRemoveItem(item.product.id)}
                                className="mt-3 text-sm text-red-600 hover:text-red-800"
                            >
                                {t("remove")}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-right">
                <h3 className="text-2xl font-semibold text-gray-900">
                    Total: ج.م {newTotalPrice}
                </h3>
                {/* <Link to={"/profile/checkout"}>
                    <button className="px-8 py-3 mt-6 text-white rounded-lg bg-mainColor" onClick={handleCreateOrder}>
                        Proceed to Checkout
                    </button>
                </Link> */}
                <button
    className="px-8 py-3 mt-6 text-white rounded-lg bg-mainColor"
    onClick={handleCreateOrder}
>
    Proceed to Checkout
</button>
            </div>
        </div>
    );
};

export default CartPage;
