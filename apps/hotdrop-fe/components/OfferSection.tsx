import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Card = {
  title: string;
  description: string;
  bgColor: string;
  image: string;
  route: string;
};

const cards: Card[] = [

  {
    title: "Burgers That Mean Business",
    description: "Stacked high, packed with irresistible flavor, and grilled to perfection, our burgers don’t just satisfy hunger, they make a bold statement with every juicy, mouthwatering bite.",
    bgColor: "bg-green-900",
    image: "/burgeroffer.png",
  route: "/orders?food=burger",
  },
  {
    title: "Where Every Slice is a Story",
    description: "Dive into the perfect blend of gooey cheese, rich sauce, and a crust that’s just the right kind of crispy. One bite and you’ll know why our pizzas are a legend in the making.",
    bgColor: "bg-red-700",
    image: "/pizzaoffer.png",
  route: "/orders?food=pizza",
  },
  {
    title: "Earn More with Every Bite",
    description: "Every bite takes you closer to rewards! Earn 5 points with every order , more orders mean more points, and more points mean bigger chances to win exclusive prizes.",
    bgColor: "bg-green-900",
    image: "/orderpoints.png",
  route: "/orderpoints",
  },
  
  {
    title: "Skip the Wait, Savor the Crisp",
    description: "Golden, crispy, and stuffed with love, our dosas are ready to roll the moment you are. Fresh off the pan and full of flavor, why wait when a taste like this is calling your name?",
    bgColor: "bg-yellow-900",
    image: "/dosaoffer.png",
  route: "/orders?food=dosa",
  },
  {
    title: "5% Off on one order",
    description: "Show your LPU ID and enjoy 5% off on any one order. Because great food tastes even better when it comes with a little extra love for our students.",
    bgColor: "bg-purple-900",
    image: "/lpuoffer.png",
  route: "/lpu-offer",
  },
];

export default function OfferSection() {
  // For infinite loop, we add clones of first and last card
  const [current, setCurrent] = useState(1); // Start at 1 (first real card)

  // Always reset to first card on mount/remount
  useEffect(() => {
    setCurrent(1);
  }, []);
  // Remove sliderWidth logic, use min-w-full for each card
  const [transitioning, setTransitioning] = useState(false);
  const total = cards.length;
  // Only add clones if cards exist and are defined
  const extendedCards: Card[] = total > 0
    ? [cards[total - 1] as Card, ...cards, cards[0] as Card]
    : [];
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);
  const dragDelta = useRef<number>(0);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setTransitioning(true);
      setCurrent((prev) => {
        if (prev >= total + 1) return 1;
        if (prev <= 0) return total;
        return prev + 1;
      });
    }, 3000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, total]);

  // Mouse/touch drag/swipe handlers
  useEffect(() => {
    const slider = dragRef.current;
    if (!slider) return;
    let dragging = false;
    let startX = 0;
    let moved = false;

    const onDragStart = (e: MouseEvent | TouchEvent) => {
      dragging = true;
      moved = false;
      if ('touches' in e) {
        const touchEvent = e as TouchEvent;
        if (touchEvent.touches && touchEvent.touches.length > 0 && typeof touchEvent.touches[0] !== 'undefined') {
          startX = touchEvent.touches[0].clientX;
        } else {
          startX = 0;
        }
      } else {
        startX = (e as MouseEvent).clientX;
      }
      dragStartX.current = startX;
    };
    const onDragMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      let x = 0;
      if ('touches' in e) {
        const touchEvent = e as TouchEvent;
        if (touchEvent.touches && touchEvent.touches.length > 0 && typeof touchEvent.touches[0] !== 'undefined') {
          x = touchEvent.touches[0].clientX;
        }
      } else {
        x = (e as MouseEvent).clientX;
      }
      dragDelta.current = x - startX;
      if (Math.abs(dragDelta.current) > 30) moved = true;
    };
    const onDragEnd = () => {
      if (!dragging) return;
      dragging = false;
      if (moved) {
        setTransitioning(true);
        if (dragDelta.current < -30) setCurrent((prev) => prev + 1);
        else if (dragDelta.current > 30) setCurrent((prev) => prev - 1);
      }
      dragDelta.current = 0;
      dragStartX.current = null;
    };
    slider.addEventListener('mousedown', onDragStart);
    slider.addEventListener('touchstart', onDragStart);
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('touchmove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
    window.addEventListener('touchend', onDragEnd);
    return () => {
      slider.removeEventListener('mousedown', onDragStart);
      slider.removeEventListener('touchstart', onDragStart);
      window.removeEventListener('mousemove', onDragMove);
      window.removeEventListener('touchmove', onDragMove);
      window.removeEventListener('mouseup', onDragEnd);
      window.removeEventListener('touchend', onDragEnd);
    };
  }, [current]);

  // Handle transition end for seamless loop
  const handleTransitionEnd = () => {
    setTransitioning(false);
    if (current === 0) {
      setCurrent(total);
    } else if (current === total + 1) {
      setCurrent(1);
    }
  };
  // Removed slider buttons, use drag/swipe instead

  return (
  <div className="w-full mt-20 flex flex-col items-center py-8">
      <div className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-black mb-8 text-left pl-2 ml-2 dark:text-white">
          Special <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent dark:from-orange-400 dark:to-red-400">Offers</span> for you!
        </h2>
      </div>
      <div className="relative w-full max-w-6xl overflow-hidden" ref={dragRef} style={{ cursor: 'grab' }}>
        <div
          className="flex"
          style={{
            transition: transitioning ? 'transform 0.7s' : 'none',
            transform: `translateX(-${current * 100}%)`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedCards.map((card, idx) => (
            card ? (
              <div
                key={idx}
                className="w-full min-w-full flex-shrink-0 flex justify-center px-0 sm:px-4"
              >
                <div className={`rounded-xl shadow-2xl flex flex-col sm:flex-row items-center sm:items-stretch gap-4 sm:gap-10 pt-1 px-2 sm:px-12 pb-4 sm:pb-12 w-[90vw] sm:w-full h-auto h-10rem sm:h-[14.4rem] mx-auto ${card.bgColor}`}> 
                  <div className="flex-1 flex flex-col items-center sm:items-start justify-between">
                    <div className="flex flex-row items-center gap-2 sm:gap-1 w-full">
                      <span className="sm:-ml-4 mt-2 w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center">
                        <svg viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" className="w-full h-full text-black dark:text-white">
                          <g id="SVGRepo_bgCarrier" strokeWidth={0}></g>
                          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                          <g id="SVGRepo_iconCarrier">
                            <path fillRule="evenodd" clipRule="evenodd" d="M17.817 16.063V14.721C17.817 14.3887 17.949 14.07 18.184 13.835L19.133 12.886C19.6223 12.3967 19.6223 11.6033 19.133 11.114L18.184 10.165C17.949 9.93001 17.817 9.61131 17.817 9.27899V7.93599C17.817 7.24398 17.256 6.68299 16.564 6.68299H15.221C14.8887 6.68299 14.57 6.55097 14.335 6.31599L13.386 5.36699C12.8967 4.87767 12.1033 4.87767 11.614 5.36699L10.665 6.31599C10.43 6.55097 10.1113 6.68299 9.77899 6.68299H8.43599C8.1035 6.68299 7.78464 6.81514 7.54963 7.05034C7.31462 7.28554 7.18273 7.6045 7.18299 7.93699V9.27899C7.18299 9.61131 7.05097 9.93001 6.81599 10.165L5.86699 11.114C5.37767 11.6033 5.37767 12.3967 5.86699 12.886L6.81599 13.835C7.05097 14.07 7.18299 14.3887 7.18299 14.721V16.063C7.18299 16.755 7.74398 17.316 8.43599 17.316H9.77899C10.1113 17.316 10.43 17.448 10.665 17.683L11.614 18.632C12.1033 19.1213 12.8967 19.1213 13.386 18.632L14.335 17.683C14.57 17.448 14.8887 17.316 15.221 17.316H16.563C16.8955 17.3163 17.2144 17.1844 17.4496 16.9493C17.6848 16.7143 17.817 16.3955 17.817 16.063Z" stroke="#ffffff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"></path>
                            <path fillRule="evenodd" clipRule="evenodd" d="M9.78202 10.641C9.50715 10.3662 9.42492 9.95286 9.57366 9.59375C9.7224 9.23464 10.0728 9.00049 10.4615 9.00049C10.8502 9.00049 11.2006 9.23464 11.3494 9.59375C11.4981 9.95286 11.4159 10.3662 11.141 10.641C10.7657 11.0163 10.1573 11.0163 9.78202 10.641Z" stroke="#ffffff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"></path>
                            <path fillRule="evenodd" clipRule="evenodd" d="M13.859 14.718C13.5841 14.4431 13.5019 14.0298 13.6506 13.6707C13.7994 13.3115 14.1498 13.0774 14.5385 13.0774C14.9272 13.0774 15.2776 13.3115 15.4263 13.6707C15.5751 14.0298 15.4928 14.4431 15.218 14.718C14.8427 15.0932 14.2343 15.0932 13.859 14.718Z" stroke="#ffffff" strokeWidth={1.5} strokeLinecap="round"></path>
                            <path d="M15.218 9.28101L9.78101 14.719" stroke="#ffffff" strokeWidth={1.5} strokeLinecap="round"></path>
                          </g>
                        </svg>
                      </span>
                      <h3 className="text-xl mt-2 sm:text-4xl sm:font-extrabold font-bold text-black dark:text-white text-center sm:text-left w-full">{card.title}</h3>
                    </div>
                    <p className="hidden sm:block text-base sm:text-xl text-black dark:text-white max-w-xl break-words whitespace-pre-line">{card.description}</p>
                  </div>
                  {card.image && (
                    <div className="flex flex-col items-center justify-center sm:w-auto mx-auto">
                      <img src={card.image} alt={card.title} className="rounded w-80 h-44 object-cover sm:w-64 sm:h-36" />
                      <Link href={card.route}>
                      <span className="w-80 sm:w-56 mt-2 px-2 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded shadow transition block text-center text-xl cursor-pointer mx-auto">View Now</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : null
          ))}
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        {cards.map((_, idx) => (
          <span
            key={idx}
            className={`w-4 h-4 rounded-full ${current === idx + 1 ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-700"}`}
          />
        ))}
      </div>
    </div>
  );
}
