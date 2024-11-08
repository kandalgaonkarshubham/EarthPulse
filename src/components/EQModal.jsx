/* eslint-disable react/prop-types */
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function EQModal({
  selectedEarthquake,
  isModalOpen,
  handleModalChange,
}) {
  return (
    <AlertDialog open={isModalOpen} onOpenChange={handleModalChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="underline">
            {selectedEarthquake.properties.title}
          </AlertDialogTitle>
          <div className="flex flex-col items-start justify-center p-1">
            <div className="space-y-2">
              <p>
                <span className="font-bold">Event Code:</span> mag (magType)
              </p>
              <p>
                <span className="font-bold">Event IDs:</span> mag (magType)
              </p>
              <p>
                <span className="font-bold">Magnitude:</span> mag (magType)
              </p>
              <p>
                <span className="font-bold">Location:</span> place
              </p>
              <p>
                <span className="font-bold">Coordinates:</span>{" "}
                latitude.toFixed(2), longitude.toFixed(2)
              </p>
              <p>
                <span className="font-bold">Depth:</span> depth km
              </p>
              <p>
                <span className="font-bold">Type:</span> type
              </p>
              <p>
                <span className="font-bold">Significance:</span> sig
              </p>
              <p>
                <span className="font-bold">Tsunami Warning:</span> tsunami ?
                Yes : No
              </p>
              <p>
                <span className="font-bold">Event Time:</span> formattedTime
              </p>
              <p className="uppercase">
                <span className="font-bold">Sources:</span> Array
              </p>
              <p className="uppercase">
                <span className="font-bold">Network:</span> Array
              </p>
              <p className="text-blue-600 hover:underline">
                <a target="_blank" rel="noopener noreferrer">
                  More Details
                </a>
              </p>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleModalChange(false)}>
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
