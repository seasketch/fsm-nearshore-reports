import React from "react";
import { SizeCard } from "./SizeCard";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { GeogProp } from "@seasketch/geoprocessing/client-core";
import { OUSCard } from "./OUSCard";

const ReportPage: React.FunctionComponent<GeogProp> = (props) => {
  return (
    <>
      <SizeCard geographyId={props.geographyId} />
      <OUSCard geographyId={props.geographyId} />
      <SketchAttributesCard autoHide />
    </>
  );
};

export default ReportPage;
