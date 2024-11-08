import { LocateIcon } from "lucide-react";

export default function Footer({ recenter }) {
  return (
    <div className="absolute bottom-0 flex flex-col justify-center bg-secondary/10 backdrop-blur-lg rounded-lg border border-secondary m-2 mb-6 z-10">
      <button className="p-2 text-white" onClick={recenter}>
        <LocateIcon />
      </button>
    </div>
  );
}
