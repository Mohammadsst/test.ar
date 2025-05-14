import { Trans } from "react-i18next";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Loader from "../../components/reusables/Loader";
import { Product } from "../../types";
import { SupplierCard } from "./SupplierCard";

interface SupplierSliderProps {
    title: string;
    link: string;
    products?: Product[];
    isLoading: boolean;
}

export default function SupplierSlider({
    title,
    link,
    products = [],
    isLoading,
}: SupplierSliderProps) {
    return (
        <div className="supplier-slider-container">
            {/* Header Section */}
            <div className="px-8 py-2 mt-8 flex justify-between items-center max-sm:flex-col max-sm:gap-2">
                <h1 className="tablet:text-3xl text-lg font-extrabold text-blackText ">
                    <Trans i18nKey={title} />
                </h1>
                <Link
                    to={`/${link}`}
                    className="px-2 text-sm font-bold button1 flex items-center justify-center max-md:px-0 max-md:text-xs h-9 max-md:w-24 w-28"
                    aria-label="View all products"
                >
                    <Trans i18nKey="view all" />
                </Link>
            </div>

            {/* Content Section */}
            {isLoading ? (
                <div className="flex items-center justify-center h-32">
                    <Loader isLoading={isLoading} size={50} color="#4CAF50" />
                </div>
            ) : products.length > 0 ? (
                <div className="px-3 py-4 overflow-hidden">
                    <Swiper
                        modules={[Navigation]}
                        slidesPerView={1}
                        navigation
                        breakpoints={{
                            320: {
                                slidesPerView: 2.4,
                                slidesPerGroup: 3,
                                spaceBetween: 4,
                            },
                            480: {
                                slidesPerView: 3,
                                slidesPerGroup: 3,
                                spaceBetween: 6,
                            },
                            640: {
                                slidesPerView: 3,
                                slidesPerGroup: 3,
                                spaceBetween: 8,
                            },
                            768: {
                                slidesPerView: 4,
                                slidesPerGroup: 4,
                                spaceBetween: 12,
                            },
                            1024: {
                                slidesPerView: 5,
                                slidesPerGroup: 5,
                                spaceBetween: 12,
                            },
                            1280: {
                                slidesPerView: 6,
                                slidesPerGroup: 6,
                                spaceBetween: 8,
                            },
                        }}
                        className="rounded-xl"
                        aria-label="Product Slider"
                        slideToClickedSlide={true}
                        loop={false}
                        centeredSlides={false}
                        centerInsufficientSlides={false}
                        watchSlidesProgress={true}
                        slidesOffsetAfter={0}
                        preventClicks={false}
                        grabCursor={true}
                        dir="rtl"  // Add RTL support
                        rtl={true}  // Ensure proper RTL behavior
                        style={{ 
                          direction: 'rtl', // Ensure RTL direction
                          '--swiper-navigation-sides-offset': '0px', // Custom CSS variable for navigation
                          '--swiper-navigation-color': '#000'
                        }}
                    >
                        {products.map((product, index) => (
                            <SwiperSlide 
                                key={product.id || index} 
                                className="p-1"
                                style={{ width: 'calc((100% - 8px) / 3)', maxWidth: '100%' }} // Mobile width calculation for 3 cards
                            >
                                <SupplierCard product={product} index={index} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : (
                <div className="text-center mt-6">
                    <p className="text-gray-500">No products available at the moment.</p>
                </div>
            )}
        </div>
    );
}