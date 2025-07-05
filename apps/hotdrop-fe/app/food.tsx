import React, { useRef } from "react";

const foods = [
  { name: "Burger", image: "/burger.png" },
  { name: "Cake", image: "/cake.png" },
  { name: "Pizza", image: "/pizza.png" },
  { name: "Momos", image: "/momo.png" },
  { name: "Ice Cream", image: "/icecream.png" },
  { name: "Chinese", image: "/chinese.png" },
  { name: "Rolls", image: "/rolls.png" },
  { name: "Sandwich", image: "/sandwich.png" },
  { name: "Chole Bhature", image: "/cholebhaturf.png" },
  { name: "Dosa", image: "/dosaf.png" },
  { name: "Manchurian", image: "/manchuriyanf.png" },
  { name: "Shake", image: "/shakef.png" }
];

export const foodSectionId = "popular-food-section";

export default function FoodSection() {
  return (
    <section id={foodSectionId} className="my-8 w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold text-orange-600 mb-8 text-left pl-2">Popular Foods</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-16 gap-y-12">
        {foods.map((food) => (
          <li
            key={food.name}
            className="flex flex-col items-center transition-transform duration-150 cursor-pointer hover:animate-food-scale group"
            style={{ willChange: 'transform' }}
          >
            <div className="rounded-xl p-2 group-hover:bg-orange-100 group-hover:shadow-lg transition-colors transition-shadow duration-200 w-full flex flex-col items-center">
              <img src={food.image} alt={food.name} className="w-32 h-32 object-contain mb-4 pointer-events-none" />
              <span className="font-bold text-gray-800 text-xl">{food.name}</span>
            </div>
          </li>
        ))}
      </ul>
      <style jsx global>{`
        @keyframes food-scale {
          0% { transform: scale(1); }
          20% { transform: scale(1.08); }
          40% { transform: scale(1.12); }
          60% { transform: scale(1.08); }
          80% { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        .hover\:animate-food-scale:hover {
          animation: food-scale 0.3s cubic-bezier(0.4, 0.2, 0.2, 1);
        }
      `}</style>
    </section>
  );
}
