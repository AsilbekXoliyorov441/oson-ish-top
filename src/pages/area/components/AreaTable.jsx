import React from "react";

const AreaTable = ({ areas, regions, handleEdit, setDeleteConfirm , edit, delate}) => {
  return (
    <div className="overflow-auto max-h-[550px] md:max-h-[70vh]">
      <table className="min-w-full table-auto text-sm whitespace-nowrap">
        <thead className="sticky top-0 bg-white z-10 font-nunito border-b border-dashed border-gray-300">
          <tr>
            <th
              colSpan="6"
              className="text-right px-4 pt-2 font-normal text-sm text-gray-800 underline"
            >
              Tumanlar soni: ({areas?.length})
            </th>
          </tr>
          <tr className="text-gray-600 text-left text-sm">
            <th className="px-2 py-2">No</th>
            <th className="px-2 py-2">Tuman nomi (UZ)</th>
            <th className="px-2 py-2">Tuman nomi (EN)</th>
            <th className="px-2 py-2">Tuman nomi (RU)</th>
            <th className="px-2 py-2">Viloyat nomi</th>
            <th className="px-2 py-2">Boshqarish</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {areas.length > 0 ? (
            areas.map((area, idx) => (
              <tr
                key={area.id || area.nameUz}
                className="hover:bg-gray-200 text-[12px] md:text-[14px]"
              >
                <td className="px-2 py-2">{idx + 1}</td>
                <td className="px-2 py-2">{area.nameUz}</td>
                <td className="px-2 py-2">{area.nameEn}</td>
                <td className="px-2 py-2">{area.nameRu}</td>
                <td className="px-2 py-2">
                  {regions.find((reg) => reg.id === area.regionsId)?.nameUz ||
                    "Noma'lum"}
                </td>
                <td className="px-2 py-2 flex gap-3">
                  <button
                    onClick={() => handleEdit(area)}
                    className="text-blue-500  hover:text-blue-700  hover:drop-shadow-xl drop-shadow-blue-700 transition-colors duration-500 cursor-pointer"
                  >
                    {edit}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(area.id)}
                    className="text-red-500  hover:text-red-700  hover:drop-shadow-xl drop-shadow-red-700 transition-colors duration-500 cursor-pointer"
                  >
                    {delate}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="text-center py-4 text-gray-500 font-medium cursor-default"
              >
                Ma'lumot topilmadi
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AreaTable;
