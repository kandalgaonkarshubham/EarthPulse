import { useState } from "react";
import FilterLayout from "@/components/v2/FilterLayout";
import FilterCornersUI from "@/components/v2/FilterCornersUI";

export default function App() {
  const [selectedTime, setSelectedTime] = useState("9 am");
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [search, setSearch] = useState("");

  return (
    <div className="relative w-full h-screen overflow-hidden bg-neutral-900">
      <FilterLayout
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      <FilterCornersUI
        search={search}
        setSearch={setSearch}
        selectedTime={selectedTime}
        selectedMonth={selectedMonth}
      />
    </div>
  );
}
