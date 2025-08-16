
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OfferSection() {
	// Next.js router for navigation
	const router = useRouter();
	// Drag state
	const [dragStartX, setDragStartX] = useState<number | null>(null);
	const [dragCurrentX, setDragCurrentX] = useState<number | null>(null);
	const [dragging, setDragging] = useState(false);

	// Handle drag start
	const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
		setDragging(true);
		let startX: number | null = null;
		if ('touches' in e) {
			startX = e.touches && e.touches[0] ? e.touches[0].clientX : null;
		} else if ('clientX' in e) {
			startX = typeof e.clientX === 'number' ? e.clientX : null;
		}
		setDragStartX(startX);
		setDragCurrentX(startX);
	};

	// Handle drag end
	const handleDragEnd = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
		if (!dragging || dragStartX === null || dragCurrentX === null) {
			setDragging(false);
			setDragStartX(null);
			setDragCurrentX(null);
			return;
		}
		const diff = dragCurrentX - dragStartX;
		if (Math.abs(diff) > 50) {
			setPrev(current);
			setAnimating(true);
			if (diff < 0) {
				setDirection(1);
				setCurrent((prev) => (prev + 1) % totalSlides);
			} else {
				setDirection(-1);
				setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides);
			}
		}
		setDragging(false);
		setDragStartX(null);
		setDragCurrentX(null);
	};

	// Prevent default scrolling on drag
	const handleDragMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
		if (!dragging) return;
		let currentX: number | null = null;
		if ('touches' in e) {
			currentX = e.touches && e.touches[0] ? e.touches[0].clientX : null;
		} else if ('clientX' in e) {
			currentX = typeof e.clientX === 'number' ? e.clientX : null;
		}
		setDragCurrentX(currentX);
		if (dragging) e.preventDefault();
	};
		const [current, setCurrent] = useState(0);
		const [prev, setPrev] = useState(0);
		const [animating, setAnimating] = useState(false);

		// Animation direction: 1 for next, -1 for prev
		const [direction, setDirection] = useState(1);

	// Number of slides
	const totalSlides = 5;

		useEffect(() => {
			const timer = setTimeout(() => {
				setPrev(current);
				setDirection(1);
				setAnimating(true);
				setCurrent((prev) => (prev + 1) % totalSlides);
			}, 3000);
			return () => clearTimeout(timer);
		}, [current]);

		useEffect(() => {
			if (animating) {
				const timeout = setTimeout(() => setAnimating(false), 700);
				return () => clearTimeout(timeout);
			}
		}, [animating]);

			return (
				<div className="mt-20 w-full flex flex-col items-start pl-4 pr-4">
					<h2 className="text-3xl font-bold text-black mb-8 text-left pl-2 ml-2 dark:text-white">
						Special <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent dark:from-orange-400 dark:to-red-400">offers</span> for you
					</h2>
						   <div
							   className="relative w-full max-w-full h-36 md:min-h-[18rem] flex items-center justify-center overflow-hidden"
							   onMouseDown={handleDragStart}
							   onMouseUp={handleDragEnd}
							   onMouseLeave={handleDragEnd}
							   onMouseMove={handleDragMove}
							   onTouchStart={handleDragStart}
							   onTouchEnd={handleDragEnd}
							   onTouchMove={handleDragMove}
							   style={{ cursor: dragging ? 'grabbing' : 'grab' }}
						   >
						  {/* Slides with animation */}
									{/* Slide 1 - Independent design */}
									<div className={(() => {
										let slideClass = "absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-700";
										if (current === 0 && animating) {
											slideClass += ` z-20 opacity-100 animate-slide-in-right`;
										} else if (prev === 0 && animating) {
											slideClass += ` z-10 opacity-0 animate-slide-out-left`;
										} else if (current === 0) {
											slideClass += " z-20 opacity-100";
										} else {
											slideClass += " hidden";
										}
										return slideClass;
									})()}>
										<img src="/burgeroffer.jpeg" alt="Offer 1" className="w-full h-full object-cover rounded-xl shadow-lg cursor-pointer" onClick={() => router.push('/orders?food=burger')} />
										{/* Add custom heading/button for slide 1 here */}
									</div>
									{/* Slide 2 - Independent design */}
									<div className={(() => {
										let slideClass = "absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-700";
										if (current === 1 && animating) {
											slideClass += ` z-20 opacity-100 animate-slide-in-right`;
										} else if (prev === 1 && animating) {
											slideClass += ` z-10 opacity-0 animate-slide-out-left`;
										} else if (current === 1) {
											slideClass += " z-20 opacity-100";
										} else {
											slideClass += " hidden";
										}
										return slideClass;
									})()}>
										<img src="/orderpoints.jpeg" alt="Offer 2" className="w-full h-full object-cover rounded-xl shadow-lg cursor-pointer" onClick={() => router.push('/orderpoints')} />
										{/* Add custom heading/button for slide 2 here */}
									</div>
									{/* Slide 3 - Independent design */}
									<div className={(() => {
										let slideClass = "absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-700";
										if (current === 2 && animating) {
											slideClass += ` z-20 opacity-100 animate-slide-in-right`;
										} else if (prev === 2 && animating) {
											slideClass += ` z-10 opacity-0 animate-slide-out-left`;
										} else if (current === 2) {
											slideClass += " z-20 opacity-100";
										} else {
											slideClass += " hidden";
										}
										return slideClass;
									})()}>
										<img src="/dosaoffer.jpg" alt="Offer 3" className="w-full h-full object-cover rounded-xl shadow-lg cursor-pointer" onClick={() => router.push('/orders?food=dosa')} />
										{/* Add custom heading/button for slide 3 here */}
									</div>
									{/* Slide 4 - Independent design */}
									<div className={(() => {
										let slideClass = "absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-700";
										if (current === 3 && animating) {
											slideClass += ` z-20 opacity-100 animate-slide-in-right`;
										} else if (prev === 3 && animating) {
											slideClass += ` z-10 opacity-0 animate-slide-out-left`;
										} else if (current === 3) {
											slideClass += " z-20 opacity-100";
										} else {
											slideClass += " hidden";
										}
										return slideClass;
									})()}>
										<img src="/lpuoffer.jpeg" alt="Offer 4" className="w-full h-full object-cover rounded-xl shadow-lg" />
										{/* Add custom heading/button for slide 4 here */}
									</div>
									{/* Slide 5 - Independent design */}
									<div className={(() => {
										let slideClass = "absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-700";
										if (current === 4 && animating) {
											slideClass += ` z-20 opacity-100 animate-slide-in-right`;
										} else if (prev === 4 && animating) {
											slideClass += ` z-10 opacity-0 animate-slide-out-left`;
										} else if (current === 4) {
											slideClass += " z-20 opacity-100";
										} else {
											slideClass += " hidden";
										}
										return slideClass;
									})()}>
										<img src="/pizzaoffer.jpg" alt="Offer 5" className="w-full h-full object-cover rounded-xl shadow-lg cursor-pointer" onClick={() => router.push('/orders?food=pizza')} />
										{/* Add custom heading/button for slide 5 here */}
									</div>
					</div>
					{/* Navigation dots - always visible and below the image */}
				<div className="flex justify-center items-center gap-3 mt-6 w-full">
						{[0,1,2,3,4].map(idx => (
							<span
								key={idx}
								className={`w-4 h-4 rounded-full transition-all duration-300 border border-orange-300 dark:border-orange-700 ${current === idx ? 'bg-orange-500 dark:bg-orange-400 scale-110 shadow-lg' : 'bg-gray-200 dark:bg-gray-800'}`}
								style={{ display: 'inline-block' }}
							/>
						))}
					</div>
					{/* Animations (Tailwind CSS custom classes) */}
					<style>{`
						@keyframes slide-in-right {
							0% { opacity: 0; transform: translateX(100px); }
							100% { opacity: 1; transform: translateX(0); }
						}
						@keyframes slide-in-left {
							0% { opacity: 0; transform: translateX(-100px); }
							100% { opacity: 1; transform: translateX(0); }
						}
						@keyframes slide-out-left {
							0% { opacity: 1; transform: translateX(0); }
							100% { opacity: 0; transform: translateX(-100px); }
						}
						@keyframes slide-out-right {
							0% { opacity: 1; transform: translateX(0); }
							100% { opacity: 0; transform: translateX(100px); }
						}
						.animate-slide-in-right { animation: slide-in-right 0.7s forwards; }
						.animate-slide-in-left { animation: slide-in-left 0.7s forwards; }
						.animate-slide-out-left { animation: slide-out-left 0.7s forwards; }
						.animate-slide-out-right { animation: slide-out-right 0.7s forwards; }
					`}</style>
				</div>
			);
}
