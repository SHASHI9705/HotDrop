import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-orange-50 border-t border-orange-200 mt-16 py-12 px-4 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        {/* Brand and tagline */}
        <div className="flex-1 mb-8 md:mb-0">
          <div className="text-2xl font-extrabold text-orange-600 mb-2">HotDrop</div>
          <div className="text-gray-600 mb-4">Order ahead. Skip the line. Grab on time!</div>
          <div className="text-gray-400 text-xs">&copy; {new Date().getFullYear()} HotDrop. All rights reserved.</div>
        </div>
        {/* Footer columns */}
        <div className="flex-[2] grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Explore with us */}
          <div>
            <div className="font-semibold text-orange-500 mb-3">Explore with us</div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><a href="/orders" className="hover:text-orange-600 transition">Orders</a></li>
              <li><a href="/food" className="hover:text-orange-600 transition">Menu</a></li>
              <li><a href="/partner" className="hover:text-orange-600 transition">Partner</a></li>
              <li><a href="/" className="hover:text-orange-600 transition">Home</a></li>
            </ul>
          </div>
          {/* Contact Us */}
          <div>
            <div className="font-semibold text-orange-500 mb-3">Contact Us</div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><a href="mailto:support@hotdrop.com" className="hover:text-orange-600 transition">support@hotdrop.com</a></li>
              <li><a href="tel:+1234567890" className="hover:text-orange-600 transition">+1 234 567 890</a></li>
              <li><a href="#" className="hover:text-orange-600 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-orange-600 transition">Feedback</a></li>
            </ul>
          </div>
          {/* More from us */}
          <div>
            <div className="font-semibold text-orange-500 mb-3">More from us</div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><a href="#" className="hover:text-orange-600 transition">Info</a></li>
              <li><a href="#" className="hover:text-orange-600 transition">Terms & Policy</a></li>
              <li><a href="#" className="hover:text-orange-600 transition">Cookies</a></li>
              <li><a href="#" className="hover:text-orange-600 transition">Careers</a></li>
            </ul>
          </div>
          {/* Social Media */}
          <div>
            <div className="font-semibold text-orange-500 mb-3">Social Media</div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition">Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition">Instagram</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition">Facebook</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition">LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
