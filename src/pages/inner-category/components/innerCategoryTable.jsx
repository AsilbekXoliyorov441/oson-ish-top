import React from 'react'
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';

const InnerCategoryTable = ({askDelete , openEditModal , items , page , size}) => {
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
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="text-center py-4 text-gray-500 font-medium cursor-default"
              >
                Ma'lumot topilmadi
              </td>
            </tr>
          ) : (
            items.map((category, idx) => (
              <tr
                key={category.id}
                className="hover:bg-gray-200 text-[12px] md:text-[14px]"
              >
                <td className="px-2 py-2">{(page - 1) * size + idx + 1}</td>
                <td className="px-2 py-2">{category.name}</td>
                <td className="px-2 py-2">{category.nameUz}</td>
                <td className="px-2 py-2">{category.nameRu}</td>
                <td className="px-2 py-2">{category.nameEn}</td>
                <td className="px-2 py-2 flex gap-3 justify-center">
                  <button
                    onClick={() => openEditModal(category)}
                    className="text-blue-500 hover:text-blue-700 hover:drop-shadow-xl transition-colors duration-300 cursor-pointer"
                    title="Tahrirlash"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => askDelete(category.id)}
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
  );
}

export default InnerCategoryTable