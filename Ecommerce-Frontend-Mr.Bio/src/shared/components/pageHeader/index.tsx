import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react"; // or use HeroIcons

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  backgroundColor?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs,
  backgroundColor = "#e8f5e8",
}) => {
  const navigate = useNavigate();

  return (
    <div className="py-8 text-center" style={{ backgroundColor }}>
      <h1 className="text-3xl font-bold text-[#2e5d2e] mb-2">{title}</h1>
      <nav className="flex justify-center text-sm text-gray-600 space-x-1">
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-500 mt-[2px]" />
            )}
            {item.path ? (
              <button
                onClick={() => navigate(item.path!)}
                className="hover:underline cursor-pointer"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-gray-600">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

export default PageHeader;
