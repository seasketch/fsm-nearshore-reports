import React from "react";
import { GeogProp } from "@seasketch/geoprocessing/client-core";
import { Habitat } from "./Habitat";

const ReportPage: React.FunctionComponent<GeogProp> = (props) => {
  return (
    <>
      <Habitat geographyId={props.geographyId} />
    </>
  );
};

export default ReportPage;
