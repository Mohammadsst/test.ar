import { Button } from "@headlessui/react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Loader from "../../components/reusables/Loader";
import Menu from "../../components/reusables/Menu";
import ProductCard from "../../components/reusables/ProductCard2";
import AccordionUsage from "../../components/shared/products/AccordionUsage";
import FilterSidebar from "../../components/shared/products/FilterSidebar";
import { Product } from "../../types";

export default function CategoryPage() {
    const { category } = useParams<{ category: string }>();
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    console.log("🚀 ~ CategoryPage ~ filteredProducts:", filteredProducts);
    const [isPending, setIsPending] = useState<boolean>(true);
    const [sortOption, setSortOption] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const productsPerPage = 10; // Limit of products per page

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<{
        from: number;
        to: number;
    } | null>(null);
    const [selectedRatings, setSelectedRatings] = useState<number[]>([1, 5]);

    const fetchProductsByCategory = async (page: number) => {
        setIsPending(true);
        try {
            const response = await axiosInstance.get(`/products/bycategory`, {
                params: {
                    category: category,
                    l: productsPerPage,
                    p: page,
                },
            });
            const mappedProducts: Product[] = response.data.results;
            // .map(
            //     (product: any) => ({
            //         id: product.id,
            //         name: product.productName || "",
            //         image: product.images[0]?.image || "",
            //         price: product.price_after_discount || "",
            //         oldPrice: product.price_before_discount || "",
            //         rating: product.total_views || 0,
            //         isBestSeller: product.total_sold > 50,
            //         description: product.productDescription || "", // Updated for correct field
            //         slug: product.slug || "",
            //         category:
            //             product.category_details?.translations?.en?.name || "",
            //         brand: product.brand_details?.translations?.en?.name || "",
            //         size: product.size_details?.[0]?.name || "", // Updated to access array
            //         color: product.color_details?.[0]?.name || "", // Updated to access array
            //     })
            // );

            setProducts(mappedProducts);
            setFilteredProducts(mappedProducts);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setIsPending(false);
        }
    };

    useEffect(() => {
        fetchProductsByCategory(currentPage);
    }, [
        category,
        currentPage,
        selectedCategories,
        selectedBrands,
        priceRange,
        selectedRatings,
        sortOption,
    ]);

    useEffect(() => {
        let updatedProducts = [...products];

        if (selectedCategories.length) {
            updatedProducts = updatedProducts.filter((product) =>
                selectedCategories.includes(product.category)
            );
        }

        if (selectedBrands.length) {
            updatedProducts = updatedProducts.filter((product) =>
                selectedBrands.includes(product.brand)
            );
        }

        if (priceRange) {
            updatedProducts = updatedProducts.filter(
                (product) =>
                    product.price >= priceRange.from &&
                    product.price <= priceRange.to
            );
        }

        if (sortOption) {
            updatedProducts = updatedProducts.sort((a, b) => {
                if (sortOption === "Price: High to Low")
                    return b.price - a.price;
                if (sortOption === "Price: Low to High")
                    return a.price - b.price;
                if (sortOption === "Best Rated") return b.rating - a.rating;
                return 0;
            });
        }

        setFilteredProducts(updatedProducts);
    }, [
        selectedCategories,
        selectedBrands,
        priceRange,
        selectedRatings,
        sortOption,
        products,
    ]);

    const handleNextPage = () => setCurrentPage((prev) => prev + 1);
    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setPriceRange(null);
        setSelectedRatings([1, 5]);
        setSortOption("");
        setFilteredProducts(products);
    };

    return (
        <main>
            <div className="flex flex-col pt-5 my-20 bg-white">
                <div className="flex items-center justify-between px-5 my-6">
                    <h1 className="text-3xl font-bold">{""}</h1>
                    <div className="flex items-center gap-3">
                        <Button color="primary" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                        <div className="laptop:hidden">
                            <FilterSidebar />
                        </div>
                        <Menu setSortOption={setSortOption} />
                    </div>
                </div>
                <div className="flex">
                    <div className="top-0 min-h-screen w-80 start-0 max-laptop:hidden">
                        <AccordionUsage
                            setSelectedCategories={setSelectedCategories}
                            setSelectedBrands={setSelectedBrands}
                            setPriceRange={setPriceRange}
                            setSelectedRatings={setSelectedRatings}
                        />
                    </div>
                    <div className="flex justify-start flex-wrap flex-1 gap-6 pl-1.5 p-1.5 pt-1 w-full  gap-y-1  gap-x-1 bg-gray-200">
                        {/* {isPending ? (
                            <div className="flex items-center justify-center w-full">
                                <Loader
                                    isLoading={isPending}
                                    size={50}
                                    color="#0000FF"
                                />
                            </div>
                        ) : (
                            filteredProducts.map((product,index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    index={index}
                                />
                            ))
                        )} */}
                        {isPending ? (
  <div className="flex items-center justify-center w-full">
    <Loader isLoading={isPending} size={50} color="#0000FF" />
  </div>
) : filteredProducts.length === 0 ? (
  <div className="flex items-center justify-center w-full text-gray-500 text-lg font-semibold py-10">
    No Products Yet
  </div>
) : (
  filteredProducts.map((product, index) => (
    <ProductCard
      key={product.id}
      product={product}
      index={index}
    />
  ))
)}

                    </div>
                </div>
                <div className="flex justify-center my-4 pagination">
                    <Button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        <NavigateBeforeIcon />
                    </Button>
                    <span className="px-4 mx-4 border-2">{currentPage}</span>
                    <Button
                        onClick={handleNextPage}
                        disabled={filteredProducts.length < productsPerPage}
                    >
                        <NavigateNextIcon />
                    </Button>
                </div>
            </div>
        </main>
    );
}
