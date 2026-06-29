import { lazy } from "react";
import Loadable from "../shared/components/loader/Loadable";
import * as routeUrl from "./routeUrl";
export const RouteList = [
  {
    path: routeUrl?.DASHBOARD?.url,
    component: Loadable(
      lazy(async () => await import("../features/dashboard/index"))
    ),
  },
  {
    path: routeUrl?.PRODUCT?.url,
    component: Loadable(
      lazy(async () => await import("../features/products/index"))
    ),
  },
  {
    path: routeUrl?.ORDERS?.url,
    component: Loadable(
      lazy(async () => await import("../features/orders/index"))
    ),
  },
  {
    path: routeUrl?.CATEGORY?.url,
    component: Loadable(
      lazy(async () => await import("../features/category/index"))
    ),
  },
  {
    path: routeUrl?.HOME?.url,
    component: Loadable(
      lazy(async () => await import("../user/features/home/index"))
    ),
  },
  {
    path: routeUrl?.PROFILE?.url,
    component: Loadable(
      lazy(async () => await import("../features/adminProfile/index"))
    ),
  },
  {
    path: routeUrl?.USER_MANAGEMENT?.url,
    component: Loadable(
      lazy(async () => await import("../features/user-management/index"))
    ),
  },
];
