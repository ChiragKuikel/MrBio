import { Clock, Mail, MapPin, Phone } from 'lucide-react';

export const ContactInfo = ({ 
  address = "Hanumansthan, Kathmandu, Nepal",
  phone = "+977-9801030766",
  email = "mrbionp@gmail.com",
  hours = "24/7",
  className = ""
}) => {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-6 p-6 bg-white ${className}`}>
      {/* Location */}
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <MapPin className="w-5 h-5 text-green-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
            {address}
          </p>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Phone className="w-5 h-5 text-green-600" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 mb-1">Call us :</p>
          <p className="text-sm text-gray-800 font-medium">
            {phone}
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Mail className="w-5 h-5 text-green-600" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 mb-1">Mail us :</p>
          <p className="text-sm text-gray-800 font-medium">
            {email}
          </p>
        </div>
      </div>

      {/* Hours */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Clock className="w-5 h-5 text-green-600" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 mb-1">Open time :</p>
          <p className="text-sm text-gray-800 font-medium">
            {hours}
          </p>
        </div>
      </div>
    </div>
  );
};