/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import usePostOrderById from "../../../shared/hooks/user/order/post/usePostOrderById";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

interface OrderItem {
  productId: string;
  quantity: number;
  price?: number;
}

const Order: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const totalAmountProduct = location?.state?.subtotal;
  const { cartItems = [] } = location?.state || {};
  const orderItemsDetails: OrderItem[] = cartItems?.map((item: any) => ({
    productId: item.productId,
    quantity: item.quantity,
    ...(item.price && { price: item.price }),
  }));

  const shippingCost = 100;
  const subtotal = totalAmountProduct || 0;
  const total = subtotal + shippingCost;

  const user_Id = localStorage.getItem("userId");

  const { mutate: postOrder, isPending } = usePostOrderById();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      shippingAddress: "",
      paymentMethod: "cash",
    },
  });

  const handleFormSubmit = (data: any) => {
    postOrder(
      {
        contact: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
        },
        userId: user_Id ?? "",
        totalAmount: total,
        status: "pending",
        payment: {
          method: data.paymentMethod,
          status: "pending",
          date: new Date().toISOString(),
          amount: total,
        },
        shippingAddress: data.shippingAddress,
        shippingCost,
        orderItems: orderItemsDetails,
      },
      {
        onSuccess: () => {
          // ✅ Redirect after successful order
          navigate("home/my-order-history");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold mb-6">Order Details</h2>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Form */}
          <div className="flex-1">
            <form
              className="space-y-4"
              onSubmit={handleSubmit(handleFormSubmit)}
            >
              <div>
                <label className="block mb-1 font-medium">Name *</label>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Email *</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Phone *</label>
                <input
                  {...register("phone", { required: "Phone is required" })}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Address *</label>
                <input
                  {...register("address", { required: "Address is required" })}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Shipping Address *
                </label>
                <input
                  {...register("shippingAddress", {
                    required: "Shipping address is required",
                  })}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.shippingAddress && (
                  <p className="text-red-500 text-xs">
                    {errors.shippingAddress.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Payment Method *
                </label>
                <select
                  {...register("paymentMethod", {
                    required: "Payment method is required",
                  })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="cash">Cash On Delivery</option>
                </select>
                {errors.paymentMethod && (
                  <p className="text-red-500 text-xs">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Right Column - Cart Total */}
          <div className="flex-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Cart Total</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Sub Total</span>
                  <span>Nrs. {subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>(+) Shipping</span>
                  <span>Nrs. {shippingCost.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3 mt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>Nrs. {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Payments</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      // name="paymentMethod"
                      id="cash_on_delivery"
                      value="cash"
                      defaultChecked
                      {...register("paymentMethod", {
                        required: "Payment method is required",
                      })}
                      className="mr-2"
                    />
                    <label htmlFor="cash_on_delivery">Cash On Delivery</label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                onClick={handleSubmit(handleFormSubmit)}
                className="w-full mt-6 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded transition duration-200"
                disabled={isPending}
              >
                {isPending ? "Placing Order..." : "PROCEED TO CHECKOUT"}
              </button>
              {/* <button
                type="button"
                onClick={handleFonePay}
                className="w-full mt-6 bg-green-500 hover:bg-green-800 text-white font-semibold py-3 rounded transition duration-200"
              >
                Pay with fonepay
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
