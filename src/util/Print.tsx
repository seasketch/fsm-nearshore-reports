import React from "react";
import { SketchProperties } from "@seasketch/geoprocessing/client-core";
import { Card, SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { useTranslation } from "react-i18next";
import { Printer as BasePrinter } from "@styled-icons/bootstrap";
import { PrintMap } from "../components/PrintMap";
import styled from "styled-components";

const Printer = styled(BasePrinter)`
  cursor: pointer;
  color: #999;

  &:hover {
    color: #666;
  }
`;

const PrintPopupStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PrintButton: React.FunctionComponent = () => (
  <Printer size={18} title="Print/Save to PDF" />
);

export const PrintPopup: React.FunctionComponent = () => (
  <PrintPopupStyled>
    <Card>
      <div>Printing...</div>
    </Card>
  </PrintPopupStyled>
);

/**
 * Sketch attributes for printing
 */
export const SketchAttributes: React.FunctionComponent<SketchProperties> = (
  attributes
) => {
  const { t } = useTranslation();
  const { name, id, createdAt, updatedAt } = attributes;
  const cardStyle = { flex: "1" };
  const textStyle = { fontWeight: "normal", color: "#777" };

  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <div style={cardStyle}>
        <Card>
          <h1 style={textStyle}>{name}</h1>
          <p>
            {t("Sketch ID")}: {id}
          </p>
          <p>
            {t("Sketch created")}: {new Date(createdAt).toLocaleString()}
          </p>
          <p>
            {t("Sketch last updated")}: {new Date(updatedAt).toLocaleString()}
          </p>
          <p>
            {t("Document created")}: {new Date().toLocaleString()}
          </p>
          <SketchAttributesCard />
        </Card>
      </div>
      <PrintMap />
    </div>
  );
};
