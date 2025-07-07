"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PartnerDetails from "./details";
import NotificationSection from "./notification";
import OrderListSection from "./orderlist";
import ShopReviewsSection from "./shopreviews";
import EarningSection from "./earning";

function ShopNameSubheading() {
  const [shopname, setShopname] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const partner = localStorage.getItem("hotdrop_partner");
      if (partner) {
        try {
          setShopname(JSON.parse(partner).shopname || "");
        } catch {}
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("hotdrop_partner");
    router.push("/");
  };

  if (!shopname) return null;
  return (
    <div className="relative ml-4">
      <button
        className="text-lg md:text-xl font-bold text-black focus:outline-none"
        onClick={() => setShowDropdown((v) => !v)}
      >
        {shopname}
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-50">
          <button
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function PartnerDashboardNavbar() {
  const router = useRouter();
  const [shopName, setShopName] = useState("");
  const [shopCategory, setShopCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shopImage, setShopImage] = useState<string>("/profile.svg");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);

  // Fetch notification count (pending orders) for badge
  useEffect(() => {
    const partner = localStorage.getItem("hotdrop_partner");
    if (!partner) {
      setNotificationCount(0);
      return;
    }
    const { id, shopname } = JSON.parse(partner);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/orders?partnerId=${encodeURIComponent(id)}`)
      .then(res => res.json())
      .then(data => {
        const pending = (data.orders || []).filter((order: any) => order.shopName === shopname && order.status === false);
        setNotificationCount(pending.length);
      });
  }, []);

  useEffect(() => {
    const partner = localStorage.getItem("hotdrop_partner");
    if (partner) {
      const { id } = JSON.parse(partner);
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partner?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          // Defensive: check for data.partner and shopname
          if (data && data.partner && data.partner.shopname) {
            setShopName(data.partner.shopname);
          } else {
            setShopName("");
          }
          if (data && data.partner && data.partner.shopcategory) {
            setShopCategory(data.partner.shopcategory);
          } else {
            setShopCategory("food");
          }
          if (data && data.partner && data.partner.shopimage && data.partner.shopimage.url) {
            setShopImage(data.partner.shopimage.url); // Always use the URL as-is
          } else {
            setShopImage("/profile.svg");
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleProfileSave = async () => {
    setSaving(true);
    const partner = localStorage.getItem("hotdrop_partner");
    if (!partner) return;
    const { id } = JSON.parse(partner);
    try {
      let imageUrl = shopImage;
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("partnerId", id);
        const resImg = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partner/shopimage`, {
          method: "POST",
          body: formData
        });
        const dataImg = await resImg.json();
        if (resImg.ok && dataImg.url) {
          imageUrl = dataImg.url;
          setShopImage(imageUrl);
        } else {
          alert(dataImg.error || "Failed to upload image");
        }
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partner/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, shopname: shopName, shopcategory: shopCategory })
      });
      const data = await res.json();
      if (res.ok && data.partner) {
        // Optionally update localStorage
        localStorage.setItem("hotdrop_partner", JSON.stringify({ ...JSON.parse(partner), shopname: data.partner.shopname, shopcategory: data.partner.shopcategory }));
        alert("Profile updated successfully!");
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (e) {
      alert("Failed to update profile");
    }
    setSaving(false);
  };

  const handleShopImageSave = async () => {
    if (!imageFile) return alert('Please select an image');
    setSaving(true);
    const partner = localStorage.getItem("hotdrop_partner");
    if (!partner) return;
    const { id } = JSON.parse(partner);
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("partnerId", id);
    const resImg = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partner/shopimage`, {
      method: "POST",
      body: formData
    });
    const dataImg = await resImg.json();
    if (resImg.ok && dataImg.url) {
      // Fetch the latest partner data to get the correct image URL
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partner?id=${id}`);
      const data = await res.json();
      if (data && data.partner && data.partner.shopimage && data.partner.shopimage.url) {
        setShopImage(data.partner.shopimage.url); // Always use the URL as-is
      }
      alert("Shop image updated!");
    } else {
      alert(dataImg.error || "Failed to upload image");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-2 p-6 bg-gradient-to-r from-white via-red-200 to-blue-50">
      <nav className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 py-6">
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 rounded"
          />
          <div className="text-3xl font-extrabold text-gray-800">HotDrop</div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto mt-2 md:mt-0 justify-center">
          <button
            className="relative bg-orange-400 text-white px-6 py-2 rounded-full hover:bg-orange-500 transition-colors duration-300 text-lg font-semibold w-full md:w-auto shadow-md border border-orange-500"
            onClick={() => {
              const section = document.getElementById('notification-section');
              if (section) section.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Notification
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 border border-white">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto mt-2 md:mt-0 justify-end">
          <ShopNameSubheading />
          <button
            className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors duration-300 text-lg font-semibold w-full md:w-auto"
            onClick={() => router.push("/partner")}
          >
            Home
          </button>
        </div>
      </nav>
      {/* Profile Update + Shop Image Section (side by side, separate cards) */}
      <PartnerDetails
        shopName={shopName}
        setShopName={setShopName}
        shopCategory={shopCategory}
        setShopCategory={setShopCategory}
        shopImage={shopImage}
        setShopImage={setShopImage}
        imageFile={imageFile}
        setImageFile={setImageFile}
        loading={loading}
        saving={saving}
        handleProfileSave={handleProfileSave}
        handleShopImageSave={handleShopImageSave}
      />
      {/* Earning Summary Section */}
      <EarningSection />

      {/* Reviews Section */}
      <ShopReviewsSection />
      {/* Notification Section */}
      <NotificationSection />
      {/* Order List Section */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mt-8 mb-8">Order list</h1>
      <OrderListSection />
      <div className="w-full flex justify-center mt-12 mb-8">
        <button
          className="bg-red-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow hover:bg-red-600 transition-colors duration-300"
          onClick={() => {
            localStorage.removeItem("hotdrop_partner");
            router.push("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
