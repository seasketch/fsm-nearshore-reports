import React from "react";
import { Tradeoffs } from "./Tradeoffs";
import { ReportProps } from "../util/ReportProp";

const ReportPage: React.FunctionComponent<ReportProps> = (props) => {
  return (
    <>
      <Tradeoffs geographyId={props.geographyId} printing={props.printing} />
    </>
  );
};

export default ReportPage;
