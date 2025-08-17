import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import JobTypeFormModal from "./components/JobTypeFormModal";
import DeleteModal from "./components/DeleteModal";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaWifi } from "react-icons/fa6";
import { FaSync } from "react-icons/fa";

// API funksiyalar
const getJobTypes = async () => {
  const res = await axiosInstance.get("/ann-job-types/read");
  return res.data.data || res.data;
};

const createJobType = (payload) =>
  axiosInstance.post("/ann-job-types/create", payload).then((res) => res.data);

const updateJobType = ({ id, payload }) =>
  axiosInstance
    .put(`/ann-job-types/update/${id}`, payload)
    .then((res) => res.data);

const deleteJobType = (id) =>
  axiosInstance.delete(`/ann-job-types/delete/${id}`).then((res) => res.data);

const JobTypesPage = () => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    nameUz: "",
    nameEn: "",
    nameRu: "",
    isThereTrialPeriod: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch
  const {
    data: jobTypes = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["jobTypes"],
    queryFn: getJobTypes,
    keepPreviousData: true,
  });

  // Create
  const { mutate: createMutate, isLoading: isSaving } = useMutation({
    mutationFn: createJobType,
    onSuccess: () => {
      queryClient.invalidateQueries(["jobTypes"]);
      resetForm();
      toast.success("Ish turi muvaffaqiyatli qo‘shildi");
    },
    onError: () => toast.error("Ish turini qo‘shishda xatolik"),
  });

  // Update
  const { mutate: updateMutate, isLoading: isUpdating } = useMutation({
    mutationFn: updateJobType,
    onSuccess: () => {
      queryClient.invalidateQueries(["jobTypes"]);
      resetForm();
      toast.success("Ish turi muvaffaqiyatli yangilandi");
    },
    onError: () => toast.error("Ish turini yangilashda xatolik"),
  });

  // Delete
  const { mutate: deleteMutate, isLoading: isDeleting } = useMutation({
    mutationFn: deleteJobType,
    onSuccess: () => {
      queryClient.invalidateQueries(["jobTypes"]);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      toast.success("Ish turi o‘chirildi");
    },
    onError: () => toast.error("O‘chirishda xatolik"),
  });

  // Reset form
  const resetForm = () => {
    setForm({
      nameUz: "",
      nameEn: "",
      nameRu: "",
      isThereTrialPeriod: false,
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  // Handlers
  const handleEdit = (jobType) => {
    setEditingId(jobType.id);
    setForm({
      nameUz: jobType.nameUz,
      nameEn: jobType.nameEn,
      nameRu: jobType.nameRu,
      isThereTrialPeriod: jobType.isThereTrialPeriod,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutate({ id: editingId, payload: form });
    } else {
      createMutate(form);
    }
  };

  return (
    <div className="bg-white overflow-hidden rounded-xl p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Ish turlari</h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-500 cursor-pointer text-white px-5 py-2 rounded-lg hover:bg-blue-600"
        >
          Ish turi qo‘shish
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-32">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : isError ? (
        
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
           
      ) : (
        <div className="overflow-auto max-h-[550px] md:max-h-[60vh]">
          <table className="min-w-full table-auto text-sm whitespace-nowrap">
            <thead className="sticky top-0 bg-white z-10 font-nunito border-b border-dashed border-gray-300">
              <tr className="text-gray-600 text-left text-sm">
                <th className="px-2 py-2">No</th>
                <th className="px-2 py-2">Nomi (Uz)</th>
                <th className="px-2 py-2">Nomi (Ru)</th>
                <th className="px-2 py-2">Nomi (En)</th>
                <th className="px-2 py-2">Sinov muddati</th>
                <th className="px-2 py-2 text-center">Boshqarish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobTypes.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-4 text-gray-500 font-medium cursor-default"
                  >
                    Ma'lumot topilmadi
                  </td>
                </tr>
              ) : (
                jobTypes.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-200 text-[12px] md:text-[14px]"
                  >
                    <td className="px-2 py-2">{idx + 1}</td>
                    <td className="px-2 py-2">{item.nameUz}</td>
                    <td className="px-2 py-2">{item.nameRu}</td>
                    <td className="px-2 py-2">{item.nameEn}</td>
                    <td className="px-2 py-2">
                      {item.isThereTrialPeriod ? "Ha" : "Yo‘q"}
                    </td>
                    <td className="px-2 py-2 flex gap-3 justify-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-500 hover:text-blue-700 hover:drop-shadow-xl transition-colors duration-300 cursor-pointer"
                        title="Tahrirlash"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 hover:drop-shadow-xl transition-colors duration-300 cursor-pointer"
                        title="O‘chirish"
                      >
                        <RiDeleteBin6Line size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <JobTypeFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        loading={isSaving || isUpdating}
        isEdit={!!editingId}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutate(deleteId)}
        loading={isDeleting}
      />
    </div>
  );
};

export default JobTypesPage;
