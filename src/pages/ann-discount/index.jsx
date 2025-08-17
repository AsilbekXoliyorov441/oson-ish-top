import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import DeleteDiscountModal from "./components/DeleteDiscountModal";
import AddEditDiscountModal from "./components/AddEditDiscount";
import AnnouncementDiscountTable from "./components/TableDiscount";
import { FaSync } from "react-icons/fa";
import { FaWifi } from "react-icons/fa6";

const fetchAnnTypes = async () => {
  const res = await axiosInstance.get("/ann-types/read");
  return res.data.data.sort((a, b) => a.id - b.id);
};

const fetchAnnDiscounts = async ({ queryKey }) => {
  const [_key, { page, size, annTypesId }] = queryKey;
  const res = await axiosInstance.get("/ann-discounts/read", {
    params: { page, size, annTypesId: annTypesId || undefined },
  });
  return res.data.data;
};

const AnnouncementDiscount = () => {
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [annTypesId, setAnnTypesId] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    annTypesId: 0,
    fixedDay: "",
    discount: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [loadingId, setLoadingId] = useState(null); // faqat bitta qatorda loader

  const queryClient = useQueryClient();

  const { data: annTypes = [] } = useQuery({
    queryKey: ["annTypes"],
    queryFn: fetchAnnTypes,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["annDiscounts", { page, size, annTypesId }],
    queryFn: fetchAnnDiscounts,
    keepPreviousData: true,
  });

  const discounts = data?.content || [];
  const totalPages = data?.totalPages || 0;

  const createMutation = useMutation({
    mutationFn: (newData) => {
      setLoadingId("new");
      return axiosInstance.post("/ann-discounts/create", newData);
    },
    onSuccess: (res) => {
      toast.success("Chegirma qo‘shildi");
      queryClient.setQueryData(
        ["annDiscounts", { page, size, annTypesId }],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            content: [res.data.data, ...oldData.content],
          };
        }
      );
      setModalOpen(false);
      setLoadingId(null);
    },
    onError: () => {
      toast.error("Qo‘shishda xatolik!");
      setLoadingId(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updateData) => {
      setLoadingId(updateData.id);
      return axiosInstance.put(
        `/ann-discounts/update/${updateData.id}`,
        updateData
      );
    },
    onSuccess: () => {
      toast.success("Chegirma tahrirlandi");
      queryClient.invalidateQueries(["annDiscounts"]);
      setModalOpen(false);
      setLoadingId(null);
    },
    onError: () => {
      toast.error("Tahrirlashda xatolik!");
      setLoadingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      setLoadingId(id);
      return axiosInstance.delete(`/ann-discounts/delete/${id}`);
    },
    onSuccess: () => {
      toast.success("Chegirma o‘chirildi");
      queryClient.invalidateQueries(["annDiscounts"]);
      setDeleteModalOpen(false);
      setLoadingId(null);
    },
    onError: () => {
      toast.error("O‘chirishda xatolik!");
      setLoadingId(null);
    },
  });

  const openAddModal = () => {
    setFormData({ id: null, annTypesId: 0, fixedDay: "", discount: "" });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setFormData({
      id: item.id,
      annTypesId: item.annTypesId,
      fixedDay: item.fixedDay.toString(),
      discount: item.discount.toString(),
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const payload = {
      annTypesId: Number(formData.annTypesId),
      fixedDay: Number(formData.fixedDay),
      discount: Number(formData.discount),
    };
    if (formData.id) {
      updateMutation.mutate({ id: formData.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate(deleteId);
  };

  const modalRef = useRef();
  const deleteModalRef = useRef();

  const handleBackdropClick = (e, ref, closeFn) => {
    if (ref.current && !ref.current.contains(e.target)) {
      closeFn(false);
    }
  };

  const typeColors = {
    1: "bg-blue-100 text-blue-800",
    2: "bg-green-100 text-green-800",
    3: "bg-yellow-100 text-yellow-800",
    default: "bg-gray-100 text-gray-800",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }
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
    <div className="p-4 bg-white rounded-xl shadow-md">
      {/* Filter va tugma */}
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">E’lon chegirmalari</h2>
        <div className="flex items-start gap-[10px]">
          <select
            value={annTypesId}
            onChange={(e) => {
              setAnnTypesId(Number(e.target.value));
              setPage(1);
            }}
            className="border-none outline-none shadow-sm bg-white px-3 py-2 rounded mb-4 w-full sm:w-64 border cursor-pointer"
          >
            <option value={0}>Barcha turlar</option>
            {annTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.nameUz}
              </option>
            ))}
          </select>
          <button
            onClick={openAddModal}
            className="bg-blue-500 text-white max-w-[500px] sm:w-auto w-full cursor-pointer px-5 py-2 rounded-lg hover:bg-blue-600 active:scale-95 transition transform shadow-md"
          >
            Chegirma qo‘shish
          </button>
        </div>
      </div>

      <AnnouncementDiscountTable
        discounts={discounts}
        annTypes={annTypes}
        page={page}
        size={size}
        loadingId={loadingId}
        edit={<FiEdit size={20}/>}
        delate={<RiDeleteBin6Line size={20} />}
        onEdit={openEditModal}
        onDelete={(id) => {
          setDeleteId(id);
          setDeleteModalOpen(true);
        }}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-4 items-center">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded disabled:opacity-50 border cursor-pointer"
          >
            <GrFormPreviousLink />
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded disabled:opacity-50 border cursor-pointer"
          >
            <GrFormNextLink />
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <AddEditDiscountModal
          annTypes={annTypes}
          formData={formData}
          setFormData={setFormData}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {deleteModalOpen && (
        <DeleteDiscountModal
          item={discounts.find((d) => d.id === deleteId)}
          typeName={
            annTypes.find(
              (t) =>
                t.id === discounts.find((d) => d.id === deleteId)?.annTypesId
            )?.nameUz || "Noma'lum"
          }
          onClose={() => setDeleteModalOpen(false)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AnnouncementDiscount;
