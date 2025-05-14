import { Backdrop, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
    fetchProduct,
    fetchProductsYouMayLike,
} from "../../api/productRequests";
import ProductInfo from "../../components/shared/products/ProductInfo";
import ProductOverview from "../../components/shared/products/productOverview";
import ProductsYouMayLike from "../../components/shared/products/ProductsYouMayLike";

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const validId = id || "";

    const { data, error, isLoading } = useQuery({
        queryKey: ["product", validId],
        queryFn: () => fetchProduct(validId),
        retry: false,
    });

    const {
        data: productsYouMayLike,
        isLoading: isLoadingYouMayLike,
        error: errorrr,
    } = useQuery({
        queryKey: ["products", validId, "you_may_like"],
        queryFn: () => fetchProductsYouMayLike(validId),
        retry: false,
    });

    console.log("🚀 ~ ProductDetails ~ error:", errorrr);
    if (!data) return <div className="min-h-screen">Product not found.</div>;

    if (isLoading)
        return (
            <div className="min-h-screen">
                <Backdrop
                    sx={() => ({ color: "#fff", zIndex: 1 })}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        );
    if (error) return <div className="min-h-screen">{error.message}</div>;

    if (data)
        return (
            <div>
                <ProductOverview product={data} />
                <ProductInfo product={data} />
                <ProductsYouMayLike
                    products={productsYouMayLike}
                    isLoading={isLoadingYouMayLike}
                />
            </div>
        );
}
