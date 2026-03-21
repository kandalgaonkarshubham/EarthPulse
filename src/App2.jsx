import { useState } from "react";
import FilterMenu from "@/components/FilterMenu";
import FilterCornersUI from "@/components/FilterCornersUI";

export default function App() {
  const [selectedTime, setSelectedTime] = useState("9 am");
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [search, setSearch] = useState("");

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <FilterMenu
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
