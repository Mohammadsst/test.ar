import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axiosInstance from "../../api/axiosInstance";
import HeroSlider from "../../components/shared/advertisement/HeroSlider";
import BrandsSlider from "../../components/shared/products/BrandsSlider";
import CategoriesSlider from "../../components/shared/products/CategoriesSlider";
import ProductsSlider from "../../components/shared/products/ProductsSlider";
import { Categories, Product, Slider } from "../../types";

export default function Home() {
    const [categories, setCategories] = useState<Categories[]>([]);
    const [categoryProducts, setCategoryProducts] = useState<
        Record<string, Product[]>
    >({});
    const [loading, setLoading] = useState({
        categories: true,
        products: true,
    });

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading((prev) => ({ ...prev, categories: true }));
            try {
                const response = await axiosInstance.get("/products/category/");
                setCategories(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading((prev) => ({ ...prev, categories: false }));
            }
        };

        fetchCategories();
    }, []);

    // Fetch products by category
    useEffect(() => {
        const fetchProductsByCategory = async () => {
            setLoading((prev) => ({ ...prev, products: true }));
            const productsData: Record<string, Product[]> = {};

            try {
                await Promise.all(
                    categories.map(async (category) => {
                        const response = await axiosInstance.get(
                            `/products/bycategory`,
                            {
                                params: { category: category.slug },
                            }
                        );
                        productsData[category.slug] = response.data.results;
                        // .map(
                        //     (product: any) => ({
                        //         // TODO: Product Type
                        //         id: product.id,
                        //         name: product.productName || "", // No `translations.en.name`, using `productName`
                        //         image: product.images?.[0]?.image || "", // Handling nested structure
                        //         price: product.price_after_discount || "",
                        //         oldPrice: product.price_before_discount || "",
                        //         rating: product.total_views || 0,
                        //         isBestSeller: product.total_sold > 50,
                        //         description: product.productDescription || "", // No `translations.en.description`, using `productDescription`
                        //         slug: product.slug || "",
                        //     })
                        // );
                    })
                );
                setCategoryProducts(productsData);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                console.log(productsData);
            } finally {
                setLoading((prev) => ({ ...prev, products: false }));
            }
        };

        if (categories.length > 0) {
            fetchProductsByCategory();
        }
    }, [categories]);

    const slidersData: Slider[] = [
        {
            id: 1,
            category: "example-category",
            translations: {
                en: {
                    image: "/public/images/cover1.jpg",
                },
                ar: {
                    image: "/public/images/cover1.jpg",
                },
            },
        },
        {
            id: 2,
            category: "example-category",
            translations: {
                en: {
                    image: "/public/images/cover2.jpg",
                },
                ar: {
                    image: "/public/images/cover2.jpg",
                },
            },
        },
        {
            id: 3,
            category: "example-category",
            translations: {
                en: {
                    image: "/public/images/cover3.jpg",
                },
                ar: {
                    image: "/public/images/cover3.jpg",
                },
            },
        },
        {
            id: 4,
            category: "example-category",
            translations: {
                en: {
                    image: "/public/images/cover4.jpg",
                },
                ar: {
                    image: "/public/images/cover4.jpg",
                },
            },
        },
        {
            id: 5,
            category: "example-category",
            translations: {
                en: {
                    image: "/public/images/cover5.jpg",
                },
                ar: {
                    image: "/public/images/cover5.jpg",
                },
            },
        },
        {
            id: 6,
            category: "example-category",
            translations: {
                en: {
                    image: "/public/images/cover6.jpg",
                },
                ar: {
                    image: "/public/images/cover6.jpg",
                },
            },
        },
        {
            id: 7,
            category: "example-category",
            translations: {
                en: {
                    image: "/public/images/cover7.jpg",
                },
                ar: {
                    image: "/public/images/cover7.jpg",
                },
            },
        },
    ];


    return (
        <div className="mt-0 tablet:mt-28">
            {/* <Helmet>
                <title>ارابيا | اونلاين شوبينج كل اللي تحتاجه في مكان واحد</title>
                <link rel="icon" type="image/svg+xml" href="/654651.png" />
                <meta
                    name="description"
                    content="أربيا هو متجر إلكتروني متنوع..."
                />
                <meta
                    name="keywords"
                    content="أربيا, متجر إلكتروني, تسوق عبر الإنترنت..."
                />
                <meta
                    property="og:title"
                    content="ارابيا | اونلاين شوبينج كل اللي تحتاجه في مكان واحد"
                />
                <meta
                    property="og:description"
                    content="أربيا هو وجهتك المفضلة للتسوق..."
                />
                <meta
                    property="og:image"
                    content="https://example.com/path/to/og-image.jpg"
                />
                <meta property="og:url" content="https://example.com/home" />
            </Helmet> */}
            <Helmet>
                <title>ارابيا | اونلاين شوبينج كل اللي تحتاجه في مكان واحد</title>
                <link rel="icon" type="image/svg+xml" href="/654651.png" />
                <meta
                    name="description"
                    content="تسوق كل ما تحتاجه بسهولة مع ماركتك المفضلة وبأسعار وعروض مميزة مبتنتهيش | ارابيا وجهتك الأولي في الاونلاين شوبينج"
                />
                <meta
                    name="keywords"
                    content=" ارابيا متجر 
تسوق 
ايفون 
الكترونيات 
تسوق عبر الإنترنت
iPhone
Apple 
Samsung"
                />
                <meta
                    property="og:title"
                    content="ارابيا | اونلاين شوبينج كل اللي تحتاجه في مكان واحد"
                />
                <meta
                    property="og:description"
                    content="ارابيا هو وجهتك الأولي والمفضلة للاونلاين شوبينغ "
                />
                <meta
                    property="og:image"
                    content="https://example.com/path/to/og-image.jpg"
                />
                <meta property="og:url" content="https://example.com/home" />
            </Helmet>
            <main>
                <div className="flex-col flexCenter">
                    <div className="container flex flex-col justify-center">
                        <HeroSlider
                            sliders={slidersData}
                            isPending={loading.categories && loading.products}
                        />
                        <CategoriesSlider
                            categories={categories}
                            isPending={loading.categories}
                        />
                        <div className="w-full flexCenter">
                            <BrandsSlider />
                        </div>
                        {categories.map((category, index) => (
                            <ProductsSlider
                                key={index}
                                title={category.translations.en.name}
                                link={`/category/${category.slug}`}
                                products={categoryProducts[category.slug] || []}
                                isLoading={loading.products}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
