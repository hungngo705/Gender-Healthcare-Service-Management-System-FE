// filepath: /Users/hungngokhanh/Desktop/Term 5/SWP/Gender-Healthcare-Service-Management-System-FE/src/components/booking/ConsultantList.jsx
import React from "react";
import ConsultantCard from "./ConsultantCard";

const ConsultantList = ({ consultants, selectedConsultant, onSelectConsultant }) => {
  return (
    <div className="border-r border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Chọn Tư Vấn Viên</h2>
      </div>
      <ul className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
        {consultants.map((consultant) => (
          <ConsultantCard
            key={consultant.id}
            consultant={consultant}
            isSelected={selectedConsultant?.id === consultant.id}
            onSelect={onSelectConsultant}
          />
        ))}
      </ul>
    </div>
  );
};

export default ConsultantList;