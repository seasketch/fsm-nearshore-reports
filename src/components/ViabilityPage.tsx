import React from "react";
import { SizeCard } from "./SizeCard";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { OUSCard } from "./OUSCard";
import { GroupCard } from "./Group";
import { ReportProps } from "../util/ReportProp";

const ReportPage: React.FunctionComponent<ReportProps> = (props) => {
  return (
    <>
      <GroupCard geographyId={props.geographyId} printing={props.printing} />
      <SizeCard geographyId={props.geographyId} printing={props.printing} />
      {props.geographyId === "kosrae" ? (
        <OUSCard geographyId={props.geographyId} printing={props.printing} />
      ) : (
        <></>
      )}
      {!props.printing && <SketchAttributesCard autoHide />}
    </>
  );
};

export default ReportPage;
