// import {
//   AddShoppingCartTwoTone,
//   Category,
//   ShoppingBag,
// } from "@mui/icons-material";
import type { Navigation } from "@toolpad/core/AppProvider";
import { LayoutDashboardIcon, ListOrderedIcon, Shapes, ShoppingBag, User } from "lucide-react";

export const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Dashboard",
  },
  {
    segment: "admin/dashboard",
    title: "Dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Management",
  },
  {
    segment: "admin/user-management",
    title: "User Management",
    icon: <User />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Main Menu",
  },
  {
    segment: "admin/category",
    title: "Category",
    icon: <Shapes />,
  },
  {
    segment: "admin/products",
    title: "Products",
    icon: <ShoppingBag />,
  },
  {
    segment: "admin/orders",
    title: "Orders",
    icon: <ListOrderedIcon />,
  },
];
