// Define the Button component
export const CustomButton = ({ children, variant = 'primary', onClick, className = '', showArrow = false, width, ...props }: any) => {
    const baseClasses = 'font-inter py-3 px-6 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75 flex items-center justify-center';
    const primaryClasses = 'bg-[#77b831] text-white shadow-md hover:bg-[#609328] hover:shadow-lg focus:ring-[#8dc74a]';
    const secondaryClasses = 'bg-white text-green-600 border border-green-600 shadow-sm hover:bg-green-50 hover:border-green-700 hover:shadow-md focus:ring-green-500';
    const variantClasses = variant === 'primary' ? primaryClasses : secondaryClasses;

    // Dynamically apply width if provided
    const widthClass = width ? `w-${width}` : '';

    return (
        <button
            className={`${baseClasses} ${variantClasses} ${widthClass} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
            {/* Conditionally render the arrow icon */}
            {showArrow && (
                <span className="ml-2">
                    {/* SVG for right arrow icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                </span>
            )}
        </button>
    );
};