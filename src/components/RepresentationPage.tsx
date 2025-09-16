import React from "react";
import { BenthicHabitat } from "./BenthicHabitat.js";
import { ReportProps } from "../util/ReportProp.js";
import { ReefGeomorphic } from "./ReefGeomorphic.js";
import { DepthZones } from "./DepthZones.js";

const ReportPage: React.FunctionComponent<ReportProps> = (props) => {
  return (
    <>
      <BenthicHabitat
        geographyId={props.geographyId}
        printing={props.printing}
      />
      <ReefGeomorphic
        geographyId={props.geographyId}
        printing={props.printing}
      />
      <DepthZones geographyId={props.geographyId} printing={props.printing} />
    </>
  );
};

export default ReportPage;
