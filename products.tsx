// import { useEffect, useState } from "react";
// import axiosInstance from "../../../../api/axiosInstance";
// import Swal from "sweetalert2";
// import { Product } from "../../../../types";
// import ProductCard from "./ProductCard";

// const VendorProductPage = () => {
//   const [products, setProducts] = useState<Product[]>([]);

//   const fetchProducts = async () => {
//     const token = localStorage.getItem("vendorlogin");
//     if (!token) {
//       console.error("No token found");
//       return;
//     }

//     try {
//       const res = await axiosInstance.get("/products/vendorproduct/", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (Array.isArray(res.data)) {
//         setProducts(res.data);
//       } else {
//         setProducts([]);
//       }
//     } catch (error) {
//       console.error("Error fetching products", error);
//       setProducts([]);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "This will delete the product.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it",
//       cancelButtonText: "Cancel",
//     });

//     const token = localStorage.getItem("vendorlogin");
//     if (!token) {
//       Swal.fire("Unauthorized", "Please log in first", "error");
//       return;
//     }

//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/products/vendorproduct/${id}/`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         Swal.fire("Deleted!", "Product deleted successfully", "success");
//         fetchProducts();
//       } catch (error: any) {
//         Swal.fire("Error", error.response?.data?.detail || "Delete failed", "error");
//       }
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   return (
//     <div className="flex flex-wrap justify-center gap-4">
//       {products.length === 0 ? (
//         <p className="text-gray-500 text-center w-full">No Products Yet</p>
//       ) : (
//         products.map((product) => (
//           <ProductCard key={product.id} product={product} onDelete={handleDelete} />
//         ))
//       )}
//     </div>
//   );
// };

// export default VendorProductPage;
import { useEffect, useState } from "react";
import axiosInstance from "../../../../api/axiosInstance";
import Swal from "sweetalert2";
import { Product } from "../../../../types";
import ProductCard from "./ProductCard";

const VendorProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProducts = async () => {
    const token = localStorage.getItem("vendorlogin");
    if (!token) {
      console.error("No token found");
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.get("/products/vendorproduct/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(res.data)) {
        setProducts(res.data.filter((p: Product) => p && p.id)); // Filter undefined or missing id
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    const token = localStorage.getItem("vendorlogin");
    if (!token) {
      Swal.fire("Unauthorized", "Please log in first", "error");
      return;
    }

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/products/vendorproduct/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire("Deleted!", "Product deleted successfully", "success");
        fetchProducts();
      } catch (error: any) {
        Swal.fire("Error", error.response?.data?.detail || "Delete failed", "error");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-4 min-h-[200px] py-4">
      {loading ? (
        <p className="text-gray-500 text-center w-full">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center w-full">No Products Yet</p>
      ) : (
        <>
      <p className="text-gray-500 text-center w-full">Products</p>
      {products.map(
        (product) =>
          product && product.id && (
            <ProductCard key={product.id} product={product} onDelete={handleDelete} />
          )
      )}
    </>
      )}
    </div>
  );
};

export default VendorProductPage;
