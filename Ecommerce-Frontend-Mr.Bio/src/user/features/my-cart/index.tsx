/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  CreditCard,
  DollarSign,
} from "lucide-react";
import PageHeader from "../../../shared/components/pageHeader";
import { toastMessage } from "../../../shared/components/toast/ToastMessage";
import useGetCartItems from "../../../shared/hooks/user/addToCart/get/useGetCartItems";
import usePatchAddToCartById from "../../../shared/hooks/user/addToCart/patch/usePatchAddToCartById";
import useDeleteCartItemsById from "../../../shared/hooks/user/addToCart/delete/useDeleteCartItemsById";
import { deleteConfirmation } from "../../../shared/components/confirmation";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import usePostPaymentInitiation from "../../../shared/hooks/order/fonePayHooks/post/usePostPaymentInitiation";

const theme = createTheme();

interface PaymentOptionsModalProps {
  open: boolean;
  onClose: () => void;
  onCashOnDelivery: () => void;
  onFonepay: () => void;
}

const PaymentOptionsModal: React.FC<PaymentOptionsModalProps> = ({
  open,
  onClose,
  onCashOnDelivery: _onCashOnDelivery,
  onFonepay,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 0,
            textAlign: "center",
            background: "linear-gradient(to bottom, #ffffff 0%, #f8faf9 100%)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <DialogContent sx={{ px: 5, py: 4 }}>
          {/* Decorative Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              borderRadius: "16px 16px 0 0",
              p: 3,
              mb: 3,
              mx: -5,
              mt: -4,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#ffffff",
                fontSize: "1.75rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Choose Payment Method
            </Typography>
          </Box>

          {/* Subtitle */}
          <Typography
            sx={{
              color: "#64748b",
              fontSize: "1rem",
              lineHeight: 1.6,
              mb: 4,
              fontWeight: 400,
            }}
          >
            Select your preferred payment method to proceed with your order
          </Typography>

          {/* Payment Options */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Button
              onClick={onFonepay}
              variant="contained"
              fullWidth
              sx={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
                fontWeight: 600,
                py: 2.5,
                borderRadius: 3,
                textTransform: "none",
                fontSize: "1.05rem",
                boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  boxShadow: "0 6px 20px rgba(59, 130, 246, 0.5)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
              startIcon={<CreditCard size={20} />}
            >
              Pay with Fonepay
            </Button>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 3, px: 5 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              border: "2px solid #e2e8f0",
              color: "#64748b",
              fontWeight: 600,
              px: 5,
              py: 1.2,
              borderRadius: 3,
              textTransform: "none",
              fontSize: "1rem",
              minWidth: 120,
              "&:hover": {
                backgroundColor: "#f1f5f9",
                border: "2px solid #cbd5e1",
                color: "#475569",
              },
              transition: "all 0.2s ease",
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

const MyCart: React.FC = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || undefined;
  const { data: cartData, isLoading, error } = useGetCartItems(userId);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const cartItems = cartData?.data || [];
  const { mutate: updateCartItem } = usePatchAddToCartById();
  const { mutate: deleteCartItem } = useDeleteCartItemsById();
  const { mutate: postInitiate } = usePostPaymentInitiation();
  React.useEffect(() => {
    if (cartItems.length > 0) {
      const initialQuantities = cartItems.reduce(
        (acc: Record<string, number>, item: any) => {
          acc[item.id] = item.quantity;
          return acc;
        },
        {},
      );
      setQuantities(initialQuantities);
    }
  }, [cartItems]);

  const subtotal = cartItems.reduce((total: number, item: any) => {
    return (
      total +
      (item.product?.finalPrice || 0) * (quantities[item.id] || item.quantity)
    );
  }, 0);

  // const shipping = subtotal > 0 ? 100 : 0;
  const total = subtotal;

  const handleIncrement = (itemId: string) => {
    const newQuantity = (quantities[itemId] || 1) + 1;
    setQuantities((prev) => ({ ...prev, [itemId]: newQuantity }));
    updateCartItem({
      productId: itemId,
      quantity: newQuantity,
      userId: userId || "",
    });
  };

  const handleDecrement = (itemId: string) => {
    const newQuantity = Math.max((quantities[itemId] || 1) - 1, 1);
    setQuantities((prev) => ({ ...prev, [itemId]: newQuantity }));
    updateCartItem({
      productId: itemId,
      quantity: newQuantity,
      userId: userId || "",
    });
  };

  const handleRemoveItem = async (itemId: string, productName: string) => {
    try {
      await deleteConfirmation(
        () => deleteCartItem(itemId),
        "Remove from cart?",
        `Are you sure you want to remove ${productName} from your cart?`,
      );
    } catch (error) {
      toastMessage("error", "Failed to remove item from cart");
    }
  };

  const handleOrderproceed = () => {
    setShowPaymentModal(true);
  };

  const handleCashOnDelivery = () => {
    setShowPaymentModal(false);
    navigate(`/home/my-cart/order`, {
      state: {
        totalAmount: total,
        subtotal,
        shippingCost: 0,
        cartItems: cartItems.map((item: any) => ({
          productId: item?.product?.id,
          quantity: quantities[item.id] || item.quantity,
          price: item.product?.finalPrice,
        })),
      },
    });
  };
  const handleFonepay = () => {
    setShowPaymentModal(false);

    // Save cart data to localStorage before payment
    const cartDataForPayment = {
      cartItems: cartItems.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        quantity: quantities[item.id] || item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          finalPrice: item.product.finalPrice,
          images: item.product.images,
          brand: item.product.brand,
          stock: item.product.stock,
        },
      })),
      subtotal: subtotal,
      shipping: 0,
      total: total,
      userId: userId,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(
      "fonepayOrderData",
      JSON.stringify(cartDataForPayment),
    );

    const formatDate = (date: Date): string => {
      return date.toISOString().split("T")[0].replace(/-/g, "/");
    };
    const date = formatDate(new Date());
    // Create payment data object with the required parameters
    const paymentData = {
      RU: `${import.meta.env.VITE_BASE_URL}/home/payment-status`, // Return URL after payment
      PID: `${import.meta.env.VITE_MERCHANT_ID}`, // Payment ID
      PRN: `mr-bio-payment-${Math.random().toString(36).substring(2, 10)}`, // Purchase Reference Number
      // AMT: 1, // Amount to be paid
      AMT: total, // Amount to be paid
      CRN: "NPR", // Currency (Nepalese Rupee)
      DT: date, // Date and time
      R1: `${userId}-${Math.random().toString(36).substring(2, 10)}`, // User ID
      R2: "mrBioNepal",
      MD: "P", // Merchant Data (P for Payment)
    };

    // Call the payment initiation hook
    postInitiate(paymentData, {
      onSuccess: (response) => {
        // Build the complete Fonepay payment URL
        try {
          const fonepayPaymentRequestURL = `https://clientapi.fonepay.com/api/merchantRequest?PID=${import.meta.env.VITE_MERCHANT_ID}&MD=P&PRN=${paymentData.PRN}&AMT=${paymentData.AMT}&CRN=${paymentData.CRN}&DT=${date}&R1=${paymentData.R1}&R2=${encodeURIComponent(paymentData.R2)}&RU=${paymentData.RU}&DV=${response?.data || ""}`;
          window.location.href = fonepayPaymentRequestURL;
          // Navigate to the Fonepay payment URL
        } catch (error) {
          console.log("error", error);
        }
      },
      onError: (error) => {
        console.error("Payment initiation failed:", error);
        toastMessage("error", "Failed to initiate payment. Please try again.");
      },
    });
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  if (isLoading)
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading cart items...</p>
      </div>
    );
  if (error)
    return (
      <div className="text-center py-16">
        <div className="text-red-500 text-xl mb-2">⚠️</div>
        <p className="text-red-500 text-lg">Error loading cart items</p>
      </div>
    );

  const handleRedirect = () => {
    navigate("/home/our-products");
  };
  return (
    <div className="bg-gradient-to-b from-green-50/30 to-white min-h-screen">
      <PageHeader
        title="My Cart"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "My Cart" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <ShoppingBag className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start
              shopping to fill it up!
            </p>
            <button
              onClick={handleRedirect}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6" />
                    Cart Items ({cartItems.length})
                  </h2>
                </div>

                <div className="p-6">
                  <div className="hidden md:grid grid-cols-12 gap-4 font-semibold text-gray-600 text-sm uppercase tracking-wider border-b-2 border-gray-100 pb-4 mb-6">
                    <div className="col-span-5">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-3 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>

                  {/* Mobile: Grid layout with 2 columns, Desktop: List layout */}
                  <div className="grid grid-cols-2 md:block gap-4">
                    {cartItems?.map((item: any, index: number) => (
                      <div
                        key={item.id}
                        className={`bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
                          index !== cartItems.length - 1
                            ? "md:border-b md:border-gray-100 md:pb-6 md:mb-2"
                            : ""
                        } hover:bg-gray-50/50 ${index !== cartItems.length - 1 ? "md:mb-0" : ""}`}
                      >
                        {/* Mobile Card Layout */}
                        <div className="md:hidden flex flex-col h-full">
                          <div className="relative mb-3">
                            <img
                              src={(() => {
                                const cleanedPath =
                                  `${item?.product?.images}`.replace(
                                    "/assets/images/",
                                    "",
                                  );
                                return `${import.meta.env.VITE_BASE_URL}products/image/${cleanedPath.split(",")[0] || "/placeholder-product.jpg"}`;
                              })()}
                              alt={item?.product?.name}
                              className="w-full aspect-square object-cover rounded-lg shadow-md"
                            />
                            <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                              {quantities[item.id] || item.quantity}
                            </div>
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                            {item?.product?.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2">
                            {item.product?.brand}
                          </p>
                          <div className="mb-3">
                            <div className="text-sm font-bold text-green-600">
                              Nrs. {item?.product?.finalPrice?.toFixed(2)}
                            </div>
                            {item?.product?.price !==
                              item?.product?.finalPrice && (
                              <p className="text-xs text-gray-400 line-through">
                                Nrs. {item?.product?.price?.toFixed(2)}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-center space-x-2 mb-3">
                            <button
                              onClick={() => handleDecrement(item.id)}
                              disabled={quantities[item.id] <= 1}
                              className="p-1.5 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                            >
                              <Minus className="w-3 h-3 text-gray-600" />
                            </button>
                            <span className="w-8 text-center font-bold text-sm text-gray-900 bg-gray-50 rounded py-1">
                              {quantities[item.id] || item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncrement(item.id)}
                              disabled={
                                quantities[item.id] >= item.product?.stock
                              }
                              className="p-1.5 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                            >
                              <Plus className="w-3 h-3 text-gray-600" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-xs font-bold text-gray-900">
                              Nrs.{" "}
                              {(
                                (item.product?.finalPrice || 0) *
                                (quantities[item.id] || item.quantity)
                              ).toFixed(2)}
                            </span>
                            <button
                              onClick={() =>
                                handleRemoveItem(item?.id, item?.product?.name)
                              }
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Desktop List Layout */}
                        <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center">
                          <div className="col-span-5 flex items-center space-x-4">
                            <div className="relative">
                              <img
                                src={(() => {
                                  const cleanedPath =
                                    `${item?.product?.images}`.replace(
                                      "/assets/images/",
                                      "",
                                    );
                                  return `${import.meta.env.VITE_BASE_URL}products/image/${cleanedPath.split(",")[0] || "/placeholder-product.jpg"}`;
                                })()}
                                alt={item?.product?.name}
                                className="w-24 h-24 object-cover rounded-xl shadow-md ring-2 ring-green-50"
                              />
                              <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {quantities[item.id] || item.quantity}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                                {item?.product?.name}
                              </h3>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <span className="font-medium">Brand:</span>
                                <span>{item.product?.brand}</span>
                              </p>
                            </div>
                          </div>

                          <div className="col-span-2 text-center">
                            <div className="text-lg font-bold text-green-600">
                              Nrs. {item?.product?.finalPrice?.toFixed(2)}
                            </div>
                            {item?.product?.price !==
                              item?.product?.finalPrice && (
                              <p className="text-xs text-gray-400 line-through mt-1">
                                Nrs. {item?.product?.price?.toFixed(2)}
                              </p>
                            )}
                          </div>

                          <div className="col-span-3">
                            <div className="flex items-center justify-center space-x-3">
                              <button
                                onClick={() => handleDecrement(item.id)}
                                disabled={quantities[item.id] <= 1}
                                className="p-2.5 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group"
                              >
                                <Minus className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
                              </button>
                              <span className="w-12 text-center font-bold text-lg text-gray-900 bg-gray-50 rounded-lg py-1.5">
                                {quantities[item.id] || item.quantity}
                              </span>
                              <button
                                onClick={() => handleIncrement(item.id)}
                                disabled={
                                  quantities[item.id] >= item.product?.stock
                                }
                                className="p-2.5 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group"
                              >
                                <Plus className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
                              </button>
                            </div>
                          </div>

                          <div className="col-span-2 flex items-center justify-end space-x-4">
                            <span className="text-xl font-bold text-gray-900">
                              Nrs.{" "}
                              {(
                                (item.product?.finalPrice || 0) *
                                (quantities[item.id] || item.quantity)
                              ).toFixed(2)}
                            </span>
                            <button
                              onClick={() =>
                                handleRemoveItem(item?.id, item?.product?.name)
                              }
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200 group"
                              title="Remove item"
                            >
                              <Trash2 className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 lg:sticky lg:top-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-gray-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Summary
                  </h2>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="text-base">Subtotal</span>
                    <span className="font-semibold text-lg">
                      Nrs. {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="text-base">Items</span>
                    <span className="font-semibold">{cartItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700 pb-3 border-b-2 border-gray-100">
                    <span className="text-base">Shipping</span>
                    <span className="font-semibold text-green-600">
                      {0 === 0 ? "Free" : `Nrs. ${(0)?.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        Nrs. {total?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleOrderproceed}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl mt-6 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={handleRedirect}
                  className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl mt-3 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Options Modal */}
      <PaymentOptionsModal
        open={showPaymentModal}
        onClose={handleClosePaymentModal}
        onCashOnDelivery={handleCashOnDelivery}
        onFonepay={handleFonepay}
      />
    </div>
  );
};

export default MyCart;
