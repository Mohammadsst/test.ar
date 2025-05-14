import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { UserIcon, PackageIcon, CheckCircle, XCircle } from "lucide-react";

interface User {
  full_name: string;
  email: string;
}

interface OrderItem {
  id: number;
  product: {
    productName: string;
    price_after_discount: string;
  };
  quantity: number;
  total_price: number;
}

interface Order {
  id: string;
  is_paid: boolean;
  created: string;
  paid_date?: string;
  payment_method: string;
  applied_promo_code?: string;
  total_price: string;
  order_items: OrderItem[];
  user: User;
  invoice_no : string;
}

const InvoicePage: React.FC = () => {
  const { t } = useTranslation(); // Import translation function
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `http://127.0.0.1:8000/en/api/order/orderdetail/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrder(response.data);
      } catch (err: any) {
        setError(t("error.fetch"));
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, t]);

  const getFirstName = (fullName: string) => {
    return fullName.split(" ")[0];
  };

  if (loading) {
    return (
      <div className="flex bg-gray-100 justify-center items-center min-h-screen">
        <p>{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-gray-100 justify-center items-center min-h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex bg-gray-100 justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">{t("error.no_order")}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      // className="bg-gray-100 min-h-screen px-4 py-10"
      className="bg-gray-100 min-h-screen px-4 sm:px-6 md:px-10 py-8"
    >
       {/* Greeting */}
       <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-700 font-bold">
        
          {t("greeting", { name: getFirstName(order.user.full_name) })}
        </h1>
        <p className="text-gray-500">{t("invoice_summary")}</p>
      </div>

      {/* Invoice Content */}
      <div 
      // className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto"
      className="bg-white px-4 py-6 sm:p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto"

      >
        {/* Logo */}
        <div className="flex justify-center items-center mb-6">

          <img
            src="/images/logo.png" 
            alt="Company Logo"
            className="h-16"
          />
        </div>

        {/* User Information */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center mb-4">
            <UserIcon className="h-6 text-red-600 w-6 mr-2" />
            <h3 className="text-red-600 text-xl font-semibold">{t("bill_to")}</h3>
          </div>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            <strong>{t("name")}:</strong> {order.user.full_name}
            <br />
            <strong>{t("email")}:</strong> {order.user.email}
            <br />
            <strong>{t("order_id")}:</strong> {order.id.slice(-12) }
          </p>
        </div>

        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 items-start sm:items-center mb-6">

          <p className="text-lg font-bold">
            {t("invoice_number", { number: order.invoice_no })}
          </p>
          <div className="text-gray-700">
  <p>
    {t("created")} <span className="text-red-600">{format(new Date(order.created), "MMMM dd, yyyy")}</span>
  </p>
  {order.is_paid && order.paid_date && (
    <p>
      {t("paid_date")} <span className="text-green-600">{format(new Date(order.paid_date), "MMMM dd, yyyy")}</span>
    </p>
  )}
</div>

        </div>

        {/* Items Bought */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center mb-4">
            <PackageIcon className="h-6 text-red-600 w-6 mr-2" />
            <h3 className="text-red-600 text-xl font-semibold">{t("items_bought")}</h3>
          </div>
          <div className="overflow-x-auto">
  <table className="min-w-full table-auto">
          {/* <table className="bg-white border-collapse shadow-sm w-full mt-4"> */}
            <thead>
              <tr className="justify-content-center">
                <th className="bg-red-600 p-2 text-center text-white">{t("product_name")}</th>
                <th className="bg-red-600 p-2 text-center text-white">{t("price")}</th>
                <th className="bg-red-600 p-2 text-center text-white">{t("quantity")}</th>
                <th className="bg-red-600 p-2 text-center text-white">{t("subtotal")}</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((item) => (
                <motion.tr key={item.id} className="hover:bg-gray-100" whileHover={{ scale: 1.01 }}>
                  <td className="border p-2 text-center">{item.product.productName}</td>
                  <td className="border p-2 text-center">${item.product.price_after_discount}</td>
                  <td className="border p-2 text-center">{item.quantity}</td>
                  <td className="border p-2 text-center">${item.total_price}</td>
                </motion.tr>
              ))}
              {/* Total Row */}
              <tr className="bg-gray-200 font-bold">
                <td className="border p-4 text-lg text-red-600" colSpan={3}>
                  {order.applied_promo_code ? t("total_after_discount") : t("total")}
                </td>
                <td className="border p-4 text-green-600 text-right text-xl">${order.total_price}</td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>

        {/* Payment Status */}
        {/* <div className="text-center mt-6">
          <h3 className="flex justify-center text-lg font-semibold items-center">
            {order.is_paid ? (
              <>
                <CheckCircle className="h-6 text-green-600 w-6 mr-2" />
                
                <span className="text-green-600">{t("paid", { method: order.payment_method })}</span>
              </>
            ) : (
              <>
                <XCircle className="h-6 text-red-600 w-6 mr-2" />
                <span className="text-red-600">{t("unpaid")}</span>
              </>
            )}
          </h3>
          <p className="font-bold mt-4">{t("thank_you")}</p>
        </div> */}
        <div className="text-center mt-6">
  <h3 className="flex justify-center text-lg font-semibold items-center">
    {order.is_paid ? (
      <>
        <CheckCircle className="h-6 text-green-600 w-6 mr-2" />
        <span className="text-green-600">
          {t("paid", {
            method: order.payment_method === "COD" ? t("cash_on_delivery") : order.payment_method,
          })}
        </span>
      </>
    ) : (
      <>
        <XCircle className="h-6 text-red-600 w-6 mr-2" />
        <span className="text-red-600">{t("unpaid")}</span>
      </>
    )}
  </h3>
  <p className="font-bold mt-4">{t("thank_you")}</p>
</div>


        {/* Action Buttons */}
        <div  className="flex flex-col sm:flex-row justify-between gap-4 mt-6">

          <button onClick={() => navigate("/")} className="bg-gray-700 rounded-lg text-white px-4 py-2">
            {t("back_home")}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InvoicePage;
