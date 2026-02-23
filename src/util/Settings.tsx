import React from "react";
import { Gear as BaseGear, CloudArrowUpFill } from "@styled-icons/bootstrap";
import { styled } from "styled-components";
import {
  Dropdown,
  SimpleButtonStyled,
} from "@seasketch/geoprocessing/client-ui";
import datasources from "../../project/datasources.json" with { type: "json" };

const DropdownItemStyled = styled(SimpleButtonStyled)`
  font-size: 12px;
`;

const Gear = styled(BaseGear)`
  cursor: pointer;
  color: #999;

  &:hover {
    color: #666;
  }
`;

const escapeCsv = (s: string) =>
  /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;

const csv =
  "datasourceId,lastUpdated\n" +
  datasources
    .map(
      (ds: { datasourceId: string; lastUpdated?: string }) =>
        `${escapeCsv(ds.datasourceId)},${escapeCsv(ds.lastUpdated ?? "NA")}`,
    )
    .join("\n");

const blob = new Blob([csv], { type: "text/csv" });
const url = URL.createObjectURL(blob);

export const Settings: React.FunctionComponent = () => {
  return (
    <Dropdown
      titleElement={<Gear size={18} title="Settings" />}
      placement="top-end"
    >
      <a download="DataUpdateHistory.csv" href={url}>
        <DropdownItemStyled>
          <span style={{ verticalAlign: "middle" }}>
            <CloudArrowUpFill size={16} /> Data Update History
          </span>
        </DropdownItemStyled>
      </a>
    </Dropdown>
  );
};
