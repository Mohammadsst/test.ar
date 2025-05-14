import { t } from "i18next";
import { ReactNode } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../../public/utils/functions";
import { signOut } from "../../redux/slices/userSlice";
import { TokenType } from "../../types";
import CloseIcon from "@mui/icons-material/Close"; // أيقونة الإغلاق

interface MenuItem {
    title: string;
    icon: ReactNode;
    component: ReactNode;
}

interface SidePanelProps {
    menuItems: MenuItem[];
    setActivePanel: (activePanel: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function SidePanel({
    menuItems,
    setActivePanel,
    isOpen,
    setIsOpen,
}: SidePanelProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = localStorage.getItem("accessToken");
    const user = getUser(token) as TokenType;
    const email = user?.email;
    console.log("this is user email:", email);

    const handleLogout = () => {
        dispatch(signOut());
        navigate("/");
        console.log("User logged out");
    };

    return (
        <div
            className={`fixed top-0 left-0 h-full w-80 bg-white p-10 transition-transform duration-300 ease-in-out z-50 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            } laptop:relative laptop:translate-x-0 laptop:w-80`}
        >
            <div className="pb-6 border-b-2 border-gray-200 flex justify-between items-center">
                <div>
                    <p className="font-bold text-[#c40000]">{t("welcome")}</p>
                    <p className="text-xs font-light text-[#c40000] break-words">
                        {email}
                    </p>
                </div>
                {/* زر Cancel */}
                <button
                    className="text-[#c40000] laptop:hidden" 
                    onClick={() => setIsOpen(false)}
                >
                    <CloseIcon />
                </button>
            </div>
            <div className="py-5 border-b-2 border-gray-200">
                {menuItems.map((item) => (
                    <div
                        key={item.title}
                        className="flex gap-3 p-5 transition-all duration-200 cursor-pointer hover:bg-gray-200 active:bg-gray-300 rounded-xl"
                        onClick={() => {
                            setActivePanel(item.title);
                            setIsOpen(false);
                        }}
                    >
                        <span className="text-[#c40000]">{item.icon}</span>
                        <p className="text-[#c40000] font-bold">{t(item.title)}</p>
                    </div>
                ))}
            </div>
            <div>
                <button
                    className="py-5 text-[#c40000] font-bold"
                    onClick={handleLogout}
                >
                    {t("logout")}
                </button>
            </div>
        </div>
    );
}