import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import CategoriesSlider from "../../components/shared/products/CategoriesSlider";
import Filter from "../../components/shared/products/Filter";
import { useGetCategories } from "../../react-query/product";

export default function Products() {
    const { category } = useParams();
    const categories = useGetCategories(category || "", false);
    return (
        <div>
            {/* <Helmet>
                <title>أربيا - متجر إلكتروني متعدد البائعين</title>
                <link rel="icon" type="image/svg+xml" href="/654651.png" />
                <meta
                    name="description"
                    content="أربيا هو متجر إلكتروني متنوع يقدم مجموعة واسعة من المنتجات من مختلف البائعين. تسوق الآن واكتشف العروض الحصرية والمنتجات المميزة."
                />
                <meta
                    name="keywords"
                    content="أربيا, متجر إلكتروني, تسوق عبر الإنترنت, منتجات متعددة, بائعين, عروض خاصة, تسوق"
                />
                <meta
                    property="og:title"
                    content="أربيا - متجر إلكتروني متعدد البائعين"
                />
                <meta
                    property="og:description"
                    content="أربيا هو وجهتك المفضلة للتسوق عبر الإنترنت. استعرض مجموعة واسعة من المنتجات والعروض من أفضل البائعين."
                />
                <meta
                    property="og:image"
                    content="https://example.com/path/to/your/og-image.jpg"
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
                <div>
                    <div>
                        <CategoriesSlider
                            categories={categories.data || []}
                            isPending={categories.isPending}
                        ></CategoriesSlider>
                    </div>
                    <div>
                        <Filter />
                    </div>
                </div>
            </main>
        </div>
    );
}
