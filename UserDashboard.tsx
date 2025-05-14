import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PasswordIcon from "@mui/icons-material/Password";
import PersonPinCircleIcon from "@mui/icons-material/PersonPinCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import SidePanel from "../../components/user/SidePanel";
import Address from "./UserDashboardComponents/Address";
import Orders from "./UserDashboardComponents/Orders";
import Password from "./UserDashboardComponents/Password";
import Profile from "./UserDashboardComponents/Profile";
import Wishlist from "./UserDashboardComponents/Wishlist";

const menuItems = [
    {
        title: "profile",
        icon: <AccountCircleIcon sx={{ color: "#c40000" }} />,
        component: <Profile />,
    },
    {
        title: "wishlist",
        icon: <FavoriteIcon sx={{ color: "#c40000" }} />,
        component: <Wishlist />,
    },
    {
        title: "orders",
        icon: <ListAltIcon sx={{ color: "#c40000" }} />,
        component: <Orders />,
    },
    {
        title: "address",
        icon: <PersonPinCircleIcon sx={{ color: "#c40000" }} />,
        component: <Address />,
    },
    {
        title: "password",
        icon: <PasswordIcon sx={{ color: "#c40000" }} />,
        component: <Password />,
    },
];

export default function UserDashboard() {
    const [activePanel, setActivePanel] = useState("profile");
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

    return (
        <div className="relative flex flex-col laptop:flex-row">
            {/* Toggle Button for Mobile */}
            <div className="p-4 laptop:hidden">
                <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}>
                    <MenuIcon sx={{ color: "#c40000" }} />
                </button>
            </div>

            {/* Left Panel (SidePanel) */}
            <SidePanel
                setActivePanel={setActivePanel}
                menuItems={menuItems}
                isOpen={isSidePanelOpen}
                setIsOpen={setIsSidePanelOpen}
            />

            {/* Right Panel */}
            <div className="flex-1 p-5 bg-gray-200 min-h-screen">
                {menuItems.map((item) =>
                    item.title === activePanel ? (
                        <div key={item.title}>{item.component}</div>
                    ) : null
                )}
            </div>
        </div>
    );
}