/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useGetUserDetailsById } from "../../../../shared/hooks/user/get/useGetUserDetailsById";
import {
  Edit3,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { useUpdateUserDetails } from "../../../../shared/hooks/user/patch/usePatchUserDetailsById";

// Define the user type based on API response structure
interface UserData {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    dob?: string;
    gender?: "male" | "female" | "other";
    roles?: string[];
    phones?: Array<{
      value: string;
      countryCode: string;
      countryISO: string;
      type: string;
    }>;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
  };
}

const UserProfile = () => {
  const userId = localStorage.getItem("userId");
  const { data: user } = useGetUserDetailsById<UserData>(userId || "");
  const { mutate: updateUserDetails } = useUpdateUserDetails(userId || "");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Record<string, any>>({});

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading user data...</span>
        </div>
      </div>
    );

  // Extract user data for easier access
  const userData = user.data;

  const handleEdit = (field: string, currentValue: any) => {
    setEditingField(field);
    setEditedData({ ...editedData, [field]: currentValue });
  };

  const handleSave = (field: string) => {
    if (!userId) return;
    const value = editedData[field];
    let updateData: any = {};

    switch (field) {
      case "firstName":
      case "lastName":
      case "email":
      case "dob":
        updateData = { [field]: value };
        break;
      case "gender":
        updateData = { gender: value as "male" | "female" | "other" };
        break;
      case "phone": {
        const phoneValue = value.replace(/\D/g, "");
        updateData = {
          phones: [
            {
              value: phoneValue,
              countryCode: "+1",
              countryISO: "US",
              type: "cell",
            },
          ],
        };
        break;
      }
      case "address": {
        updateData = {
          address: {
            ...userData.address,
            line1: value,
          },
        };
        break;
      }
      default:
        updateData = { [field]: value };
    }

    updateUserDetails(updateData, {
      onSuccess: () => {
        setEditingField(null);
        setEditedData({});
      },
      onError: (error) => {
        console.error(`Failed to update ${field}:`, error);
      },
    });
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditedData({});
  };

  const EditableField = ({
    field,
    value,
    label,
    icon: Icon,
    type = "text",
    className = "",
  }: any) => {
    const isEditing = editingField === field;
    
    return (
      <div className={`group ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-600">{label}</label>
          </div>
          {!isEditing && (
            <button
              onClick={() => handleEdit(field, value)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all duration-200"
            >
              <Edit3 className="w-4 h-4 text-gray-400 hover:text-blue-600" />
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="flex items-center space-x-2">
            {field === "gender" ? (
              <select
                value={editedData[field] || ""}
                onChange={(e) =>
                  setEditedData({ ...editedData, [field]: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <input
                type={type}
                value={editedData[field] || ""}
                onChange={(e) =>
                  setEditedData({ ...editedData, [field]: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            )}
            <button
              onClick={() => handleSave(field)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <p className="text-gray-800 font-medium bg-gray-50 px-3 py-2 rounded-lg group-hover:bg-gray-100 transition-colors">
            {value || "Not provided"}
          </p>
        )}
      </div>
    );
  };

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();

  const formatPhone = (phone: any) => {
    if (!phone) return "Not provided";
    return `${phone.countryCode || ""} ${phone.value || ""}`.trim();
  };

  const formatAddress = (address: any) => {
    if (!address) return "Not provided";
    const parts = [address.line1, address.line2, address.city, address.state];
    const formatted = parts.filter(Boolean).join(", ");
    return address.zip ? `${formatted} - ${address.zip}` : formatted;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {getInitials(userData.firstName, userData.lastName)}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {userData.firstName} {userData.lastName}
            </h1>
            <p className="text-gray-600">@{userData.username}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {userData.roles?.map((role: any, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Profile Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditableField
            field="firstName"
            value={userData.firstName}
            label="First Name"
            icon={User}
          />
          <EditableField
            field="lastName"
            value={userData.lastName}
            label="Last Name"
            icon={User}
          />
          <EditableField
            field="email"
            value={userData.email}
            label="Email"
            icon={Mail}
            type="email"
          />
          <EditableField
            field="phone"
            value={formatPhone(userData.phones?.[0])}
            label="Phone"
            icon={Phone}
            type="tel"
          />
          <EditableField
            field="dob"
            value={userData.dob}
            label="Date of Birth"
            icon={Calendar}
            type="date"
          />
          <EditableField
            field="gender"
            value={userData.gender}
            label="Gender"
            icon={User}
          />
          <EditableField
            field="address"
            value={formatAddress(userData.address)}
            label="Address"
            icon={MapPin}
            className="md:col-span-2"
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;