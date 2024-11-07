import { LocateIcon } from "lucide-react";

export default function Footer({ toggleZoom }) {
  return (
    <div className="absolute bottom-0 flex flex-col justify-center bg-white rounded-lg border m-2 mb-6 z-10">
      <button
        className="p-2 text-neutral-700"
        onClick={() => toggleZoom(false)}
      >
        <LocateIcon />
      </button>
    </div>
  );
}
