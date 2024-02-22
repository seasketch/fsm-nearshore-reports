import React, { useState, useRef, useEffect, ChangeEventHandler } from "react";
import {
  SegmentControl,
  ReportPage,
  GeographySwitcher,
  LayerToggle,
  ToolbarCard,
  useSketchProperties,
  Card,
  SketchAttributesCard,
} from "@seasketch/geoprocessing/client-ui";
import ViabilityPage from "../components/ViabilityPage";
import RepresentationPage from "../components/RepresentationPage";
import TradeoffsPage from "../components/TradeoffsPage";
import { useTranslation } from "react-i18next";
import { Translator } from "../components/TranslatorAsync";
import project from "../../project";
import { Printer } from "@styled-icons/bootstrap";
import { useReactToPrint } from "react-to-print";
import { SketchProperties } from "@seasketch/geoprocessing/client-core";

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

  const printRef = useRef(null);
  const promiseResolveRef = useRef<any>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      // Letting `react-to-print` know that the DOM updates are completed
      promiseResolveRef.current();
    }
  }, [isPrinting]);

  const [attributes] = useSketchProperties();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: attributes.name,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        setIsPrinting(true);
        promiseResolveRef.current = resolve;
      });
    },
    onAfterPrint: () => {
      promiseResolveRef.current = null;
      setIsPrinting(false);
    },
  });

  return (
    <>
      <ToolbarCard title={t("Coastal Planning Area")} items={switcherAndMap}>
        <></>
      </ToolbarCard>
      <Printer
        size={18}
        color="#999"
        title="Print/Save to PDF"
        style={{
          float: "right",
          position: "relative",
          margin: "5px",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#666")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
        onClick={() => handlePrint()}
      />

      <div style={{ marginTop: 5 }}>
        <SegmentControl
          value={tab}
          onClick={(segment) => setTab(segment)}
          segments={segments}
        />
      </div>

      {isPrinting && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card>
            <div>Printing...</div>
          </Card>
        </div>
      )}

      <div
        ref={printRef}
        style={{ backgroundColor: isPrinting ? "#FFF" : "inherit" }}
      >
        {isPrinting && <style>{getPageMargins()}</style>}
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

const getPageMargins = () => {
  return `@page { margin: .1mm !important; }`;
};

/**
 * Sketch attributes for printing
 */
const SketchAttributes: React.FunctionComponent<SketchProperties> = (
  attributes
) => {
  const { t } = useTranslation();
  return (
    <Card>
      <h1 style={{ fontWeight: "normal", color: "#777" }}>{attributes.name}</h1>
      <p>
        {t("Sketch ID")}: {attributes.id}
      </p>
      <p>
        {t("Sketch created")}: {new Date(attributes.createdAt).toLocaleString()}
      </p>
      <p>
        {t("Sketch last updated")}:{" "}
        {new Date(attributes.updatedAt).toLocaleString()}
      </p>
      <p>
        {t("Document created")}: {new Date().toLocaleString()}
      </p>
      <SketchAttributesCard />
    </Card>
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
