import React from "react";
import { SizeCard } from "./SizeCard.js";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { OUSCard } from "./OUSCard.js";
import { GroupCard } from "./Group.js";
import { ReportProps } from "../util/ReportProp.js";
import { OusDemographic } from "./OusDemographic.js";

const ReportPage: React.FunctionComponent<ReportProps> = (props) => {
  return (
    <>
      <GroupCard geographyId={props.geographyId} printing={props.printing} />
      <SizeCard geographyId={props.geographyId} printing={props.printing} />
      {props.geographyId === "kosrae" ? (
        <>
          <OUSCard geographyId={props.geographyId} printing={props.printing} />
          <OusDemographic
            geographyId={props.geographyId}
            printing={props.printing}
          />
        </>
      ) : (
        <></>
      )}
      {!props.printing && <SketchAttributesCard autoHide />}
    </>
  );
};

export default ReportPage;
