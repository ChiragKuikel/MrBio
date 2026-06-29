import useGetCategoryLists from "../../shared/hooks/category/get/useGetCategoryList";
import useGetOrderList from "../../shared/hooks/order/get/useGetOrderList";
import useGetProductList from "../../shared/hooks/products/get/useGetProductList";
import useGetUserLists from "../../shared/hooks/user/get/useGetUserLists";

const Dashboard = () => {
  const { data: totalCategoryCount } = useGetCategoryLists();
  const { data: totalProductCount } = useGetProductList();
  const { data: totalOrderCount } = useGetOrderList();
  const { data: totalUserCount } = useGetUserLists();

  // Dashboard statistics with proper null/undefined handling
  const stats = [
    { 
      title: 'Total Users', 
      value: totalUserCount?.data?.metaInfo?.totalCount?.toString() || '0',
      icon: '👥', 
      bgColor: 'bg-blue-100' 
    },
    { 
      title: 'Total Category', 
      value: totalCategoryCount?.data?.metaInfo?.totalCount?.toString() || '0',
      icon: '📁', 
      bgColor: 'bg-green-100' 
    },
    { 
      title: 'Total Products', 
      value: totalProductCount?.data?.metaInfo?.totalCount?.toString() || '0',
      icon: '🛒', 
      bgColor: 'bg-amber-100' 
    },
    { 
      title: 'Total Orders', 
      value: totalOrderCount?.data?.metaInfo?.totalCount?.toString() || '0',
      icon: '💰', 
      bgColor: 'bg-violet-100' 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Hello Admin! Welcome to Dashboard
          </h1>
          <p className="text-gray-500 mt-2">Here's what's happening today</p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats?.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <div className="p-5 md:p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium">
                      {stat.title}
                    </h3>
                    <p className="text-2xl md:text-3xl font-bold mt-1 text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <span className="text-xl">{stat.icon}</span>
                  </div>
                </div>
                {/* <p className="text-green-600 font-medium text-sm mt-3">{stat.change} from last week</p> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;