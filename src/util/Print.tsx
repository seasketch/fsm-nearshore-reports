import React from "react";
import { SketchProperties } from "@seasketch/geoprocessing/client-core";
import { Card, SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { useTranslation } from "react-i18next";
import { Printer } from "@styled-icons/bootstrap";
import { PrintMap } from "../components/PrintMap";

export const PrintButton: React.FunctionComponent = () => {
  return (
    <Printer
      size={18}
      color="#999"
      title="Print/Save to PDF"
      style={{
        float: "right",
        position: "relative",
        margin: "5px",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#666")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
    />
  );
};

export const PrintPopup: React.FunctionComponent = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Card>
      <div>Printing...</div>
    </Card>
  </div>
);

/**
 * Sketch attributes for printing
 */
export const SketchAttributes: React.FunctionComponent<SketchProperties> = (
  attributes
) => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <div style={{ flex: "1" }}>
        <Card>
          <h1 style={{ fontWeight: "normal", color: "#777" }}>
            {attributes.name}
          </h1>
          <p>
            {t("Sketch ID")}: {attributes.id}
          </p>
          <p>
            {t("Sketch created")}:{" "}
            {new Date(attributes.createdAt).toLocaleString()}
          </p>
          <p>
            {t("Sketch last updated")}:{" "}
            {new Date(attributes.updatedAt).toLocaleString()}
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
