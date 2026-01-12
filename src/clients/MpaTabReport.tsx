import React, { useState, useRef, useEffect, ChangeEventHandler } from "react";
import {
  SegmentControl,
  ReportPage,
  GeographySwitcher,
  LayerToggle,
  ToolbarCard,
  useSketchProperties,
} from "@seasketch/geoprocessing/client-ui";
import { Translator } from "../components/TranslatorAsync.js";
import project from "../../project/projectClient.js";
import { useReactToPrint } from "react-to-print";
import { PrintButton, PrintPopup, SketchAttributes } from "../util/Print.js";
import { Settings } from "../util/Settings.js";
import { Footer } from "../util/Footer.js";
import { Group } from "../components/Group.js";
import { SizeCard } from "../components/SizeCard.js";
import { KosraeOUS } from "../components/KosraeOUS.js";
import { YapOUS } from "../components/YapOUS.js";
import { OusDemographic } from "../components/OusDemographic.js";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { ReefGeomorphic } from "../components/ReefGeomorphic.js";
import { DepthZones } from "../components/DepthZones.js";
import { useTranslation } from "react-i18next";
import { CoralACA } from "../components/CoralACA.js";
import { SeagrassACA } from "../components/SeagrassACA.js";
import { SpawnAgg } from "../components/SpawnAgg.js";
import { Mangroves } from "../components/Mangroves.js";
import { FAD } from "../components/FAD.js";
import { ExistingMPAs } from "../components/ExistingMPAs.js";
import { ReefMonitoring } from "../components/ReefMonitoring.js";

const BaseReport = () => {
  const { t } = useTranslation();
  const viabilityId = "viability";
  const habitatId = "habitat";
  const segments = [
    { id: viabilityId, label: t("Viability") },
    { id: habitatId, label: t("Key Habitats") },
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
        (el) => ((el as HTMLElement).style.animationDuration = "0s"),
      );
      handlePrint();
    }
    // Return animation duration to normal after printing
    return () => {
      [...document.querySelectorAll(".chart, .animated-scatter")].forEach(
        (el, index) =>
          ((el as HTMLElement).style.animationDuration =
            originalAnimationDurations[index]),
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

      {isPrinting && <PrintPopup />}

      <div
        onClick={() => {
          setIsPrinting(true);
        }}
      >
        <PrintButton />
      </div>

      {/* Segment control / tabs */}
      <div style={{ marginTop: 5 }}>
        <SegmentControl
          value={tab}
          onClick={(segment) => setTab(segment)}
          segments={segments}
        />
      </div>

      {/* Reports */}
      <div
        ref={printRef}
        style={{ backgroundColor: isPrinting ? "#FFF" : "inherit" }}
      >
        <div style={{ display: isPrinting ? "block" : "none" }}>
          <SketchAttributes {...attributes} />
        </div>
        <ReportPage hidden={!isPrinting && tab !== viabilityId}>
          <Group geographyId={geographyId} printing={isPrinting} />
          <SizeCard geographyId={geographyId} printing={isPrinting} />
          {geographyId === "kosrae" && (
            <>
              <FAD geographyId={geographyId} printing={isPrinting} />
              <ExistingMPAs geographyId={geographyId} printing={isPrinting} />
              <KosraeOUS geographyId={geographyId} printing={isPrinting} />
              <OusDemographic geographyId={geographyId} printing={isPrinting} />
            </>
          )}
          {geographyId === "yap" && (
            <>
              <YapOUS geographyId={geographyId} printing={isPrinting} />
            </>
          )}
          {!isPrinting && <SketchAttributesCard autoHide />}
        </ReportPage>

        <ReportPage hidden={!isPrinting && tab !== habitatId}>
          <CoralACA geographyId={geographyId} printing={isPrinting} />
          <SeagrassACA geographyId={geographyId} printing={isPrinting} />
          {geographyId === "kosrae" && (
            <>
              <Mangroves geographyId={geographyId} printing={isPrinting} />
              <SpawnAgg geographyId={geographyId} printing={isPrinting} />
              <ReefGeomorphic geographyId={geographyId} printing={isPrinting} />
              <ReefMonitoring geographyId={geographyId} printing={isPrinting} />
              <DepthZones geographyId={geographyId} printing={isPrinting} />
            </>
          )}
        </ReportPage>
      </div>

      {/* Footer */}
      <Footer>
        <Settings />
      </Footer>
    </>
  );
};

// Named export loaded by storybook
export const MpaTabReport = () => {
  return (
    <Translator>
      <BaseReport />
    </Translator>
  );
};

// Default export lazy-loaded by production ReportApp
export default MpaTabReport;
