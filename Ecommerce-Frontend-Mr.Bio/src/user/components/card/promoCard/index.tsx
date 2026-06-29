import React from "react";
import { ArrowRight } from "lucide-react";

interface PromoCardProps {
  discountText: string;
  title: string;
  subtitle: string;
  buttonText: string;
  imageUrl: string;
  onClick?: () => void;
}

const PromoCard: React.FC<PromoCardProps> = ({
  discountText,
  title,
  subtitle,
  buttonText,
  imageUrl,
  onClick,
}) => {
  return (
    <div className="relative rounded-[24px] overflow-hidden shadow-md max-w-sm w-full bg-green-800 text-white text-center">
      {/* Background Image with overlay mask */}
      <div
        className="absolute inset-0 bg-cover bg-bottom z-0"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="absolute inset-0 bg-green-800 bg-opacity-90 z-10" />

      {/* Content */}
      <div className="relative z-20 p-6 flex flex-col justify-between min-h-[350px]">
        <div className="mt-4 space-y-2">
          <p className="text-lg underline">{discountText}</p>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-sm text-white/90">{subtitle}</p>
        </div>

        <button
          onClick={onClick}
          className="mt-6 bg-orange-400 text-white text-sm font-semibold px-6 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-orange-500 transition"
        >
          {buttonText} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default PromoCard;
