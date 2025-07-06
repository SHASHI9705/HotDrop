import React, { useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const restaurants = [
  {
    name: "Burger Palace",
    image: "/burger.png",
    cuisine: "American",
    rating: 4.8,
    deliveryTime: "20-30 min"
  },
  {
    name: "Cake Castle",
    image: "/cake.png",
    cuisine: "Bakery",
    rating: 4.7,
    deliveryTime: "25-35 min"
  },
  {
    name: "Pizza Point",
    image: "/pizza.png",
    cuisine: "Italian",
    rating: 4.9,
    deliveryTime: "15-25 min"
  },
  {
    name: "Momo Magic",
    image: "/momo.png",
    cuisine: "Tibetan",
    rating: 4.6,
    deliveryTime: "18-28 min"
  },
  {
    name: "Ice Cream Hub",
    image: "/icecream.png",
    cuisine: "Desserts",
    rating: 4.8,
    deliveryTime: "10-20 min"
  },
  {
    name: "Chinese Express",
    image: "/chinese.png",
    cuisine: "Chinese",
    rating: 4.7,
    deliveryTime: "22-32 min"
  },
  {
    name: "Rolls Republic",
    image: "/rolls.png",
    cuisine: "Street Food",
    rating: 4.5,
    deliveryTime: "17-27 min"
  },
  {
    name: "Sandwich Stop",
    image: "/sandwich.png",
    cuisine: "Cafe",
    rating: 4.6,
    deliveryTime: "12-22 min"
  },
  {
    name: "Dosa Delight",
    image: "/dosaf.png",
    cuisine: "South Indian",
    rating: 4.9,
    deliveryTime: "20-30 min"
  }
];

export default function PopularRestaurantsSection() {
  const [isPaused, setIsPaused] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate total width for seamless loop
  // Each card is ~260px wide (p-6 + w-28 + margins), 9 cards, plus gap
  const cardWidth = 260;
  const gap = 32; // gap-8
  const totalCards = restaurants.length;
  const totalWidth = totalCards * (cardWidth + gap);

  React.useEffect(() => {
    if (isPaused) {
      controls.stop();
    } else {
      controls.start({
        x: [0, -totalWidth],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            duration: 40,
          },
        },
      });
    }
  }, [isPaused, controls, totalWidth]);

  return (
    <section className="my-16 w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold text-orange-600 mb-8 text-left pl-2">Popular Restaurants</h2>
      <div className="overflow-x-hidden w-full" ref={containerRef}>
        <motion.div
          className="flex gap-8"
          animate={controls}
          style={{ width: totalWidth * 2 }}
        >
          {[...restaurants, ...restaurants].map((rest, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border border-orange-100 hover:shadow-xl transition-shadow duration-200 min-w-[260px] max-w-[260px] cursor-pointer"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <img src={rest.image} alt={rest.name} className="w-28 h-28 object-contain mb-4 rounded-xl" />
              <div className="font-bold text-lg text-gray-800 mb-1">{rest.name}</div>
              <div className="text-orange-500 font-semibold text-sm mb-1">{rest.cuisine}</div>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <span className="font-bold text-orange-500">★ {rest.rating}</span>
                <span>•</span>
                <span>{rest.deliveryTime}</span>
              </div>
              <button className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-full font-semibold text-sm hover:bg-orange-600 transition">View Menu</button>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
