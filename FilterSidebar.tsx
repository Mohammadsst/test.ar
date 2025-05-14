// FilterSidebar.tsx
import CloseIcon from "@mui/icons-material/Close";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Drawer, IconButton } from "@mui/material";
import React, { useState } from "react";
import AccordionUsage from "./AccordionUsage";

const FilterSidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = (open: boolean) => () => {
        setIsOpen(open);
    };

    return (
        <>
            <span onClick={() => setIsOpen(true)}>
                <MenuOutlinedIcon />
            </span>
            <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
                <div role="presentation" style={{ width: 250 }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            padding: "8px",
                        }}
                    >
                        <IconButton onClick={toggleDrawer(false)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <AccordionUsage />
                </div>
            </Drawer>
        </>
    );
};

export default FilterSidebar;
