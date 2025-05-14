import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const useFavorite = (productId: string) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    const checkFavoriteStatus = useCallback(async () => {
        try {
            const response = await axiosInstance.get(
                "/account/favorites/products",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "accessToken"
                        )}`,
                    },
                }
            );
            const favorites = response.data;
            const favStatus = favorites.some(
                (fav: any) => fav.id === productId
            );
            setIsFavorite(favStatus);
        } catch (error) {
            console.error("Error checking favorite status", error);
        }
    }, [productId]);

    useEffect(() => {
        checkFavoriteStatus();
    }, [checkFavoriteStatus]);

    const toggleFavorite = async () => {
        setLoading(true);
        try {
            const method = isFavorite ? "DELETE" : "POST";
            const url = isFavorite
                ? `/account/favorites/${productId}/`
                : "/account/favorites/";
            await axiosInstance({
                method,
                url,
                data: isFavorite ? undefined : { product_id: productId },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "accessToken"
                    )}`,
                },
            });
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Error toggling favorite", error);
        } finally {
            setLoading(false);
        }
    };

    return { isFavorite, loading, toggleFavorite };
};

export default useFavorite;
