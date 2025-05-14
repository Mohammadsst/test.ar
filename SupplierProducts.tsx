import { Button } from "@headlessui/react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect, useState } from "react";
import Loader from "../../components/reusables/Loader";
import Header from "../../components/basic/Header";
import Footer from "../../components/basic/Footer";
import { SupplierCard } from "./SupplierCard";
import axiosInstance from "../../api/axiosInstance";
import { useParams } from "react-router-dom";
import { t } from "i18next";
interface Product {
    id: string;
    productName: string;
    price_before_discount: string;
    price_after_discount: string;
    images: Array<{ image: string }>;
}

export default function SupplierProducts() {
    const { id } = useParams();
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
    const [isPending, setIsPending] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const productsPerPage = 15; 
    

    const fetchProducts = async () => {
        setIsPending(true);
        try {
            const response = await axiosInstance.get(`/products/supplier/${id}/products/`);
            
            if (response.data && response.data.results) {
                setAllProducts(response.data.results);
                updateCurrentProducts(1, response.data.results);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setIsPending(false);
        }
    };

    const updateCurrentProducts = (page: number, products: Product[] = allProducts) => {
        const startIndex = (page - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        setCurrentProducts(products.slice(startIndex, endIndex));
    };

    useEffect(() => {
        if (id) {
            fetchProducts();
        }
    }, [id]);

    useEffect(() => {
        updateCurrentProducts(currentPage);
    }, [currentPage]);

    const totalPages = Math.ceil(allProducts.length / productsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-col bg-white overflow-hidden flex-grow">
                <div className="pt-16 pb-5 mt-20 tablet:mt-28">
                    <h1 className="tablet:text-3xl text-xl font-extrabold px-4 text-center tablet:text-right">{t("all_products")}</h1>
                </div>
                
                <div className="flex flex-wrap gap-4 p-2 pt-10 bg-gray-200 flex-grow">
                    {isPending ? (
                        <div className="flex items-center justify-center w-full">
                            <Loader isLoading={isPending} size={50} color="#0000FF" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 tablet:grid-cols-4 laptop:grid-cols-5 desktop:grid-cols-6 gap-2 xs:gap-3 sm:gap-4 md:gap-5 w-full px-2">
                            {currentProducts.length > 0 ? (
                                currentProducts.map((product, index) => (
                                    <SupplierCard 
                                        key={product.id}
                                        product={product} 
                                        index={((currentPage - 1) * productsPerPage) + index}
                                    />
                                ))
                            ) : (
                                <p className="text-center col-span-full py-10 text-lg">لا توجد منتجات للعرض</p>
                            )}
                        </div>
                    )}
                </div>
                
                {totalPages > 0 && (
                    <div className="flex justify-center my-6 pagination">
                        <Button 
                            onClick={handlePreviousPage} 
                            disabled={currentPage === 1}
                            className="flex items-center justify-center h-10 w-10 border-2 disabled:opacity-50"
                        >
                            <NavigateBeforeIcon />
                        </Button>
                        <span className="flex items-center justify-center px-6 mx-4 border-2 min-w-20 text-center">
                            {currentPage} من {totalPages}
                        </span>
                        <Button 
                            onClick={handleNextPage} 
                            disabled={currentPage >= totalPages}
                            className="flex items-center justify-center h-10 w-10 border-2 disabled:opacity-50"
                        >
                            <NavigateNextIcon />
                        </Button>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}