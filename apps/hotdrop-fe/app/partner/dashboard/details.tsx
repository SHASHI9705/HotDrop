"use client";
import { useState } from "react";

export default function PartnerDetails({
  shopName,
  setShopName,
  shopCategory,
  setShopCategory,
  shopImage,
  setShopImage,
  imageFile,
  setImageFile,
  loading,
  saving,
  handleProfileSave,
  handleShopImageSave
}: {
  shopName: string;
  setShopName: (v: string) => void;
  shopCategory: string;
  setShopCategory: (v: string) => void;
  shopImage: string;
  setShopImage: (v: string) => void;
  imageFile: File | null;
  setImageFile: (f: File | null) => void;
  loading: boolean;
  saving: boolean;
  handleProfileSave: () => void;
  handleShopImageSave: () => void;
}) {
  const [profileSaving, setProfileSaving] = useState(false);
  const [imageSaving, setImageSaving] = useState(false);

  return (
    <div className="w-full max-w-4xl flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
      {/* Profile Update Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex-1 flex flex-col gap-2 border border-gray-200 min-h-[320px]">
        <div className="font-bold text-lg text-gray-700 mb-2">Profile Update</div>
        <input className="border rounded p-2 mb-2" placeholder="Shop Name" value={shopName} onChange={e => setShopName(e.target.value)} disabled={loading} />
        <select className="border rounded p-2 mb-2" value={shopCategory} onChange={e => setShopCategory(e.target.value)} disabled={loading}>
          <option value="food">Food</option>
          <option value="clothes">Clothes</option>
          <option value="electronics">Electronics</option>
          <option value="grocery">Grocery</option>
          <option value="other">Other</option>
        </select>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600 font-semibold w-fit" onClick={async () => {
          setProfileSaving(true);
          await handleProfileSave();
          setProfileSaving(false);
        }} disabled={loading || profileSaving}>
          {profileSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
      {/* Shop Image Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex-1 flex flex-col items-center border border-gray-200 min-h-[320px] justify-between">
        <div className="w-full flex flex-col items-center">
          <div className="font-bold text-lg text-gray-700 mb-2">Shop Image</div>
          <img src={shopImage} alt="Shop" className="w-32 h-32 rounded-full border-2 border-orange-400 object-cover mb-4" />
          <input type="file" accept="image/*" className="border rounded p-2 mb-2 bg-white" onChange={e => setImageFile(e.target.files?.[0] || null)} />
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 font-semibold w-fit mb-2" onClick={async () => {
          setImageSaving(true);
          await handleShopImageSave();
          setImageSaving(false);
        }} disabled={imageSaving}>
          {imageSaving ? "Saving..." : "Save image"}
        </button>
      </div>
    </div>
  );
}
