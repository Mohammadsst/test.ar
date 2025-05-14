import { Outlet } from "react-router-dom";
import Footer from "../components/basic/Footer";
import ProfileHeader from "../components/basic/ProfileHeader";

export default function UserProfile() {
    return (
        <>
            <ProfileHeader />
            <div className="min-h-screen pt-24">
                <Outlet />
            </div>
            <Footer />
        </>
    );
}
