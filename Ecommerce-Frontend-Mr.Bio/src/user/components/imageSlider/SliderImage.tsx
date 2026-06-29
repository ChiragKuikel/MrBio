import React from "react";

// export const GroceryBasketImage: React.FC = () => (
//   <div className="relative">
//     <div className="absolute -top-4 -left-4 w-20 h-20 opacity-20">
//       <svg viewBox="0 0 100 100" className="w-full h-full text-green-400">
//         <path
//           d="M50 10 L60 40 L90 40 L70 60 L80 90 L50 75 L20 90 L30 60 L10 40 L40 40 Z"
//           fill="currentColor"
//         />
//       </svg>
//     </div>
//     <div className="w-80 h-64 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center">
//       <div className="text-6xl">🧺</div>
//     </div>
//     <div className="absolute -bottom-2 -right-2 text-4xl">🥕</div>
//     <div className="absolute top-4 -right-4 text-3xl">🍎</div>
//     <div className="absolute -left-6 top-12 text-3xl">🥬</div>
//     <div className="absolute bottom-8 -left-4 text-2xl">🍇</div>
//   </div>
// );

export const VegetableImage: React.FC = () => (
  <div className="relative">
    <div className="w-80 h-64 bg-gradient-to-br from-green-200 to-green-300 rounded-full flex items-center justify-center">
      <div className="text-6xl">🥗</div>
    </div>
    <div className="absolute -top-2 right-4 text-3xl">🥒</div>
    <div className="absolute bottom-2 -right-2 text-3xl">🍅</div>
    <div className="absolute -left-4 bottom-8 text-2xl">🥦</div>
  </div>
);

export const TropicalFruitImage: React.FC = () => (
  <div className="relative">
    <div className="w-80 h-64 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full flex items-center justify-center">
      <div className="text-6xl">🍍</div>
    </div>
    <div className="absolute -top-2 -left-2 text-3xl">🥭</div>
    <div className="absolute bottom-4 right-2 text-3xl">🍌</div>
    <div className="absolute left-2 top-8 text-2xl">🥥</div>
  </div>
);
