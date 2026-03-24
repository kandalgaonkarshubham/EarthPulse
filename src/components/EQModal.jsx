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
        { label: "Event Code", value: data.code, content: "Unique identifier for the earthquake." },
        { label: "Network Code", value: data.net, content: "Code of the network that reported the earthquake." },
        { label: "Event IDs", value: (data?.ids || "").split(",").filter(Boolean).join(","), content: "Identifiers of this earthquake in different seismic networks." },
      ],
      locationInfo: [
        { label: "Location", value: data.place },
        { label: "Azimuthal Gap", value: data.gap, content: "The largest angle, in degrees, between seismic stations around the epicenter. Smaller gaps indicate better location accuracy." },
        { label: "Minimum Distance to Station", value: data.dmin, content: "The minimum distance, in degrees, from the earthquake epicenter to the closest seismic station that recorded the event." },
        { label: "Tsunami Warning", value: data.tsunami, content: "An indicator of whether the earthquake has tsunami potential, with 1 indicating potential and 0 indicating no potential." },
      ],
      magnitude: [
        { label: "Magnitude", value: data.mag, content: "A measure of the earthquake's size or energy release, often represented on the Richter scale or moment magnitude scale & The type of magnitude calculation used, e.g., mb (Body-Wave Magnitude), which measures the strength of P-waves (compressional waves)." },
        { label: "Significance", value: data.sig, content: "A computed significance value assessing the earthquake's potential impact based on magnitude, location, and population density." },
        { label: "Root Mean Square of Residuals", value: data.rms, content: "RMS value of residuals in the travel times from seismic stations, indicating the fit of the location solution; lower RMS values indicate better model fit." },
        { label: "Number of Stations Used", value: data.nst, content: "The total number of seismic stations that provided data used to determine the earthquake's location and magnitude. Location Description (place): A description of the earthquake's location relative to a well-known place or landmark." },
      ],
      timestamps: [
        { label: "Event Time", value: new Date(data.time).toLocaleString() },
        { label: "Updated Time", value: new Date(data.updated).toLocaleString() },
      ],
      details: [
        { label: "Review Status", value: data.status, content: "The status of the earthquake event analysis. 'Reviewed' indicates verification by a seismologist." },
        { label: "Data Sources", value: (data?.sources || "").split(",").filter(Boolean).join(",").toUpperCase(), content: "The seismic networks that provided data for the event." },
        { label: "Event Page URL", value: data.url, url: true },
      ],
    };
  }

  const groupedData = groupEarthquakeData(quake.properties);

  const magnitudeColor =
    quake.properties.mag < 3 ? '#eed7a1' :
    quake.properties.mag < 5 ? '#84cdee' :
    quake.properties.mag < 7 ? '#ffbcda' : '#eb2d3a';

  const magnitudeIntensity = Math.min((quake.properties.mag / 10) * 100, 100);

  const getIntensityLabel = (mag) => {
    if (mag < 2) return 'Minor';
    if (mag < 4) return 'Light';
    if (mag < 5.5) return 'Moderate';
    if (mag < 7) return 'Strong';
    return 'Severe';
  };

  const sections = [
    { title: 'Identifiers', data: groupedData.identifiers },
    { title: 'Location Information', data: groupedData.locationInfo },
    { title: 'Magnitude Data', data: groupedData.magnitude },
    { title: 'Event Timeline', data: groupedData.timestamps },
    { title: 'Additional Details', data: groupedData.details },
  ];

  return (
    <AlertDialog open={isModalOpen} onOpenChange={handleModalChange}>
      {/*
        eq-modal-container — position/size/animation must be !important to override the AlertDialogContent defaults.
        animate-[modalFadeIn] keyframe defined in index.css.
      */}
      <AlertDialogContent className="!fixed !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[90vw] !max-w-[1100px] !h-[90vh] !max-h-[900px] !bg-transparent !border-none !p-0 !gap-0 !z-50 !flex !flex-col animate-[modalFadeIn_0.35s_cubic-bezier(0.4,0,0.2,1)]">

        {/* Radial backdrop overlay */}
        <div
          className="absolute inset-0 -z-[1] pointer-events-none backdrop-blur-[10px]"
          style={{ background: 'radial-gradient(circle at 40% 30%, rgba(0,240,255,0.15) 0%, transparent 50%), radial-gradient(circle at 60% 70%, rgba(0,160,255,0.1) 0%, transparent 50%)' }}
        />

        {/*
          eq-modal-content — keeps the class for ::before grid pattern pseudo-element (index.css).
          All other styles inlined as Tailwind.
        */}
        <div
          className="eq-modal-content relative z-10 w-full h-full bg-[rgba(5,10,20,0.85)] backdrop-blur-[30px] border-2 border-[rgba(0,240,255,0.5)] flex flex-col overflow-hidden animate-[modalSlideUp_0.5s_cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_0_80px_rgba(0,240,255,0.5),0_0_160px_rgba(0,240,255,0.3),0_0_50px_rgba(0,160,255,0.2),inset_0_0_60px_rgba(0,240,255,0.12),0_30px_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,240,255,0.1)]"
        >

          {/*
            eq-modal-header — keeps the class for ::after bottom accent line (index.css).
          */}
          <AlertDialogHeader
            className="eq-modal-header relative z-[3] px-9 py-8 border-b-2 border-[rgba(0,240,255,0.3)] backdrop-blur-[10px]"
            style={{ background: 'linear-gradient(180deg, rgba(0,240,255,0.08) 0%, transparent 100%)' }}
          >
            <div className="flex justify-between items-start gap-5">
              <div className="flex-1">
                <AlertDialogTitle
                  className="text-[26px] font-black bg-clip-text text-transparent tracking-[2px] uppercase m-0 mb-4 break-words font-mono"
                  style={{
                    background: 'linear-gradient(90deg, #00f0ff 0%, #0080ff 40%, #00f0ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {quake.properties.title}
                </AlertDialogTitle>
                <div className="flex gap-3.5 items-center flex-wrap">
                  <span
                    className="inline-flex items-center px-[18px] py-2.5 bg-[rgba(0,0,0,0.5)] border-2 border-[rgba(0,240,255,0.6)] text-xs font-extrabold tracking-[1.2px] uppercase font-mono shadow-[0_0_30px_rgba(0,240,255,0.4),inset_0_0_20px_rgba(0,240,255,0.1)] animate-[magnitudePulse_2.5s_cubic-bezier(0.4,0,0.6,1)_infinite]"
                    style={{ color: magnitudeColor }}
                  >
                    M{quake.properties.mag}
                  </span>
                  <span className="inline-flex items-center px-[18px] py-2.5 bg-[rgba(0,0,0,0.5)] border-2 border-[rgba(0,255,100,0.5)] text-[10px] font-extrabold text-[#00ff64] tracking-[1.5px] uppercase shadow-[0_0_25px_rgba(0,255,100,0.3)] font-mono">
                    {quake.properties.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Intensity bar */}
            <div className="mt-5 pt-5 border-t border-[rgba(0,240,255,0.2)]">
              <div className="flex justify-between items-center mb-2.5 text-[11px]">
                <span className="text-[#00f0ff] font-extrabold tracking-[1.5px] uppercase font-mono [text-shadow:0_0_12px_rgba(0,240,255,0.3)]">INTENSITY</span>
                <span className="text-[#e0f7ff] font-bold tracking-[0.5px] uppercase font-mono">{getIntensityLabel(quake.properties.mag)}</span>
              </div>
              <div className="relative w-full h-2 bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.3)] overflow-hidden shadow-[inset_0_0_10px_rgba(0,240,255,0.05)]">
                {/*
                  eq-modal-intensity-fill — keeps class for ::after animated glow nub (index.css).
                */}
                <div
                  className="eq-modal-intensity-fill h-full relative border-r-2 border-r-[rgba(255,255,255,0.3)] shadow-[0_0_15px_currentColor,inset_0_0_8px_rgba(255,255,255,0.2)]"
                  style={{
                    width: `${magnitudeIntensity}%`,
                    backgroundColor: magnitudeColor,
                    transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                />
              </div>
            </div>
          </AlertDialogHeader>

          {/*
            eq-modal-scroll — keeps class for ::-webkit-scrollbar rules (index.css).
          */}
          <div
            className="eq-modal-scroll relative z-[2] overflow-y-auto px-9 py-8 flex-1"
            style={{ background: 'linear-gradient(180deg, rgba(0,240,255,0.02) 0%, transparent 100%)' }}
          >
            {sections.map((section, si) => (
              /*
                eq-modal-section — keeps class for ::before top accent line (index.css).
              */
              <div
                key={si}
                className="eq-modal-section mb-6 p-6 bg-[rgba(0,240,255,0.06)] border-2 border-[rgba(0,240,255,0.2)] border-l-4 border-l-[rgba(0,240,255,0.5)] transition-all [transition-duration:250ms] relative last:mb-0 hover:bg-[rgba(0,240,255,0.1)] hover:border-[rgba(0,240,255,0.4)] hover:border-l-[rgba(0,240,255,0.8)] hover:shadow-[inset_0_0_30px_rgba(0,240,255,0.1),0_0_30px_rgba(0,240,255,0.2)]"
              >
                {/*
                  eq-modal-section-title — keeps class for ::before animated dot (index.css).
                */}
                <h4 className="eq-modal-section-title text-[11px] font-extrabold text-[#00f0ff] tracking-[2px] uppercase m-0 mb-[18px] flex items-center gap-3 [text-shadow:0_0_15px_rgba(0,240,255,0.4)] font-mono">
                  {section.title}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {section.data.map((item, index) => (
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
            ))}
          </div>

          {/*
            eq-modal-footer — keeps class for ::before top accent line (index.css).
          */}
          <AlertDialogFooter
            className="eq-modal-footer relative z-[3] px-9 py-5 border-t-2 border-[rgba(0,240,255,0.3)] flex justify-end gap-3.5 backdrop-blur-[10px]"
            style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(0,240,255,0.05) 100%)' }}
          >
            <AlertDialogCancel
              className="!bg-[rgba(0,0,0,0.6)] !border-2 !border-[rgba(0,240,255,0.7)] !text-[#00f0ff] text-[11px] font-extrabold tracking-[1.5px] uppercase px-7 py-3.5 cursor-pointer flex items-center gap-2.5 transition-all [transition-duration:250ms] font-mono rounded-none shadow-[0_0_25px_rgba(0,240,255,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] hover:!bg-[rgba(0,240,255,0.15)] hover:!border-[rgba(0,240,255,1)] hover:shadow-[0_0_40px_rgba(0,240,255,0.7),0_0_80px_rgba(0,240,255,0.4),inset_0_0_30px_rgba(0,240,255,0.2)] hover:-translate-y-[3px]"
              onClick={() => handleModalChange(false)}
            >
              <span>Close</span>
              <span className="text-base transition-transform [transition-duration:250ms] inline-block">✕</span>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
