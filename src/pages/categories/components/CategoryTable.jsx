import React from "react";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const CategoryTable = ({ categories, handleEdit, handleDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-auto max-h-[550px] md:max-h-[60vh]">
      <table className="min-w-full table-auto text-sm whitespace-nowrap">
        <thead className="sticky top-0 bg-white z-10 font-nunito border-b border-dashed border-gray-300">
          <tr className="text-gray-600 text-left text-sm">
            <th className="px-2 py-2">No</th>
            <th className="px-2 py-2">Nomi</th>
            <th className="px-2 py-2">Sarlavhasi (Uz)</th>
            <th className="px-2 py-2">Sarlavhasi (Ru)</th>
            <th className="px-2 py-2">Sarlavhasi (En)</th>
            <th className="px-2 py-2 text-center">Boshqarish</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {categories.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="text-center py-4 text-gray-500 font-medium cursor-default"
              >
                Ma'lumot topilmadi
              </td>
            </tr>
          ) : (
            categories.map((category, idx) => (
              <tr
                key={category.id || idx}
                onClick={() => navigate(`/categories/${category.id}`)}
                className="hover:bg-gray-200 text-[12px] md:text-[14px] cursor-pointer"
              >
                <td className="px-2 py-2">{idx + 1}</td>
                <td className="px-2 py-2">{category.name}</td>
                <td className="px-2 py-2">{category.nameUz}</td>
                <td className="px-2 py-2">{category.nameRu}</td>
                <td className="px-2 py-2">{category.nameEn}</td>
                <td
                  className="px-2 py-2 flex gap-3 justify-center"
                  onClick={(e) => e.stopPropagation()} // Edit/Delete bosilganda sahifa o‘zgarmasin
                >
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-500 hover:text-blue-700 hover:drop-shadow-xl drop-shadow-blue-700 transition-colors duration-300 cursor-pointer"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-500 hover:text-red-700 hover:drop-shadow-xl drop-shadow-red-700 transition-colors duration-300 cursor-pointer"
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
  );
};

export default CategoryTable;
