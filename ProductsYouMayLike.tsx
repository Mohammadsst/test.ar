import { t } from "i18next";
import { useRef } from "react";
import { Product } from "../../../types";
import ProductYouLikeCard from "./ProductYouLikeCard";

export default function ProductsYouMayLike({
    products,
    isLoading,
}: {
    products: Product[];
    isLoading: boolean;
}) {
    const sliderRef = useRef<HTMLDivElement | null>(null);

    // const scrollLeft = () => {
    //     if (sliderRef?.current) {
    //         sliderRef.current.scrollBy({ left: -600, behavior: "smooth" });
    //     }
    // };

    // const scrollRight = () => {
    //     if (sliderRef.current) {
    //         sliderRef.current.scrollBy({ left: 600, behavior: "smooth" });
    //     }
    // };

    return (
        <div className="relative mobile:p-10 pt-14">
            <h2 className="mx-4 my-4 text-xl font-bold text-gray-500">
                {t("ProductYouLike")}
            </h2>

            {isLoading ? (
                <h2>LOADING</h2>
            ) : (
                <div className="flex items-center justify-between">
                    {/* {products.length > 4 && (
                        <button
                            // onClick={scrollLeft}
                            className="p-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            &lt;
                        </button>
                    )} */}
                    <div
                        ref={sliderRef}
                        className="flex gap-2 pb-40 overflow-x-auto overflow-y-hidden scrollbar-hide"
                        style={{ scrollSnapType: "x mandatory", width: "100%" }} // Ensure full width for the scrolling area
                    >
                        {Array.isArray(products) && products.length > 0 ? (
                            products.map((product, index) => (
                                <div className="flex-shrink-0 h-[16rem] tablet:h-[20rem]" key={product?.id || index}>
                                    <ProductYouLikeCard index={index} product={product} />
                                </div>
                            ))
                        ) : (
                            <p>لا توجد منتجات متاحة.</p>
                        )}
                    </div>
                    {/* {products?.length > 4 && (
                        <button
                            // onClick={scrollRight}
                            className="p-2 ml-2 bg-gray-300  rounded hover:bg-gray-400"
                        >
                            &gt;
                        </button>
                    )} */}
                </div>
            )}
            {products?.length == 0 && (
                <h3 className="mx-4 my-4">NO Products</h3>
            )}
        </div>
    );
}
