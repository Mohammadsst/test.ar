
import { Product } from "../../../../types";
import axiosInstance from "../../../../api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { MdOutlineStar } from "react-icons/md";
interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
}

const BASE_URL = "http://127.0.0.1:8000";

const ProductCard = ({ product, onDelete }: ProductCardProps) => {
  if (!product || !product.id) return null; // Prevents undefined errors

  const { data: reviews } = useQuery({
    queryKey: ["productReviews", product.id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/reviews/?product=${product.id}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 1,
  });
  
  const totalReviews = reviews?.length || 0;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum: number, review: any) => sum + review.rating, 0) /
          totalReviews
        ).toFixed(1)
      : "0";

  const discountPercentage =
    product.price_before_discount &&
    product.price_before_discount > product.price_after_discount
      ? ((product.price_before_discount - product.price_after_discount) /
          product.price_before_discount) *
        100
      : 0;
      const total_sold = Math.min(product.total_sold, product.stock_quantity);
      const Exist_quantity = product.stock_quantity - total_sold;
      


  return (

    <div className="relative bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col w-64 h-[18rem]">
  {/* Best Seller Badge */}
  {product.total_sold > 50 && (
    <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-0.5 rounded z-10">
      Best Seller
    </span>
  )}

  {/* Product Image */}
  <div className="flex justify-center items-center h-28 mb-2">
    <img
      className="h-full object-contain rounded"
      src={
        product?.images?.[0]?.image
          ? `${BASE_URL}${product.images[0].image}`
          : "https://via.placeholder.com/150"
      }
      alt={product?.productName || "Product Image"}
    />
  </div>

  {/* Product Info */}
  <div className="flex flex-col justify-between flex-grow">
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
        {product.productName}
      </h3>

      {/* Price & Discount */}
      <div className="flex items-center justify-between mb-1 text-sm">
        <span className="font-bold text-gray-900">{product.price_after_discount} جنيه</span>
        {discountPercentage > 0 && (
          <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded">
            {discountPercentage.toFixed(0)}% خصم
          </span>
        )}
      </div>
      {product.price_before_discount !== product.price_after_discount && (
        <div className="text-xs text-gray-400 line-through">
          {product.price_before_discount}
        </div>
      )}
    </div>

    {/* Ratings & Total Sold */}
    <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
    <span className="text-red-500">{averageRating}</span>
    <MdOutlineStar className="text-sm text-red-500" />
  <span>({totalReviews})</span>
  <span>• Sold: {product.total_sold}</span>
</div>
<div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
  <span className="text-gray-600">📦</span>
  <span> Available Stock: {Exist_quantity}</span>
</div>

</div>


  {/* Delete Button */}
  <button
    onClick={() => onDelete(product.id)}
    className="absolute bottom-2 right-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded hover:bg-red-600"
  >
    Delete
  </button>
</div>

  );
};

export default ProductCard;
