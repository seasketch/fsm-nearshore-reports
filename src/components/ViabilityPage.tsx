import React from "react";
import { SizeCard } from "./SizeCard";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { GeogProp } from "@seasketch/geoprocessing/client-core";

const ReportPage: React.FunctionComponent<GeogProp> = (props) => {
  return (
    <>
      <SizeCard geographyId={props.geographyId} />
      <SketchAttributesCard autoHide />
    </>
  );
};

export default ReportPage;
