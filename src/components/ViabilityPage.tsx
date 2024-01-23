import React from "react";
import { SizeCard } from "./SizeCard";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { GeogProp } from "@seasketch/geoprocessing/client-core";
import { OUSCard } from "./OUSCard";
import { GroupCard } from "./Group";

const ReportPage: React.FunctionComponent<GeogProp> = (props) => {
  return (
    <>
      <GroupCard geographyId={props.geographyId} />
      <SizeCard geographyId={props.geographyId} />
      <OUSCard geographyId={props.geographyId} />
      <SketchAttributesCard autoHide />
    </>
  );
};

export default ReportPage;
