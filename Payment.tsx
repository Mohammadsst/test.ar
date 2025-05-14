import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUser } from "../../../../public/utils/functions";
import axiosInstance from "../../../api/axiosInstance";
import { getUserCart, getUserInfo } from "../../../api/userRequests";
import { TokenType } from "../../../types";
import { t } from "i18next";
import { MdContentCopy } from "react-icons/md";
import Swal from "sweetalert2";
import { Info } from "lucide-react";

interface Props {
    navigate?: () => void;
}

interface CardDetails {
    number: string;
    expiry: string;
    name: string;
    cvv: string;
}
const Payment: React.FC<Props> = ({
    navigate = () => console.log("navigate form inside Payment"),
}) => {
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [totalPriceOrder, setTotalPriceOrder] = useState<number>(0);
    const [proofImage, setProofImage] = useState<File | null>(null);
    const [error, setError] = useState<string>("");
    const [cardDetails, setCardDetails] = useState<CardDetails>({
        number: "",
        expiry: "",
        name: "",
        cvv: "",
    });
    const [discountCode, setDiscountCode] = useState<string>("");
    const [discount, setDiscount] = useState<number>(0);
    const [isCodeValid, setIsCodeValid] = useState<boolean>(true);
    const textToCopy = "arabiapay@instapay";
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
          })
          .catch((err) => console.error("Failed to copy text:", err));
      };
    const user = getUser(localStorage.getItem("accessToken")) as TokenType;
    const id = user?.user_id;
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axiosInstance.get(`order/orderdetail/${localStorage.getItem("orderId")}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                setTotalPriceOrder(response.data.total_price);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching order details:", error);
            }
        };
    
        fetchOrderDetails();
    }, []);

   
    const { data: userData } = useQuery({
        queryKey: ["payment", "users", id],
        queryFn: () => getUserInfo(id),
    });
    const { data } = useQuery({
        queryKey: ["order", "payment"],
        queryFn: () => getUserCart(),
    });
    console.log(data);
    // console.log(getUserOrders());
    const cartData = data?.data;
    console.log(cartData);

    const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
   

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProofImage(e.target.files[0]);
            setError("");
        }
    };
    const validateDiscountCode = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const orderId = localStorage.getItem("orderId"); 
          if (!token) {
            toast.error("Authentication token not found. Please log in.");
            return;
          }
          if (!orderId) {
            toast.error("Order ID not found.");
            return;
        }
          const response = await axiosInstance.post(
            "/order/apply-promocode/",
            {
                order_id: orderId, 
                promocode: discountCode,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
          console.log(response.data);
          if (response.data) {
            const newTotal = parseFloat(response.data.new_total_price);
            setTotalPriceOrder(newTotal);
            setDiscount(cartData.total_price - newTotal);
            setIsCodeValid(true);
            toast.success(response.data.message);
        } else {
            setDiscount(0);
            setIsCodeValid(false);
            toast.error("Invalid discount code.");
        }
    } catch (error) {
        setDiscount(0);
        setIsCodeValid(false);
        toast.error("Error validating discount code.");
        console.error(error);
    }
      };
      
      const handleProceed = async () => {
        try {
            let response;
            const orderId = localStorage.getItem("orderId");
            const token = localStorage.getItem("accessToken");
    
            if (!orderId || !token) {
                toast.error("Order ID or authentication token not found.");
                return;
            }
    
            switch (paymentMethod) {
                case "COD":
                    try {
                        response = await axiosInstance.post(
                            "/payment/pay-by-cash/",
                            {
                                method: "COD",
                                order: orderId,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
    
                        Swal.fire({
                            title: "Payment Successful!",
                            text: "لقد تم عملية الشراء بنجاح ارابيا بإنتظارك دوماً! شكراً لكونك جزءً من ارابيا",
                            icon: "success",
                            draggable: true,
                        });
                        toast.success("Payment COD Successful!");
    
                        localStorage.removeItem("orderId");
    
                        navigate();
                    } catch (error) {
                        toast.error("Failed to process COD payment. Please try again.");
                        console.error("COD Payment Error:", error);
                    }
                    break;
                case "INSTAPAY":
                    try {
                        const formData = new FormData();
                        formData.append("method", "INSTAPAY");
                        formData.append("order", orderId);
                        formData.append("screenshot", proofImage);
                        formData.append("amount", (cartData.total_price - discount).toString());
                        formData.append("is_paid", "true");
                        formData.append("discount", discount.toString());
    
                        response = await axiosInstance.post(
                            "/payment/instapay/",
                            formData,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        );
    
                        Swal.fire({
                            title: "Payment Successful!",
                            text: "لقد تم عملية الشراء بنجاح ارابيا بإنتظارك دوماً! شكراً لكونك جزءً من ارابيا",
                            icon: "success",
                            draggable: true,
                        });
                        toast.success("Payment InstaPay Successful!");
    
                        localStorage.removeItem("orderId");
                        
                        navigate();
                    } catch (error) {
                        toast.error("Failed to process InstaPay payment. Please upload a valid proof.");
                        console.error("InstaPay Payment Error:", error);
                    }
                    break;
    
                default:
                    toast.error("Invalid payment method selected.");
                    throw new Error("Invalid payment method");
            }
        } catch (error) {
            toast.error(error.message || "Payment failed. Please try again.");
            console.error("Payment Error:", error);
        }
    };
    const resetCardDetails = () => {
        setCardDetails({
            name: "",
            number: "",
            expiry: "",
            cvv: ""
        });
        setPaymentMethod(""); // Reset payment method
    };

    const paymentOptions = [
        {
            value: "COD",
            label: t("paymentMethods.COD.label"),
            img: "/public/images/—Pngtree—cash on delivery bagde olshop_6359688.png",
        },
        {
            value: "CARD",
            label: t("paymentMethods.CARD.label"),
            img: "/public/images/rb_2149126089.png",
            // disabled: true
        },
        
        {
            value: "INSTAPAY",
            label: t("paymentMethods.InstaPay.label"),
            img: "/images/instapay.png",
        },
        
    ];

    return (
        <div className="w-full max-w-3xl mx-auto overflow-hidden rounded-lg shadow-md bg-white">
            <div className="p-8 space-y-8">
                <h2 className="text-2xl font-bold text-gray-800">
                {t("pay_method")}
                </h2>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <span className="text-lg font-semibold text-gray-600">
                    {t("total_price")}
                    </span>
                    <span className="text-2xl font-bold text-mainColor">
                         {totalPriceOrder} {t("carancy")}
                    </span>
                    
                </div>
                <h2 className="text-l font text-gray-800">
                {t("tax")}           
                </h2>
                
    
                
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">
                    {t("pay_method")}
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {paymentOptions.map((option) => (
                            <div key={option.value} className="relative" >
                                <input
                                    type="radio"
                                    disabled={option.disabled}
                                    id={option.value}
                                    name="paymentMethod"
                                    value={option.value}
                                    checked={paymentMethod === option.value}
                                    onChange={() => setPaymentMethod(option.value)}
                                    className="sr-only"
                                />
                                <label
                                    htmlFor={option.value}
                                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                                        paymentMethod === option.value || option.disabled
                                            ? "border-mainColor bg-blue-50 shadow-md cursor-not-allowed"
                                            : "border-gray-200 hover:border-mainColor hover:bg-gray-50"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        disabled={option.disabled}
                                        id={`${option.value}-inline`}
                                        name="paymentMethodInline"
                                        value={option.value}
                                        checked={paymentMethod === option.value}
                                        onChange={() => setPaymentMethod(option.value)}
                                        className="cursor-pointer"
                                    />
                                    <img
                                        src={option.img}
                                        alt={option.label}
                                        width={40}
                                        height={40}
                                        className="object-contain w-20"
                                    />
                                    <span className="text-md font-bold text-gray-700">
                                        {option.label}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {paymentMethod === "CARD" && (
                    <div className="space-y-4">
                        {/* <h2 className="text-l font text-gray-800">
                        Using another method         
                </h2>
                 */}
                 <div className="flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2">
        <Info className="w-6 h-6 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-800">{t("info")}</h2>
      </div>
    </div>
        
                        {/* <h3 className="text-lg font-semibold text-gray-800">
                            Enter Card Details
                        </h3>
                        <span 
                className="text-red-500 cursor-pointer underline"
                onClick={() => setPaymentMethod("")} // Reset payment method
            >
                Using another method
            </span>
                        <div className="space-y-4">
                            <input
                            // disabled
                                type="text"
                                name="name"
                                value={cardDetails.name}
                                onChange={handleCardDetailsChange}
                                placeholder="Mahmoud Ahmed"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                                maxLength={19}
                            />
                            <input
                                type="text"
                                name="number"
                                value={cardDetails.number}
                                onChange={handleCardDetailsChange}
                                placeholder="1234 1234 1234 1234"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                                maxLength={19}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="expiry"
                                    value={cardDetails.expiry}
                                    onChange={handleCardDetailsChange}
                                    placeholder="MM/YY"
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                                    maxLength={5}
                                />
                                <input
                                    type="text"
                                    name="cvv"
                                    value={cardDetails.cvv}
                                    onChange={handleCardDetailsChange}
                                    placeholder="CVV"
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                                    maxLength={3}
                                />
                            </div>
                        </div>
                        */}
                    </div>
                 )} 

                {(paymentMethod === "INSTAPAY") && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 border-l-4 rounded-r-lg bg-blue-50 border-mainColor">
                            <p className="font-medium text-mainColor mr-4">
                                {t("Insta")} : {textToCopy}
                            </p>
                            <button
                                onClick={handleCopy}
                                className="px-3 py-1 bg-mainColor text-white rounded-lg hover:bg-opacity-90"
                            >
                                {copied ? "Copied!" : <MdContentCopy />}
                            </button>
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="proofUpload"
                                className="block text-sm font-medium text-gray-700"
                            >
                               {t("pay_prof")}
                            </label>
                            <input
                                id="proofUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                            />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-4 border-l-4 border-[#c40000] rounded-r-lg bg-red-50">
                        <p className="font-medium text-[#c40000]">{error}</p>
                    </div>
                )}
                    <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                    {t("discoundcode")}
                    </h3>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder={t("discoundcode")}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                        />
                        <button
                            onClick={()=>{
                                validateDiscountCode();
                            }}
                            className="px-4 py-2 text-white bg-mainColor rounded-md hover:bg-opacity-90"
                        >
                              {t("apply")}
                        </button>
                    </div>
                    {!isCodeValid && (
                        <p className="text-sm text-red-600">
                            Invalid discount code.
                        </p>
                    )}
                </div>
                <button
                    className={`w-full py-3 px-4 rounded-md text-white bg-mainColor font-semibold transition-colors ${
                        paymentMethod
                            ? "hover:bg-opacity-90"
                            : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={handleProceed}
                    disabled={!paymentMethod}
                >
                    {t("proceed")}
                </button>
            </div>
        </div>
    );
};

export default Payment;
