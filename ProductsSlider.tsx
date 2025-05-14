import { Trans } from "react-i18next";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Product } from "../../../types";
import Loader from "../../reusables/Loader";
import ProductCard from "../../reusables/ProductCard";

interface ProductsSliderProps {
    title: string;
    link: string;
    products?: Product[];
    isLoading: boolean;
}

export default function ProductsSlider({
    title,
    link,
    products = [],
    isLoading,
}: ProductsSliderProps) {
    // const { i18n, t } = useTranslation();

    return (
        <div className="container">
            <div className="px-8 py-2 mt-8 flexBetween max-sm:flex-col max-md:gap-2">
                <h1 className="text-3xl font-extrabold text-blackText max-lg:text-2xl">
                    {<Trans i18nKey={`${title}`}></Trans>}
                </h1>
                <Link
                    to={link}
                    className="px-2 text-sm font-bold button1 flexCenter max-md:px-0 max-md:text-xs h-9 max-md:w-24 w-28"
                >
                    <Trans i18nKey="view all"></Trans>
                </Link>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-32">
                    {/* <span>Loading products...</span> */}
                    {/* You could also add a spinner here */}
                    <div>
                        <Loader
                            isLoading={isLoading}
                            size={50}
                            color="#4CAF50"
                        />
                        {!isLoading && <div>Data loaded!</div>}
                    </div>
                </div>
            ) : (
                <Swiper
                modules={[Navigation]}
                slidesPerView={1} 
                slidesPerGroup={1}
                spaceBetween={10}
                navigation
                breakpoints={{
                    270: {
                        slidesPerView: 2.7, // عند الشاشات الصغيرة جدًا
                        spaceBetween: 5,
                    },
                    570: {
                        slidesPerView: 3, // عند الشاشات بين 570px و 767px
                        spaceBetween: 8,
                    },
                    767: {
                        slidesPerView: 4, // عند الشاشات بين 767px و 1280px
                        spaceBetween: 10,
                    },
                    1023:{
                        slidesPerView: 5, // عند الشاشات بين 767px و 1280px
                        spaceBetween: 10,
                    },
                    1280: {
                        slidesPerView: 6, // عند الشاشات الأكبر من 1280px
                        spaceBetween: 12,
                    },
                    1500: {
                        slidesPerView: 6, // عند الشاشات الأكبر من 1500px
                        spaceBetween: 10,
                    },
                }}
                className="rounded-xl"
            >
                {products.map((product,index) => (
                    <SwiperSlide key={product.id}>
                        <ProductCard key={product.id} product={product} index={index} />
                    </SwiperSlide>
                ))}
            </Swiper>

            )}
        </div>
    );
}
