
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import { ReceiptIcon, HomeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format , addDays } from "date-fns";
import {
  FaHashtag,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTruck,
  FaFileInvoice,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaPrint,
  FaDownload,
} from "react-icons/fa";
// Define types for order and items for better type safety
interface Product {
  productName: string;
  price_after_discount: string;
  images: { image: string }[];
}

interface OrderItem {
  id: string;
  quantity: number;
  product: Product;
}

interface Order {
  id: string;
  created: string;
  payment_method: string;
  shipping_status: string;
  order_items: OrderItem[];
  total_price: string;
}

const OrderDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/order/orderdetail/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);
      } catch (error) {
        setError("Error fetching order details.");
        console.error("Error fetching order", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleBackToShopping = () => {
    navigate("/");

  const handlePrint = () => window.print();
  const estimatedDelivery = addDays(new Date(order.created), 4); // e.g., 4 days after order


  };

  if (loading) return <div className="p-6">{t("loading")}...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!order) return <div className="p-6">{t("order_not_found")}</div>;


  return (
    <div className="bg-gray-100 min-h-screen px-3 sm:px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-10 text-gray-800">
          {t("your_order_detail")}
        </h1>

        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 transition-all duration-300 space-y-6">
          {/* Order Info */}
          <div className="border-b pb-4 sm:pb-5">
            <h2 className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-1 mb-1 break-words">
              {t("order_id")}:
              <span className="text-blue-600 text-sm sm:text-base  break-all">{order.id}</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-3 text-sm sm:text-base text-gray-700">
              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-orange-400" />
                <strong>{t("order_date")}:</strong>{" "}
                {format(new Date(order.created), "eeee, MMM d, yyyy")}
              </p>
              <p className="flex items-center gap-2">
                <FaMoneyBillWave className="text-green-500" />
                <strong>{t("payment_method")}:</strong>{" "}
                {order.payment_method === "COD"
                  ? t("cash_on_delivery")
                  : order.payment_method}
              </p>
              <p className="flex items-center gap-2 col-span-full sm:col-span-1">
                <FaTruck className="text-purple-500" />
                <strong>{t("status")}:</strong>
                <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded-full text-xs">
                  {t(`shipping_status.${order.shipping_status}`)}
                </span>
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-5">
            {order.order_items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-4"
              >
                <img
                  src={item.product.images?.[0]?.image || "https://via.placeholder.com/80"}
                  alt={item.product.productName}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <div className="flex-1 space-y-1 text-sm sm:text-base">
                  <p className="font-semibold text-gray-800">
                    <FaShoppingBag className="inline-block mr-1 text-red-500" />
                    {item.product.productName}
                  </p>
                  <p className="text-gray-600">
                    {t("quantity")}: <strong>{item.quantity}</strong>
                  </p>
                  <p className="text-gray-600">
                    {t("price")}:{" "}
                    <strong>${item.product.price_after_discount}</strong>
                  </p>
                  <p className="text-gray-800">
                    {t("subtotal")}:{" "}
                    <strong>
                      $
                      {(
                        parseFloat(item.product.price_after_discount) *
                        item.quantity
                      ).toFixed(2)}
                    </strong>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total Summary */}
          <div className="text-right">
            <p className="text-lg sm:text-xl font-bold text-gray-800">
              {t("total_price")}:{" "}
              <span className="text-blue-600 font-extrabold">
                ${order.total_price}
              </span>
            </p>
          </div>

          {/* Buttons - Responsive */}
          <div className="flex justify-between flex-wrap sm:flex-nowrap gap-4 mt-8">
            <button
              onClick={() => navigate(`/profile/invoice/${order.id}`)}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-yellow-600 text-white px-4 py-2 rounded-full text-sm font-semibold w-full sm:w-auto"
            >
              <FaFileInvoice className="w-4 h-4" />
              <span className="hidden sm:inline">{t("view_invoice")}</span>
            </button>

            <button
              onClick={handleBackToShopping}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-black text-white px-4 py-2 rounded-full text-sm font-semibold w-full sm:w-auto"
            >
              <HomeIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{t("continue_shopping")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
