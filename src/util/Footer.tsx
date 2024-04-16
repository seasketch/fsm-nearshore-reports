import React, { useState, useEffect } from "react";
import { Gear } from "@styled-icons/bootstrap";
import styled from "styled-components";
import {
  Dropdown,
  DropdownProps,
  SUPPORTED_FORMAT,
  SimpleButtonStyled,
} from "@seasketch/geoprocessing/client-ui";
import project from "../../project";
import { Datasource } from "@seasketch/geoprocessing/client-core";

const DownloadButtonStyled = styled(SimpleButtonStyled)`
  font-size: 12px;
`;

type DataDownloadDropdownProps = Omit<DropdownProps, "children">;

export interface DataDownloadProps extends DataDownloadDropdownProps {
  /** Name minus extension */
  filename?: string;
  /** Raw data to format and allow to download, nested objects and arrays will get flattened */
  data: object[];
  /** Formats to offer, defaults to csv only */
  formats?: SUPPORTED_FORMAT[];
  /** Add sketch name to filename, default to true */
  addSketchName?: boolean;
  /** Add timestamp to filename, defaults to true */
  addTimestamp?: boolean;
  titleElement?: JSX.Element;
}

export const Footer: React.FunctionComponent = () => {
  const dropdownProps: DataDownloadDropdownProps = {
    titleElement: (
      <Gear
        size={18}
        color="#999"
        title="Settings"
        style={{
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#666")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
      />
    ),
    placement: "right-end",
  };

  const [lastModified, setLastModified] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchLastModified = async () => {
      try {
        const result = await fetchDatasourceLastModified();
        setLastModified(result);
      } catch (error) {
        console.log("Error fetching last modified:", error);
      }
    };

    fetchLastModified();
  }, []);

  const blob = new Blob([JSON.stringify({ lastModified })], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  return (
    <>
      <Dropdown {...dropdownProps}>
        <a download="datasources_timestamps.json" href={url}>
          <DownloadButtonStyled>
            <span style={{ verticalAlign: "middle" }}>
              View Data Timestamps
            </span>
          </DownloadButtonStyled>
        </a>
      </Dropdown>
    </>
  );
};

export async function fetchDatasourceLastModified() {
  const datasources: Datasource[] = project.datasources;

  const modDates: Record<string, string> = {};

  await Promise.all(
    datasources.map(async (ds: Datasource) => {
      try {
        const url = project.getDatasourceUrl(ds);
        const lastModified = await fetchLastModifiedHeader(url);
        modDates[ds.datasourceId] = lastModified
          ? lastModified
          : "NA - Likely global datasource";
      } catch (error) {
        console.log(
          "Error fetching last modified:",
          error,
          "Likely global datasource"
        );
      }
    })
  ).catch((error) => {
    console.log("Error in Promise: Likely global datasource");
  });

  return modDates;
}

export async function fetchLastModifiedHeader(
  url: string
): Promise<string | null> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
    });

    if (response.ok && response.headers.has("Last-Modified")) {
      const lastModified = response.headers.get("Last-Modified");
      return lastModified;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
