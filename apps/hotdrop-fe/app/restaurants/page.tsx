"use client"


import PhoneFooter from "../../components/PhoneFooter";
export default function RestaurantsPage() {
  return (
    <>
      {/* ...existing restaurants page content... */}
      <div className="md:hidden">
        <PhoneFooter />
      </div>
    </>
  );
}
