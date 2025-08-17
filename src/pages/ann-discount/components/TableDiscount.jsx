import React from "react";

const typeColors = {
  1: "bg-blue-100 text-blue-800",
  2: "bg-green-100 text-green-800",
  3: "bg-yellow-100 text-yellow-800",
  default: "bg-gray-100 text-gray-800",
};

const AnnouncementDiscountTable = ({
  discounts,
  annTypes,
  page,
  size,
  loadingId,
  edit,
  delate,
  onEdit,
  onDelete,

}) => {
  return (
    <div className="overflow-auto max-h-[550px]">
      <table className="min-w-full table-auto text-sm border-separate border-spacing-y-1">
        <thead className="sticky top-0 bg-white">
          <tr className="bg-gray-100">
            <th className="p-3 text-left">No</th>
            <th className="p-3 text-left">Turi</th>
            <th className="p-3 text-left">Kuni</th>
            <th className="p-3 text-left">Chegirma (%)</th>
            <th className="p-3 text-left">Boshqarish</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((item, idx) => {
            const type = annTypes.find((t) => t.id === item.annTypesId);
            const colorClass =
              typeColors[item.annTypesId] || typeColors.default;

            return (
              <tr key={item.id} className="hover:bg-gray-50 rounded-lg">
                <td className="p-3">{idx + 1 + (page - 1) * size}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded ${colorClass}`}>
                    {type?.nameUz || "Noma'lum"}
                  </span>
                </td>
                <td className="p-3">{item.fixedDay} kun</td>
                <td className="p-3">
                  {loadingId === item.id ? (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    `${item.discount}%`
                  )}
                </td>
                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-500  hover:text-blue-700  hover:drop-shadow-xl drop-shadow-blue-700 transition-colors duration-300 cursor-pointer"
                  >
                    {edit}
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-500  hover:text-red-700  hover:drop-shadow-xl drop-shadow-red-700 transition-colors duration-300 cursor-pointer"
                  >
                    {delate}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AnnouncementDiscountTable;
