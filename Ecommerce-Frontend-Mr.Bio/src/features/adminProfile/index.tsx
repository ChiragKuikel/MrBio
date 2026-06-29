/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useGetUserDetailsById } from "../../shared/hooks/user/get/useGetUserDetailsById";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  AdminPanelSettings,
  CalendarToday,
} from "@mui/icons-material";

interface UserData {
  data: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    dob?: string;
    gender?: string;
    roles?: string[];
    phones?: Array<{
      value: string;
      countryCode: string;
    }>;
    address?: {
      city?: string;
      state?: string;
      zip?: string;
      line1?: string;
      line2?: string;
    };
  };
}

const AdminProfile = () => {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );

        const decoded = JSON.parse(jsonPayload);
        setUserId(decoded?.userId ?? undefined);
      } catch (err) {
        console.error("Invalid token format", err);
      }
    }
  }, []);

  const { data, isLoading, error } = useGetUserDetailsById(userId) as {
    data?: UserData;
    isLoading: boolean;
    error: any;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const InfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | undefined;
  }) => (
    <div className="flex items-start gap-3 py-2 w-full">
      <div className="text-blue-600 mt-1">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-sm text-gray-800">{value || "-"}</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500 text-sm">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg">
          <p className="font-semibold mb-1">Failed to load profile</p>
          <p>Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const userData = data?.data;
  const fullName = [userData?.firstName, userData?.middleName, userData?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="bg-default shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-grey p-6 flex gap-4 items-center">
          <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl font-bold">
            {getInitials(userData?.firstName, userData?.lastName)}
          </div>
          <div>
            <h1 className="text-lg font-semibold">{fullName || "Admin User"}</h1>
            <p className="opacity-80">@{userData?.username}</p>
            <div className="flex gap-2 flex-wrap mt-2">
              {userData?.roles?.map((role, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 bg-green bg-opacity-20 text-white px-2 py-1 rounded text-xs"
                >
                  <AdminPanelSettings fontSize="small" />
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Personal Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <InfoItem icon={<Person />} label="Full Name" value={fullName} />
              <InfoItem icon={<Person />} label="Gender" value={userData?.gender} />
              <InfoItem icon={<Email />} label="Email" value={userData?.email} />
              <InfoItem
                icon={<Phone />}
                label="Phone"
                value={
                  userData?.phones?.[0]?.value
                    ? `${userData.phones[0].countryCode || ""} ${userData.phones[0].value}`
                    : undefined
                }
              />
              <InfoItem icon={<CalendarToday />} label="Date of Birth" value={formatDate(userData?.dob)} />
            </div>
          </div>

          {/* Address Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Address Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <InfoItem icon={<LocationOn />} label="Address Line 1" value={userData?.address?.line1} />
              <InfoItem icon={<LocationOn />} label="Address Line 2" value={userData?.address?.line2} />
              <InfoItem icon={<LocationOn />} label="City" value={userData?.address?.city} />
              <InfoItem icon={<LocationOn />} label="State" value={userData?.address?.state} />
              <InfoItem icon={<LocationOn />} label="ZIP" value={userData?.address?.zip} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
