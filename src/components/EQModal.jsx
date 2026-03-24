/* eslint-disable react/prop-types */

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import InfoPopover from "./ui/InfoPopover";

export default function EQModal({ quake, isModalOpen, handleModalChange }) {
  function groupEarthquakeData(data) {
    return {
      identifiers: [
        {
          label: "Event Code",
          value: data.code,
          content: "Unique identifier for the earthquake.",
        },
        {
          label: "Network Code",
          value: data.net,
          content: "Code of the network that reported the earthquake.",
        },
        {
          label: "Event IDs",
          value: data.ids.split(",").filter(Boolean).join(","),
          content:
            "Identifiers of this earthquake in different seismic networks.",
        },
      ],
      locationInfo: [
        { label: "Location", value: data.place },
        {
          label: "Azimuthal Gap",
          value: data.gap,
          content:
            "The largest angle, in degrees, between seismic stations around the epicenter. Smaller gaps indicate better location accuracy.",
        },
        {
          label: "Minimum Distance to Station",
          value: data.dmin,
          content:
            "The minimum distance, in degrees, from the earthquake epicenter to the closest seismic station that recorded the event.",
        },
        {
          label: "Tsunami Warning",
          value: data.tsunami,
          content:
            "An indicator of whether the earthquake has tsunami potential, with 1 indicating potential and 0 indicating no potential.",
        },
      ],
      magnitude: [
        {
          label: "Magnitude",
          value: data.mag,
          content:
            "A measure of the earthquake's size or energy release, often represented on the Richter scale or moment magnitude scale & The type of magnitude calculation used, e.g., mb (Body-Wave Magnitude), which measures the strength of P-waves          (compressional waves).",
        },
        {
          label: "Significance",
          value: data.sig,
          content:
            "A computed significance value assessing the earthquake's potential impact based on magnitude, location, and population density.",
        },
        {
          label: "Root Mean Square of Residuals",
          value: data.rms,
          content:
            "RMS value of residuals in the travel times from seismic stations, indicating the fit of the location solution; lower RMS values indicate better model fit.",
        },
        {
          label: "Number of Stations Used",
          value: data.nst,
          content:
            "The total number of seismic stations that provided data used to determine the earthquake’s location and magnitude. Location Description (place): A description of the earthquake’s location relative to a well-known place or landmark.",
        },
      ],
      timestamps: [
        { label: "Event Time", value: new Date(data.time).toLocaleString() },
        {
          label: "Updated Time",
          value: new Date(data.updated).toLocaleString(),
        },
      ],
      details: [
        {
          label: "Review Status",
          value: data.status,
          content:
            "The status of the earthquake event analysis. 'Reviewed' indicates verification by a seismologist.",
        },
        {
          label: "Data Sources",
          value: data.sources
            .split(",")
            .filter(Boolean)
            .join(",")
            .toUpperCase(),
          content: "The seismic networks that provided data for the event.",
        },
        { label: "Event Page URL", value: data.url, url: true },
      ],
    };
  }

  const groupedData = groupEarthquakeData(quake.properties);

  const magnitudeColor = quake.properties.mag < 3 ? '#eed7a1' : 
                          quake.properties.mag < 5 ? '#84cdee' : 
                          quake.properties.mag < 7 ? '#ffbcda' : '#eb2d3a';

  return (
    <AlertDialog open={isModalOpen} onOpenChange={handleModalChange}>
      <AlertDialogContent className="eq-modal-container">
        <div className="eq-modal-backdrop" />
        <div className="eq-modal-content">
          {/* Header Section */}
          <AlertDialogHeader className="eq-modal-header">
            <div className="eq-modal-header-top">
              <div className="eq-modal-title-section">
                <AlertDialogTitle className="eq-modal-title">
                  {quake.properties.title}
                </AlertDialogTitle>
                <div className="eq-modal-meta">
                  <span className="eq-modal-magnitude" style={{ color: magnitudeColor }}>
                    M{quake.properties.mag}
                  </span>
                  <span className="eq-modal-status">{quake.properties.status}</span>
                </div>
              </div>
            </div>
            <div className="eq-modal-divider" />
          </AlertDialogHeader>

          {/* Data Sections */}
          <div className="eq-modal-scroll">
            {/* Identifiers Section */}
            <div className="eq-modal-section">
              <h4 className="eq-modal-section-title">Identifiers</h4>
              <div className="eq-modal-data-grid">
                {groupedData.identifiers.map((item, index) => (
                  <InfoPopover
                    key={index}
                    label={item.label}
                    value={item.value}
                    content={item.content}
                  />
                ))}
              </div>
            </div>

            {/* Location Section */}
            <div className="eq-modal-section">
              <h4 className="eq-modal-section-title">Location Information</h4>
              <div className="eq-modal-data-grid">
                {groupedData.locationInfo.map((item, index) => (
                  <InfoPopover
                    key={index}
                    label={item.label}
                    value={item.value}
                    content={item.content}
                  />
                ))}
              </div>
            </div>

            {/* Magnitude Section */}
            <div className="eq-modal-section">
              <h4 className="eq-modal-section-title">Magnitude Data</h4>
              <div className="eq-modal-data-grid">
                {groupedData.magnitude.map((item, index) => (
                  <InfoPopover
                    key={index}
                    label={item.label}
                    value={item.value}
                    content={item.content}
                  />
                ))}
              </div>
            </div>

            {/* Timestamps Section */}
            <div className="eq-modal-section">
              <h4 className="eq-modal-section-title">Event Timeline</h4>
              <div className="eq-modal-data-grid">
                {groupedData.timestamps.map((item, index) => (
                  <InfoPopover
                    key={index}
                    label={item.label}
                    value={item.value}
                    content={item.content}
                  />
                ))}
              </div>
            </div>

            {/* Details Section */}
            <div className="eq-modal-section">
              <h4 className="eq-modal-section-title">Additional Details</h4>
              <div className="eq-modal-data-grid">
                {groupedData.details.map((item, index) => (
                  <InfoPopover
                    key={index}
                    label={item.label}
                    value={item.value}
                    content={item.content}
                    url={item?.url}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <AlertDialogFooter className="eq-modal-footer">
            <AlertDialogCancel
              className="eq-modal-button"
              onClick={() => handleModalChange(false)}
            >
              <span>Close</span>
              <span className="eq-modal-button-icon">✕</span>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
