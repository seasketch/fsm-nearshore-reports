import React, { useState, ChangeEventHandler } from "react";
import {
  SegmentControl,
  ReportPage,
  GeographySwitcher,
  LayerToggle,
  ToolbarCard,
} from "@seasketch/geoprocessing/client-ui";
import ViabilityPage from "../components/ViabilityPage";
import RepresentationPage from "../components/RepresentationPage";
import TradeoffsPage from "../components/TradeoffsPage";
import { useTranslation } from "react-i18next";
import { Translator } from "../components/TranslatorAsync";
import project from "../../project";

const enableAllTabs = false;

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

  return (
    <>
      <ToolbarCard title={t("Coastal Planning Area")} items={switcherAndMap}>
        <></>
      </ToolbarCard>
      <div style={{ marginTop: 5 }}>
        <SegmentControl
          value={tab}
          onClick={(segment) => setTab(segment)}
          segments={segments}
        />
      </div>
      <ReportPage hidden={!enableAllTabs && tab !== viabilityId}>
        <ViabilityPage geographyId={geographyId} />
      </ReportPage>
      <ReportPage hidden={!enableAllTabs && tab !== representationId}>
        <RepresentationPage geographyId={geographyId} />
      </ReportPage>
      <ReportPage hidden={!enableAllTabs && tab !== tradeoffsId}>
        <TradeoffsPage geographyId={geographyId} />
      </ReportPage>
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
