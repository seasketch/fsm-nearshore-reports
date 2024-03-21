import React, { useState, useRef, useEffect, ChangeEventHandler } from "react";
import {
  SegmentControl,
  ReportPage,
  GeographySwitcher,
  LayerToggle,
  ToolbarCard,
  useSketchProperties,
} from "@seasketch/geoprocessing/client-ui";
import ViabilityPage from "../components/ViabilityPage";
import RepresentationPage from "../components/RepresentationPage";
import TradeoffsPage from "../components/TradeoffsPage";
import { useTranslation } from "react-i18next";
import { Translator } from "../components/TranslatorAsync";
import project from "../../project";
import { useReactToPrint } from "react-to-print";
import { PrintButton, PrintPopup, SketchAttributes } from "../util/Print";

const MpaTabReport = () => {
  const { t } = useTranslation();
  const viabilityId = "viability";
  const representationId = "representation";
  const tradeoffsId = "tradeoffs";
  const segments = [
    { id: viabilityId, label: t("Viability") },
    { id: representationId, label: t("Representation") },
    { id: tradeoffsId, label: t("Tradeoffs") },
  ];
  const [tab, setTab] = useState<string>(viabilityId);

  // Geography
  const [geographyId, setGeography] = useState("kosrae");
  const geographySwitcher: ChangeEventHandler<HTMLSelectElement> = (e: any) => {
    setGeography(e.target.value);
  };
  const switcherAndMap = (
    <>
      <GeographySwitcher
        geographies={project.geographies}
        curGeographyId={geographyId}
        changeGeography={geographySwitcher}
      />
      <LayerToggle
        label=" "
        layerId={project.getGeographyById(geographyId).layerId}
        simple
      />
    </>
  );

  // Printing
  const printRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [attributes] = useSketchProperties();
  // Original animation durations saved during printing
  const originalAnimationDurations: string[] = [
    ...document.querySelectorAll(".chart, .animated-scatter"),
  ].map((el) => (el as HTMLElement).style.animationDuration);

  useEffect(() => {
    // When printing, animations are disabled and the page is printed
    if (isPrinting) {
      [...document.querySelectorAll(".chart, .animated-scatter")].forEach(
        (el) => ((el as HTMLElement).style.animationDuration = "0s")
      );
      handlePrint();
    }
    // Return animation duration to normal after printing
    return () => {
      [...document.querySelectorAll(".chart, .animated-scatter")].forEach(
        (el, index) =>
          ((el as HTMLElement).style.animationDuration =
            originalAnimationDurations[index])
      );
    };
  }, [isPrinting]);

  // Print function
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: attributes.name,
    onBeforeGetContent: () => {},
    onAfterPrint: () => setIsPrinting(false),
  });

  return (
    <>
      {/* Geography Switcher */}
      <ToolbarCard title={t("Coastal Planning Area")} items={switcherAndMap}>
        <></>
      </ToolbarCard>

      {/* Saving to PDF/Printing */}
      <div
        onClick={() => {
          setIsPrinting(true);
        }}
      >
        <PrintButton />
      </div>
      {isPrinting && <PrintPopup />}

      {/* Segment control / tabs */}
      <div style={{ marginTop: 5 }}>
        <SegmentControl
          value={tab}
          onClick={(segment) => setTab(segment)}
          segments={segments}
        />
      </div>

      {/* Reports */}
      <div ref={printRef} color={isPrinting ? "#FFF" : "inherit"}>
        {isPrinting && <SketchAttributes {...attributes} />}
        <ReportPage hidden={!isPrinting && tab !== viabilityId}>
          <ViabilityPage geographyId={geographyId} printing={isPrinting} />
        </ReportPage>
        <ReportPage hidden={!isPrinting && tab !== representationId}>
          <RepresentationPage geographyId={geographyId} printing={isPrinting} />
        </ReportPage>
        <ReportPage hidden={!isPrinting && tab !== tradeoffsId}>
          <TradeoffsPage geographyId={geographyId} printing={isPrinting} />
        </ReportPage>
      </div>
    </>
  );
};

export default function () {
  // Translator must be in parent FunctionComponent in order for ReportClient to use useTranslate hook
  return (
    <Translator>
      <MpaTabReport />
    </Translator>
  );
}
