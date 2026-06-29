import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import usePostPaymentVerification from "../../../shared/hooks/order/fonePayHooks/post/usePostVerifyPayment";
import usePostOrderById from "../../../shared/hooks/user/order/post/usePostOrderById";

// ✅ Reusable loader
const Loader = () => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="w-12 h-12 border-4 border-white border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

// ✅ Reusable component for order details
const OrderDetail = ({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) => (
  <div className="flex justify-between items-center mb-2">
    <span className="text-sm text-gray-600">{label}:</span>
    <span className={`text-sm font-semibold text-gray-800 ${valueClass}`}>
      {value}
    </span>
  </div>
);

const OrderSuccessFulPage = () => {
  const [searchParams] = useSearchParams();
  const [orderCreated, setOrderCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasRun = useRef(false);

  const { mutate: verifyPayment } = usePostPaymentVerification();
  const { mutate: postOrder } = usePostOrderById();

  const productDetails = useMemo(() => {
    const stored = localStorage.getItem("fonepayOrderData");
    return stored ? JSON.parse(stored) : null;
  }, []);

  const paymentParams = useMemo(() => {
    const requiredParams = [
      "PRN",
      "PID",
      "PS",
      "RC",
      "UID",
      "BC",
      "INI",
      "P_AMT",
      "R_AMT",
    ];
    const values: Record<string, string | null> = {};
    let allPresent = true;

    requiredParams.forEach((param) => {
      const val = searchParams.get(param);
      values[param] = val;
      if (!val) allPresent = false;
    });

    return { values, allPresent };
  }, [searchParams]);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const { values, allPresent } = paymentParams;

    if (!allPresent || !productDetails || orderCreated) {
      console.warn("Missing params, product details, or order already created");
      return;
    }

    setLoading(true); // show loader

    const paymentData = {
      PRN: values.PRN!,
      PID: values.PID!,
      PS: values.PS!,
      RC: values.RC!,
      UID: values.UID!,
      BC: values.BC!,
      INI: values.INI!,
      P_AMT: parseFloat(values.P_AMT!),
      R_AMT: parseFloat(values.R_AMT!),
    };

    verifyPayment(paymentData, {
      onSuccess: () => {
        const orderPayload = {
          contact: {
            name: "Customer",
            email: "customer@example.com",
            phone: values.INI!,
            address: "Default Address",
          },
          userId: productDetails.userId,
          totalAmount: productDetails.total,
          status: "pending",
          payment: {
            method: "fonepay",
            status: "completed",
            date: new Date().toISOString(),
            amount: parseFloat(values.P_AMT!),
          },
          shippingAddress: "Default Shipping Address",
          shippingCost: 0,
          orderItems: productDetails.cartItems?.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        };

        postOrder(orderPayload, {
          onSuccess: () => {
            setOrderCreated(true);
            localStorage.removeItem("fonepayOrderData");
            setLoading(false);
          },
          onError: (error) => {
            console.error("Failed to create order:", error);
            setLoading(false);
          },
        });
      },
      onError: (error) => {
        console.error("Payment verification failed:", error);
        setLoading(false);
      },
    });
  }, [paymentParams, productDetails, verifyPayment, postOrder, orderCreated]);

  return (
    <>
      {loading && <Loader />}

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Order Details
            </h3>
            <OrderDetail label="Payment Method" value="FonePay" />
            {(paymentParams.values.P_AMT || productDetails?.total) && (
              <OrderDetail
                label="Amount Paid"
                value={`Rs. ${paymentParams.values.P_AMT || productDetails?.total?.toFixed(2)}`}
                valueClass="text-green-600"
              />
            )}

            {productDetails && (
              <>
                <OrderDetail
                  label="Items Ordered"
                  value={`${productDetails.cartItems?.length} items`}
                />
                {productDetails.shipping && (
                  <OrderDetail
                    label="Shipping"
                    value={`Rs. ${productDetails.shipping?.toFixed(2)}`}
                  />
                )}
              </>
            )}
          </div>

          {/* Items List */}
          {productDetails?.cartItems && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-3">
                Items Ordered
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {productDetails.cartItems.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-700 flex-1 truncate">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="text-gray-600 ml-2">
                      Rs. {(item.product.finalPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Info */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Estimated delivery: 3-7 business days
            </div>
          </div>

          {/* Action Button */}
          {/* <button
            onClick={() => navigate("/user/products")}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button> */}
        </div>
      </div>
    </>
  );
};

export default OrderSuccessFulPage;
