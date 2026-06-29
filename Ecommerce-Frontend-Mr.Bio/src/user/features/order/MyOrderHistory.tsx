import PageHeader from "../../../shared/components/pageHeader"
import useGetOrderHistoryByUserId from "../../../shared/hooks/order/get/useGetOrderHistoryByUserId"

const MyOrderHistory = () => {
    const userId = localStorage.getItem('userId');
    const {data} = useGetOrderHistoryByUserId(userId || "");
    
    const orders = data?.data?.rows || [];
    
    const getStatusColor = (status:any) => {
        switch(status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    const getPaymentStatusColor = (status:any) => {
        switch(status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'paid': return 'bg-green-100 text-green-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    const formatDate = (dateString:any) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <PageHeader
                title="Order"
                breadcrumbs={[{ label: "Home", path: "/" }, { label: "Order History" }]}
            />
            
            <div className="container mx-auto px-4 py-8">
                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-gray-50 rounded-lg p-8">
                            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                            <p className="text-gray-500">You haven't placed any orders yet.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order:any) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                                            <div>
                                                <p className="text-sm text-gray-600">Order Date</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatDate(order.created.at)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Total Amount</p>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    Rs. {order.totalAmount}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 mt-4 md:mt-0">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.payment.status)}`}>
                                                Payment: {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="px-6 py-4">
                                    <div className="space-y-4">
                                        {order.orderItems.map((item:any, index:number) => (
                                            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                                <div className="flex-shrink-0">
                                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                                        {item.product.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Brand: {item.product.brand}
                                                    </p>
                                                    <div className="flex items-center mt-2 space-x-4">
                                                        <span className="text-sm text-gray-600">
                                                            Qty: {item.quantity}
                                                        </span>
                                                        {item.product.discount && (
                                                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                                Nrs {item.product.discount} off
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className="flex items-center space-x-2">
                                                        {item.product.price !== item.product.finalPrice && (
                                                            <span className="text-sm text-gray-500 line-through">
                                                                Rs. {item.product.price}
                                                            </span>
                                                        )}
                                                        <span className="text-sm font-medium text-gray-900">
                                                            Rs. {item.product.finalPrice}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-500 mt-1">
                                                        per item
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                    <div className="flex flex-col md:flex-row md:justify-between">
                                        <div className="mb-4 md:mb-0">
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Information</h4>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">{order.contact.name}</span><br/>
                                                {order.shippingAddress}<br/>
                                                {order.contact.phone}<br/>
                                                {order.contact.email}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Order Summary</h4>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Items:</span>
                                                    <span className="text-gray-900">
                                                        Rs. {order.totalAmount - order.shippingCost}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Shipping:</span>
                                                    <span className="text-gray-900">Rs. {order.shippingCost}</span>
                                                </div>
                                                <div className="flex justify-between border-t pt-1 font-medium">
                                                    <span className="text-gray-900">Total:</span>
                                                    <span className="text-gray-900">Rs. {order.totalAmount}</span>
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <p className="text-xs text-gray-500">
                                                    Payment Method: {order.payment.method.charAt(0).toUpperCase() + order.payment.method.slice(1)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyOrderHistory;