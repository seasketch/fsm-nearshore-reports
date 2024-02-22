import React from "react";
import { Habitat } from "./Habitat";
import { ReportProps } from "../util/ReportProp";

const ReportPage: React.FunctionComponent<ReportProps> = (props) => {
  return (
    <>
      <Habitat geographyId={props.geographyId} printing={props.printing} />
    </>
  );
};

export default ReportPage;
