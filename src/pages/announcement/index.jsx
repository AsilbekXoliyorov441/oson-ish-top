import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiEdit } from "react-icons/fi";

import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import AnnTypeFormModal from "./components/edit-modal";
import { FaWifi } from "react-icons/fa6";
import { FaSync } from "react-icons/fa";

// 🔹 Custom hooks
const useAnnTypes = () =>
  useQuery({
    queryKey: ["annTypes"],
    queryFn: async () => {
      const res = await axiosInstance.get("/ann-types/read");
      return res.data.data || res.data;
    },
    keepPreviousData: true,
  });

const useUpdateAnnType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updatedData }) =>
      axiosInstance.put(`/ann-types/update/${id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annTypes"] });
      toast.success("Announcement type muvaffaqiyatli yangilandi!");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Announcement type yangilashda xatolik!"
      );
    },
  });
};

// 🔹 Component
const AnnouncementTypes = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingAnnType, setEditingAnnType] = useState(null);
  const [formData, setFormData] = useState({
    descriptionUz: "",
    descriptionEn: "",
    descriptionRu: "",
    pricePerDay: 0,
  });

  const { data: annTypes = [], isLoading, isError, error , refetch } = useAnnTypes();
  const { mutate: updateAnnType, isLoading: isUpdating } = useUpdateAnnType();

  const resetModal = () => {
    setFormData({
      descriptionUz: "",
      descriptionEn: "",
      descriptionRu: "",
      pricePerDay: 0,
    });
    setEditingAnnType(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "pricePerDay" ? Number(value) : value,
    }));
  };

  const handleEdit = (annType) => {
    setFormData({
      descriptionUz: annType.descriptionUz,
      descriptionEn: annType.descriptionEn,
      descriptionRu: annType.descriptionRu,
      pricePerDay: annType.pricePerDay || 0,
    });
    setEditingAnnType(annType);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editingAnnType) return;
    updateAnnType({ id: editingAnnType.id, updatedData: formData });
    resetModal();
  };

  if (isLoading) return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-6 h-[80vh]">
          <div className="bg-red-100 text-red-600 p-6 rounded-full shadow-lg mb-4">
            <FaWifi size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Xatolik yuz berdi
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Iltimos, birozdan so‘ng qayta urinib ko‘ring.
          </p>
          <button
            onClick={() => refetch()} // qayta so‘rov yuborish uchun (React Query bo‘lsa)
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-xl shadow hover:bg-red-600 transition"
          >
            <FaSync className="animate-spin-slow" />
            Qayta urinib ko‘rish
          </button>
        </div>
      );
    }
  return (
    <div className="bg-white overflow-hidden rounded-xl p-4">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold">E'lon turlari</h2>
      </div>

      {/* Table */}
      <div className="overflow-auto max-h-[550px] md:max-h-[60vh]">
        <table className="min-w-full table-auto text-sm whitespace-nowrap">
          <thead className="sticky top-0 bg-white z-10 font-nunito border-b border-dashed border-gray-300">
            <tr className="text-gray-600 text-left text-sm">
              <th className="px-2 py-2">#</th>
              <th className="px-2 py-2">E'lon turi (UZ)</th>
              <th className="px-2 py-2">E'lon turi (EN)</th>
              <th className="px-2 py-2">E'lon turi (RU)</th>
              <th className="px-2 py-2">Bir kunlik narxi</th>
              <th className="px-2 py-2">Boshqarish</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {annTypes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Ma'lumot topilmadi
                </td>
              </tr>
            ) : (
              annTypes.map((annType, idx) => (
                <tr
                  key={annType.id || idx}
                  className="hover:bg-gray-200 text-[12px] md:text-[14px]"
                >
                  <td className="px-2 py-2">{idx + 1}</td>
                  <td className="px-2 py-2">{annType.descriptionUz}</td>
                  <td className="px-2 py-2">{annType.descriptionEn}</td>
                  <td className="px-2 py-2">{annType.descriptionRu}</td>
                  <td className="px-2 py-2">{annType.pricePerDay}</td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => handleEdit(annType)}
                      className="text-blue-500  hover:text-blue-700  hover:drop-shadow-xl drop-shadow-blue-700 transition-colors duration-300 cursor-pointer"
                    >
                      <FiEdit size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnnTypeFormModal
        show={showModal}
        onClose={resetModal}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
        editingAnnType={editingAnnType}
      />
    </div>
  );
};

export default AnnouncementTypes;
