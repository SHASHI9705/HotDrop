import React, { useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const restaurants = [
	{
		name: "Burger Palace",
		image: "/burger.png",
		cuisine: "American",
		rating: 4.8,
		deliveryTime: "20-30 min",
	},
	{
		name: "Cake Castle",
		image: "/cake.png",
		cuisine: "Bakery",
		rating: 4.7,
		deliveryTime: "25-35 min",
	},
	{
		name: "Pizza Point",
		image: "/pizza.png",
		cuisine: "Italian",
		rating: 4.9,
		deliveryTime: "15-25 min",
	},
	{
		name: "Momo Magic",
		image: "/momo.png",
		cuisine: "Tibetan",
		rating: 4.6,
		deliveryTime: "18-28 min",
	},
	{
		name: "Ice Cream Hub",
		image: "/icecream.png",
		cuisine: "Desserts",
		rating: 4.8,
		deliveryTime: "10-20 min",
	},
	{
		name: "Chinese Express",
		image: "/chinese.png",
		cuisine: "Chinese",
		rating: 4.7,
		deliveryTime: "22-32 min",
	},
	{
		name: "Rolls Republic",
		image: "/rolls.png",
		cuisine: "Street Food",
		rating: 4.5,
		deliveryTime: "17-27 min",
	},
	{
		name: "Sandwich Stop",
		image: "/sandwich.png",
		cuisine: "Cafe",
		rating: 4.6,
		deliveryTime: "12-22 min",
	},
	{
		name: "Dosa Delight",
		image: "/dosaf.png",
		cuisine: "South Indian",
		rating: 4.9,
		deliveryTime: "20-30 min",
	},
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
	const repeatedRestaurants = [...restaurants, ...restaurants, ...restaurants];

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
						duration: (40 * 3) / 2, // 3x cards, keep speed similar
					},
				},
			});
		}
	}, [isPaused, controls, totalWidth]);

	return (
		<section className="my-16 w-full max-w-6xl mx-auto">
			<h2 className="mt-12 text-3xl font-extrabold text-orange-600 mb-8 text-left pl-2">
				Popular Restaurants
			</h2>
			<div className="overflow-hidden w-full max-w-6xl mx-auto" ref={containerRef}>
				<motion.div
					className="flex gap-4 flex-nowrap"
					animate={controls}
					style={{ width: totalWidth * 3 }}
				>
					{repeatedRestaurants.map((rest, idx) => (
						<div
							key={idx}
							className="bg-white rounded-xl shadow p-3 flex flex-col items-center border border-orange-100 hover:shadow-lg transition-shadow duration-200 w-[180px] h-[220px] overflow-hidden justify-between cursor-pointer flex-shrink-0"
							onMouseEnter={() => setIsPaused(true)}
							onMouseLeave={() => setIsPaused(false)}
						>
							<img
								src={rest.image}
								alt={rest.name}
								className="w-16 h-16 object-cover mb-2 rounded"
							/>
							<div className="font-bold text-base text-gray-800 mb-0.5 text-center truncate w-full whitespace-nowrap">
								{rest.name}
							</div>
							<div className="text-orange-500 font-medium text-xs mb-0.5 text-center truncate w-full whitespace-nowrap">
								{rest.cuisine}
							</div>
							<div className="flex items-center gap-1 text-gray-600 text-xs mb-0.5 justify-center w-full">
								<span className="font-bold text-orange-500 truncate whitespace-nowrap">
									★ {rest.rating}
								</span>
								<span>•</span>
								<span className="truncate whitespace-nowrap">
									{rest.deliveryTime}
								</span>
							</div>
							<button className="mt-2 px-2 py-1 bg-orange-500 text-white rounded-full font-semibold text-xs hover:bg-orange-600 transition w-full truncate whitespace-nowrap">
								View Menu
							</button>
						</div>
					))}
				</motion.div>
			</div>
		</section>
	);
}