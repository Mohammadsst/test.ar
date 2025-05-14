import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";

interface CartItem {
    id?: string;
    product_id: string; 
    quantity: number;
}

const useAddToCart = () => {
    const queryClient = useQueryClient();
    
    const {
        data: cartItems = [],
        isLoading: loading,
        error,
        refetch: fetchCartItems
    } = useQuery({
        queryKey: ["userCart"],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get("/order/cart/details/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                return response.data;
            } catch (error: any) {
                console.error("Error fetching cart items", error);
                throw new Error(error.response?.data?.message || "Failed to fetch cart items");
            }
        },
        enabled: !!localStorage.getItem("accessToken")
    });

    const addToCartMutation = useMutation({
        mutationFn: async (item: CartItem) => {
            const response = await axiosInstance.post("/order/addcart/", item, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success("تمت إضافة المنتج إلى العربة بنجاح!");
            queryClient.invalidateQueries({ queryKey: ["userCart"] });
        },
        onError: (error: any) => {
            toast.error("فشل إضافة المنتج إلى العربة!");
            console.error("Error adding to cart", error);
        }
    });

    const addToCart = useCallback((item: CartItem) => {
        addToCartMutation.mutate(item);
    }, [addToCartMutation]);

    const removeFromCartMutation = useMutation({
        mutationFn: async (cartItemId: string) => {
            await axiosInstance.delete(`/order/cartitems/${cartItemId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            return cartItemId;
        },
        onSuccess: () => {
            toast.success("تم حذف المنتج من العربة!");
            queryClient.invalidateQueries({ queryKey: ["userCart"] });
        },
        onError: (error: any) => {
            toast.error("فشل حذف المنتج من العربة!");
            console.error("Error removing from cart", error);
        }
    });

    const removeFromCart = useCallback((cartItemId: string) => {
        removeFromCartMutation.mutate(cartItemId);
    }, [removeFromCartMutation]);

    const updateCartItemQuantityMutation = useMutation({
        mutationFn: async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => {
            const response = await axiosInstance.put(
                `/order/cartitems/${cartItemId}/`,
                { quantity },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success("تم تحديث الكمية بنجاح!");
            queryClient.invalidateQueries({ queryKey: ["userCart"] });
        },
        onError: (error: any) => {
            toast.error("فشل تحديث الكمية!");
            console.error("Error updating cart item quantity", error);
        }
    });

    const updateCartItemQuantity = useCallback((cartItemId: string, quantity: number) => {
        updateCartItemQuantityMutation.mutate({ cartItemId, quantity });
    }, [updateCartItemQuantityMutation]);

    return {
        cartItems,
        loading,
        error: error ? (error as Error).message : null,
        fetchCartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        isAddingToCart: addToCartMutation.isPending,
        isRemovingFromCart: removeFromCartMutation.isPending,
        isUpdatingCartItem: updateCartItemQuantityMutation.isPending,
    };
};

export default useAddToCart;