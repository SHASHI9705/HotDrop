import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export const foodSectionId = "popular-food-section";

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

export default function FoodSection() {
  const router = useRouter();
  const handleFoodClick = (foodName: string) => {
    router.push(`/orders?food=${encodeURIComponent(foodName)}`);
  };
  return (
    <section id={foodSectionId} className="my-8 w-full max-w-8xl mx-auto">
      <h2 className="mt-12 text-3xl font-extrabold text-orange-600 mb-8 text-left pl-2 ml-2">
        Popular Foods
      </h2>
      <ul className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-x-16 gap-y-12">
        {foods.map((food) => (
          <li
            key={food.name}
            className="flex flex-col items-center cursor-pointer group cursor"
            style={{ willChange: "transform" }}
            onClick={() => handleFoodClick(food.name)}
          >
            <motion.div
              whileHover={{
                scale: 1.12,
                boxShadow: "0 0 0px 0px transparent",
                backgroundColor: "transparent"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="rounded-xl p-2 w-full flex flex-col items-center bg-transparent transition-colors transition-shadow duration-200"
              style={{ backgroundColor: "transparent", boxShadow: "none" ,}}
            >
              <motion.img
                src={food.image}
                alt={food.name}
                className="w-32 h-32 object-contain mb-4 group-hover:cursor-pointer"
                whileHover={{ scale: 1.08, rotate: -4 }}
                transition={{ type: "spring", stiffness: 200, damping: 16 }}
              />
              <span className="font-bold text-gray-800 text-xl">
                {food.name}
              </span>
            </motion.div>
          </li>
        ))}
      </ul>
    </section>
  );
}