import { useTheme } from "@emotion/react";
import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import { Avatar, Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { CSSObject, styled, Theme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUser } from "../../../../public/utils/functions";
import { TokenType } from "../../../types";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

interface SideBarProps {
    open: boolean;
    onDrawerClose: () => void;
}
const firstSection = [
    {
        text: "Dashboard",
        icon: <SpeedOutlinedIcon sx={{ color: "primary.main" }} />,
        path: "/VedorDashboard",
    },
];

const secondSection = [
    {
        text: "Add Product",
        icon: <CreateNewFolderOutlinedIcon sx={{ color: "primary.main" }} />,
        path: "/AddProducts",
    },
    {
        text: "Update Product",
        icon: <EditNoteOutlinedIcon sx={{ color: "primary.main" }} />,
        path: "/UpdateProduct",
    },
    {
        text: "Orders",
        icon: <ShoppingCartOutlinedIcon sx={{ color: "primary.main" }} />,
        path: "/Orders",
    },
    {
        text: "Products",
        icon: <InventoryOutlinedIcon sx={{ color: "primary.main" }} />,
        path: "/Products",
    },
];

const thirdSection = [
    {
        text: "Wallet",
        icon: <AddCardOutlinedIcon sx={{ color: "primary.main" }} />,
        path: "/Wallet",
    },
    {
        text: "Earnings",
        icon: <AttachMoneyOutlinedIcon sx={{ color: "primary.main" }} />,
        path: "/Earnings",
    },
    {
        text: "Promos and Discount",
        icon: <SellOutlinedIcon sx={{ color: "primary.main" }} />,
        path: "/Discount",
    },
];


const SideBar: React.FC<SideBarProps> = ({ open, onDrawerClose }) => {
    let location = useLocation();

    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<TokenType | null>(null);

  
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("vendorlogin");
    
            if (!token) {
                setLoading(false);
                return;
            }
    
            try {
                const decodedToken = getUser(token) as TokenType;
               
                const fullName = localStorage.getItem("vendorFullName");
    
                if (decodedToken && fullName) {
                    setUser({
                        ...decodedToken,
                        full_name: fullName,
                    });
                } else {
                
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchUser();
    }, []);
    
    if (loading) {
        return (
            <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                Loading...
            </Typography>
        );
    }

    if (!user) {
        return (
            <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                No user logged in.
            </Typography>
        );
    }

    return (
        <Drawer variant="permanent" open={open}>
            <DrawerHeader>
                <Link to="/VedorDashboard">
                    <Box
                        component="img"
                        src="/images/logo.png"
                        alt={user?.full_name }
                        sx={{
                            height: 55,
                            width: 65,
                            marginRight: 0,
                            marginLeft: 0,
                        }}
                    />
                </Link>
                <Typography
                    sx={{
                        fontSize: 20,
                        fontWeight: "300",
                        fontFamily: "'Poppins', sans-serif",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        marginRight: "auto",
                        marginLeft: 2,
                        marginTop: "5px",
                    }}
                    noWrap
                    component="div"
                >
                    <span className="text-[16px]" >Vendor</span>
                </Typography>
                <IconButton
                    aria-label="close drawer"
                    color="inherit"
                    onClick={onDrawerClose}
                >
                    <MenuIcon />
                </IconButton>
            </DrawerHeader>
            <Divider />

            <Link to={"/VendorProfile"}>
                <Avatar
                    sx={{
                        mx: "auto",
                        my: 1,
                        width: open ? "70px" : "55px",
                        height: open ? "70px" : "55px",
                        border: "2px solid gray",
                        transition: "0.5s",
                    }}
                    alt={user.full_name || ""}
                    src="/static/images/avatar/2.jpg"
                />
                <Typography
                    align="center"
                    variant="body1"
                    sx={{ fontSize: open ? 17 : 0, transition: "0.75s" }}
                >
                    {user.full_name || ""}
                </Typography>
                <Typography
                    align="center"
                    color="gray"
                    variant="body2"
                    sx={{
                        fontSize: open ? 12 : 0,
                        transition: "0.75s",
                        // @ts-ignore
                        color: theme.palette.error.main,
                    }}
                >
                    Vendor
                </Typography>
            </Link>
            <Divider />

            <List>
                {firstSection.map((item) => (
                    <ListItem
                        key={item.path}
                        disablePadding
                        sx={{ display: "block" }}
                    >
                        <ListItemButton
                            onClick={() => {
                                navigate(item.path);
                            }}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                                bgcolor:
                                    location.pathname === item.path
                                        ? // @ts-ignore
                                          theme.palette.mode === "light"
                                            ? grey[300]
                                            : grey[800]
                                        : null,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{ opacity: open ? 1 : 0 }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {secondSection.map((item) => (
                    <ListItem
                        key={item.path}
                        disablePadding
                        sx={{ display: "block" }}
                    >
                        <ListItemButton
                            onClick={() => {
                                navigate(item.path);
                            }}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                                bgcolor:
                                    location.pathname === item.path
                                        ? // @ts-ignore
                                          theme.palette.mode === "light"
                                            ? grey[300]
                                            : grey[800]
                                        : null,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{ opacity: open ? 1 : 0 }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {thirdSection.map((item) => (
                    <ListItem
                        key={item.path}
                        disablePadding
                        sx={{ display: "block" }}
                    >
                        <ListItemButton
                            onClick={() => {
                                navigate(item.path);
                            }}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                                bgcolor:
                                    location.pathname === item.path
                                        ? // @ts-ignore
                                          theme.palette.mode === "light"
                                            ? grey[300]
                                            : grey[800]
                                        : null,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{ opacity: open ? 1 : 0 }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <Link
                to="/"
                style={{
                    textDecoration: "none",
                    color: "inherit",
                    marginTop: 4,
                }}
            >
                <Typography
                    align="center"
                    color="gray"
                    variant="body2"
                    sx={{ fontSize: open ? 12 : 0, mt: 2 }}
                >
                    Back To Home
                </Typography>
            </Link>
        </Drawer>
    );
};

export default SideBar;