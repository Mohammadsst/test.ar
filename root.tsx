import queryString from "query-string";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/basic/Footer";
import Header from "../components/basic/Header";

export default function RootLayout() {
    let location = useLocation();
    useEffect(() => {
        const values = queryString.parse(location.search);
        console.log("🚀 ~ useEffect ~ values:", values);
        const code = values.code;
        if (code) {
        } else {
        }
    }, [location]);
    return (
        <>
            <Header />
            <div className="min-h-screen pt-20">
                <Outlet />
            </div>
            <Footer />
        </>
    );
}
