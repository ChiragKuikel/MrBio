/* eslint-disable @typescript-eslint/no-unused-vars */
// src/routes/MainRoutes.tsx
import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAdminAuth } from "../services/auth/RequireAuth";
import { RequireUserAuth } from "../services/auth/RequireUserAuth";
import { MainLayout } from "../shared/components/layouts/SideBar";
import Spinner from "../shared/components/loader/Spinner";
import ErrorBoundary from "../shared/hooks/login/errorBoundary/ErrorBoundary";
import LoginPage from "../shared/pages/login/LoginPage";
import NotFoundPage from "../shared/pages/pageNotFound";
import RegistrationForm from "../shared/pages/register";
import NavigationBar from "../user/components/navbar";
import UserLandingPage from "../user/features";
import AboutUs from "../user/features/aboutUs";
import BlogPost from "../user/features/blog";
import RenderingProductsAsPerCategory from "../user/features/home/category/productsWithCat/RenderingProductsAsPerCategory";
import UserProfile from "../user/features/home/userProfile";
import MyCart from "../user/features/my-cart";
import Order from "../user/features/order/Order";
import Products from "../user/features/products";
import ProductDetail from "../user/features/products/ProductDetail";
import { RouteList } from "./routeList";
import MyOrderHistory from "../user/features/order/MyOrderHistory";
import OrderSuccessFulPage from "../user/features/order/OrderSuccessFul";

const MainRoutes = () => {
  return (
    <React.Fragment>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          {/* Admin Routes - Protected */}
          <Route
            path="/admin"
            element={
              <RequireAdminAuth>
                <MainLayout />
              </RequireAdminAuth>
            }
          >
            {RouteList?.map((route) => (
              <Route
                key={route?.path}
                path={route?.path}
                element={<route.component />}
              />
            ))}
          </Route>

          {/* Non-Admin Routes - Unprotected */}
          <Route path="/home" element={<NavigationBar />}>
            <Route index element={<UserLandingPage />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="register" element={<RegistrationForm />} />
            <Route path="our-products" element={<Products />} />
            <Route path="our-products/:id" element={<ProductDetail />} />
            <Route 
              path="my-profile" 
              element={
                <RequireUserAuth>
                  <UserProfile />
                </RequireUserAuth>
              } 
            />
            <Route path="our-blogs" element={<BlogPost />} />
            <Route 
              path="/home/my-cart" 
              element={
                <RequireUserAuth>
                  <MyCart />
                </RequireUserAuth>
              } 
            />
            <Route
              path="/home/payment-status"
              element={
                <RequireUserAuth>
                  <OrderSuccessFulPage />
                </RequireUserAuth>
              }
            />
            <Route 
              path="/home/my-order-history" 
              element={
                <RequireUserAuth>
                  <MyOrderHistory />
                </RequireUserAuth>
              } 
            />
            <Route path="/home/my-cart/order" element={<Order />} />{" "}
            {/* <-- Add this line */}
            <Route
              path="products-by-category/:id"
              element={<RenderingProductsAsPerCategory />}
            />
            <Route
              path="login"
              element={
                <ErrorBoundary>
                  <LoginPage />
                </ErrorBoundary>
              }
            />
          </Route>

          {/* Page Not Found Route */}
          <Route path="/page-not-found" element={<NotFoundPage />} />

          {/* Catch-all for invalid paths */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </React.Fragment>
  );
};

export default MainRoutes;
