import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/basic/Header";
import "../../styles/Supplier.css";
import Footer from "../../components/basic/Footer";
import SupplierSlider from "./SupplierSlider";
import i18next from "i18next";
import axiosInstance from "../../api/axiosInstance";
import { Email, Star } from "@mui/icons-material";
import { t } from "i18next";
function Supplier() {
  const { id } = useParams(); // Dynamic supplier ID from the URL
  const [supplier, setSupplier] = useState(null);
  const [supplierInfo, setSupplierInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isEnglish = i18next.language === "en";
  const fetchSupplierProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/products/supplier/${id}/products/`);
      setSupplier(response.data);
      console.log(response.data);
    } catch (err) {
      setError("Failed to fetch supplier data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchSupplierInfo = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/products/supplier/${id}/reviews-summary/`);
      setSupplierInfo(response.data);
      console.log(response.data);
    } catch (err) {
      setError("Failed to fetch supplier data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (id) {
      fetchSupplierProducts();
      fetchSupplierInfo();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner border-4 border-blue-400 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-20">{error}</div>;
  }

  if (!supplier) {
    return <div className="text-center mt-20">No data available</div>;
  }

  return (
    <div className="relative">
      <Header />
      <div className="supplierBg relative w-full h-72">
        <div
          className={`w-28 h-28 overflow-hidden rounded-full absolute bottom-[-3.5rem] border-4 border-[rgb(243, 244, 248)] ${
            isEnglish ? "left-10" : "right-10"
          }`}
        >
          <img
            className="object-cover w-full h-full"
            src={"/public/images/photokhi.jpg"}
            alt={"Supplier"}
          />
        </div>
      </div>
      <div className=" mt-16 px-2">
        <div>
          <h2 className="font-extrabold text-xl my-3">{supplierInfo.supplier_name || "Unknown Supplier"}</h2>
          <h5 className="text-[#c40000] my-3"><Email/> :  <span className="text-gray-700 font-bold">{supplierInfo.supplier_email} </span></h5>
          <div className="flex gap-5">
            <div className="border w-40 p-4 h-24 rounded-lg shadow-sm my-10">
              <h2 className="font-bold text-l text-[#404553]">{t("supplier_rating")}</h2>
              <div className="flex items-center mt-2">
                <h2 className="font-extrabold text-xl text-yellow-500 flex  items-center gap-1 ">
                 {supplierInfo.average_rating } 
                 <h3 
                    className={
                      supplierInfo.average_rating > 0 && supplierInfo.average_rating < 3 
                        ? "text-red-500" 
                        : supplierInfo.average_rating >= 3 && supplierInfo.average_rating < 4 
                        ? "text-yellow-500" 
                        : supplierInfo.average_rating >= 4 
                        ? "text-green-500" 
                        : "text-yellow-500" // في حال كانت القيمة 0 أو غير موجودة
                    }
                  >
                    <Star/>
                  </h3>
                </h2>
              </div>
            </div>
            <div className="border w-40 p-4 h-24 rounded-lg shadow-sm my-10">
              <h2 className="font-extrabold text-xl text-[#404553]">{t("customers")}</h2>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl text-[#404553]">
                  {supplierInfo.total_reviews }
                </span>
                <p className="font-semibold text-xs text-gray-500">{t("last_90_days")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SupplierSlider Component for displaying products */}
      <div className="mt-8 ">
        <SupplierSlider
          // title="جميع المنتجات"
          title={t("all_products")}
          link={`supplier/${id}/products/`}
          products={supplier.results || []}
          isLoading={isLoading}
        />
      </div>

      <Footer />
    </div>
  );
}

export default Supplier;
