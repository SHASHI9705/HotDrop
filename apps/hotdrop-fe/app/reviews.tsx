import React from "react";

const reviews = [
  {
    name: "Amit Sharma",
    rating: 5,
    text: "Super fast service and delicious food! HotDrop is my go-to for quick meals.",
  },
  {
    name: "Priya Singh",
    rating: 4,
    text: "Loved the variety and the easy ordering process. Highly recommend!",
  },
  {
    name: "Rahul Verma",
    rating: 5,
    text: "Great experience, food was ready on time and still hot!",
  },
  {
    name: "Sneha Patel",
    rating: 4,
    text: "The UI is beautiful and the food options are amazing. Will order again!",
  },
  {
    name: "Vikram Joshi",
    rating: 5,
    text: "Partnered with HotDrop for my shop, and it’s been fantastic for business.",
  },
  {
    name: "Riya Kapoor",
    rating: 5,
    text: "Easy to use, great food, and no waiting in line. Perfect!",
  },
  {
    name: "Saurabh Mehta",
    rating: 4,
    text: "Quick delivery and tasty food. The app is super smooth.",
  },
  {
    name: "Anjali Desai",
    rating: 5,
    text: "Customer support is very responsive. Love the experience!",
  },
  {
    name: "Karan Malhotra",
    rating: 4,
    text: "Ordering for my team was a breeze. Everyone loved it!",
  },
];

export default function ReviewsSection() {
  return (
    <section className="my-16 w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold text-orange-600 mb-8 text-left pl-2">What Our Customers Say</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {reviews.map((review, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start border border-orange-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center mb-2">
              <span className="font-bold text-gray-800 text-lg mr-2">{review.name}</span>
              <span className="flex items-center">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                ))}
              </span>
            </div>
            <p className="text-gray-700 text-base mt-2">{review.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
