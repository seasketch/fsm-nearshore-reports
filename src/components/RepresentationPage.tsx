import React from "react";
import { Habitat } from "./Habitat.js";
import { ReportProps } from "../util/ReportProp.js";

const ReportPage: React.FunctionComponent<ReportProps> = (props) => {
  return (
    <>
      <Habitat geographyId={props.geographyId} printing={props.printing} />
    </>
  );
};

export default ReportPage;
