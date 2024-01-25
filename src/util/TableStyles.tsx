import { ReportTableStyled } from "@seasketch/geoprocessing/client-ui";
import styled from "styled-components";

export const PercentSketchTableStyled = styled(ReportTableStyled)`
  & {
    width: 100%;
    overflow-x: scroll;
  }

  & td,
  th {
    text-align: center;
    border-right: 2px solid #efefef;
    min-width: 40px;
  }

  & th:first-child,
  & td:first-child {
    min-width: 120px;
    position: sticky;
    left: 0;
    text-align: left;
    background: #efefef;
  }

  font-size: 12px;
`;

export const AreaSketchTableStyled = styled(ReportTableStyled)`
  & {
    width: 100%;
    overflow-x: scroll;
  }

  & th:first-child,
  & td:first-child {
    min-width: 120px;
    position: sticky;
    left: 0;
    text-align: left;
    background: #efefef;
  }

  font-size: 12px;
  td {
    text-align: center;
    min-width: 60px;
  }

  tr:nth-child(1) > th:nth-child(n + 1) {
    text-align: center;
  }

  tr:nth-child(2) > th:nth-child(n + 1) {
    text-align: center;
  }

  tr > td:nth-child(1),
  tr > th:nth-child(1) {
    border-right: 2px solid #efefef;
  }

  tr:nth-child(1) > th:nth-child(2) {
    border-right: 2px solid #efefef;
  }

  tr > td:nth-child(3),
  tr > th:nth-child(3) {
    border-right: 2px solid #efefef;
  }
  tr > td:nth-child(5),
  tr > th:nth-child(5) {
    border-right: 2px solid #efefef;
  }
  tr > td:nth-child(7),
  tr > th:nth-child(7) {
    border-right: 2px solid #efefef;
  }
  tr > td:nth-child(9),
  tr > th:nth-child(9) {
    border-right: 2px solid #efefef;
  }
  tr > td:nth-child(11),
  tr > th:nth-child(11) {
    border-right: 2px solid #efefef;
  }
  tr > td:nth-child(13),
  tr > th:nth-child(13) {
    border-right: 2px solid #efefef;
  }
`;
