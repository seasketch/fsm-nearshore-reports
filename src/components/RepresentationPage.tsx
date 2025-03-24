import React from "react";
import { CoralAlgae } from "./CoralAlgae.js";
import { ReportProps } from "../util/ReportProp.js";
import { Seagrass } from "./Seagrass.js";
import { ReefGeomorphic } from "./ReefGeomorphic.js";
import { DepthZones } from "./DepthZones.js";

const ReportPage: React.FunctionComponent<ReportProps> = (props) => {
  return (
    <>
      <CoralAlgae geographyId={props.geographyId} printing={props.printing} />
      <Seagrass geographyId={props.geographyId} printing={props.printing} />
      <ReefGeomorphic
        geographyId={props.geographyId}
        printing={props.printing}
      />
      <DepthZones geographyId={props.geographyId} printing={props.printing} />
    </>
  );
};

export default ReportPage;
