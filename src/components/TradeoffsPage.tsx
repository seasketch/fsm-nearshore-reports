import React from "react";
import { GeogProp } from "@seasketch/geoprocessing/client-core";
import { Tradeoffs } from "./Tradeoffs";

const ReportPage: React.FunctionComponent<GeogProp> = (props) => {
  return (
    <>
      <Tradeoffs geographyId={props.geographyId} />
    </>
  );
};

export default ReportPage;
