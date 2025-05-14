import { useState } from "react";
import Address from "./UserDashboardComponents/Address";
import Payment from "./checkoutComponents/Payment";
import Phone from "./checkoutComponents/Phone";

export default function CheckoutPage() {
    const menuItems = [
        {
            title: "address",
            component: (
                <Address
                    address="confirmYourAddress"
                    navigate={() => setActivepanel("phone")}
                />
            ),
        },
        {
            title: "phone",
            component: <Phone navigate={() => setActivepanel("payment")} />,
        },
        {
            title: "payment",
            component: <Payment />,
        },
    ];
    const [activePanel, setActivepanel] = useState("address");

    return (
        <div className="flex">
            <div className="p-4  mx-auto lg:p-10 w-full">
                {menuItems.map((item) =>
                    item.title === activePanel ? (
                        <div key={item.title}>{item.component}</div>
                    ) : null
                )}
            </div>
        </div>
    );
}
