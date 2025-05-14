// // import { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import axiosInstance from "../../api/axiosInstance";

// // // تحديد نوع البيانات للبراند
// // interface Brand {
// //   id: number;
// //   image: string;
// //   slug: string;
// //   translations: {
// //     en: {
// //       name: string;
// //     };
// //   };
// // }

// // export default function BrandProducts() {
// //     const { slug } = useParams<{ slug: string }>();
// //     const [brands, setBrands] = useState<Brand[]>([]);

// //     useEffect(() => {
// //         const fetchBrands = async () => {
// //             try {
// //                 const response = await axiosInstance.get(
// //                     `/products/brand/?slug=${slug}`
// //                 );
// //                 console.log(slug);
// //                 setBrands(response.data);
// //                 console.log("brand data",response.data);
// //             } catch (error) {
// //                 console.error("Failed to fetch brands:", error);
// //             }
// //         };

// //         fetchBrands();
// //     }, [slug]);

// //     return (
// //         <div className="container mx-auto p-4">
// //             <h1 className="text-xl font-bold mb-4 text-center">العلامات التجارية</h1>
// //             <div className="grid grid-cols-3 gap-2">
// //                 {brands.map((brand) => (
// //                     <div
// //                         key={brand.id}
// //                         className="bg-white rounded-lg shadow p-2 flex flex-col items-center"
// //                     >
// //                         <img
// //                             src={brand.image}
// //                             alt={brand.translations.en.name}
// //                             className="w-16 h-16 object-contain"
// //                         />
// //                         <h3 className="text-sm font-medium mt-1 text-center">
// //                             {brand.translations.en.name}
// //                         </h3>
// //                     </div>
// //                 ))}
// //             </div>
// //         </div>
// //     );
// // }

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../../api/axiosInstance";
// import ProductCard from "../../components/reusables/ProductCard2";
// import Loader from "../../components/reusables/Loader";
// import { Product } from "../../types";

// export default function BrandProducts() {
//   const { slug } = useParams<{ slug: string }>();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProductsByBrand = async () => {
//       try {
//         const response = await axiosInstance.get(
//           `/products/bybrand/?brand=${slug}`
//         );
//         setProducts(response.data.results || response.data);
//       } catch (error) {
//         console.error("Failed to fetch products by brand:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (slug) {
//       fetchProductsByBrand();
//     }
//   }, [slug]);

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h1 className="text-2xl font-bold text-center mb-8">
//         Products {BrandProducts.name}
//       </h1>

//       {loading ? (
//         <div className="flex justify-center">
//           <Loader isLoading={loading} size={40} color="#0000FF" />
//         </div>
//       ) : products.length === 0 ? (
//         <p className="text-center text-gray-600">No Products Found For This Brand.</p>
//       ) : (
//         <div className="flex flex-wrap justify-start gap-4">
//           {products.map((product, index) => (
//             <ProductCard key={product.id} product={product} index={index} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { Button } from "@headlessui/react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Loader from "../../components/reusables/Loader";
import Menu from "../../components/reusables/Menu";
import ProductCard from "../../components/reusables/ProductCard2";
import AccordionUsage from "../../components/shared/products/AccordionUsage";
import FilterSidebar from "../../components/shared/products/FilterSidebar";
import { Product } from "../../types";

export default function BrandProducts() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [brandName, setBrandName] = useState<string>("");
  const [brandImage, setBrandImage] = useState<string>("");

  const productsPerPage = 10;

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ from: number; to: number } | null>(null);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([1, 5]);

  const fetchProductsByBrand = async (page: number) => {
    setIsPending(true);
    try {
      const response = await axiosInstance.get(`/products/bybrand/`, {
        params: {
          brand: slug,
          l: productsPerPage,
          p: page,
        },
      });

      const result = Array.isArray(response.data.results)
        ? response.data.results
        : Array.isArray(response.data)
        ? response.data
        : [];

      setProducts(result);
      setFilteredProducts(result);
    } catch (error) {
      console.error("Failed to fetch products by brand:", error);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProductsByBrand(currentPage);
    }
  }, [slug, currentPage]);

  useEffect(() => {
    const fetchBrandDetails = async () => {
      try {
        const res = await axiosInstance.get(`/products/brand/?slug=${slug}`);
        setBrandName(res.data?.translations?.en?.name || slug);
        setBrandImage(res.data?.image || "");
      } catch (error) {
        setBrandName(slug);
      }
    };

    if (slug) {
      fetchBrandDetails();
    }
  }, [slug]);

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
        if (sortOption === "Price: High to Low") return b.price - a.price;
        if (sortOption === "Price: Low to High") return a.price - b.price;
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
        {/* Controls */}
        <div className="flex items-center justify-end gap-3 px-5 mb-6">
          <Button color="primary" onClick={clearFilters}>
            Clear Filters
          </Button>
          <div className="laptop:hidden">
            <FilterSidebar />
          </div>
          <Menu setSortOption={setSortOption} />
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="top-0 min-h-screen w-80 start-0 max-laptop:hidden">
            <AccordionUsage
              setSelectedCategories={setSelectedCategories}
              setSelectedBrands={setSelectedBrands}
              setPriceRange={setPriceRange}
              setSelectedRatings={setSelectedRatings}
            />
          </div>

          {/* Product Grid */}
          <div className="flex justify-start flex-wrap flex-1 gap-2 p-2 bg-gray-200">
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
                <ProductCard key={product.id} product={product} index={index} />
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center my-4 pagination">
          <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
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

