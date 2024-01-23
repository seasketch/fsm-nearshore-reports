import {
  Sketch,
  SketchCollection,
  NullSketchCollection,
  NullSketch,
  getSketchFeatures,
} from "@seasketch/geoprocessing/client-core";

// Designation of protection levels
export const groups = ["mpa", "aquaculture"];
export const groupsDisplay = ["Marine Protected Area", "Aquaculture Area"];

export const sketchClassIdToGroup: Record<string, string> = {
  752: "aquaculture",
  745: "mpa",
};

// Display values for groups (plural)
export const groupDisplayMapPl: Record<string, string> = {
  mpa: "Marine Protected Area(s)",
  aquaculture: "Aquaculture Area(s)",
};

// Display values for groups (singular)
export const groupDisplayMapSg: Record<string, string> = {
  mpa: "Marine Protected Area",
  aquaculture: "Aquaculture Area",
};

// Mapping groupIds to colors
export const groupColorMap: Record<string, string> = {
  mpa: "#FFE1A3",
  aquaculture: "#98DBF4",
};

// Designations of high and medium protection levels
export const highProtectionLevels = [
  "Ia",
  "Ib",
  "II",
  "III",
  "HIGH_PROTECTION",
];
export const mediumProtectionLevels = [
  "IV",
  "V",
  "VI",
  "OECM",
  "LMMA",
  "MEDIUM_PROTECTION",
];

/**
 * Gets zone types for all zones in a sketch collection from user attributes
 * @param sketch User-created Sketch | SketchCollection
 * @returns <string, string> mapping of sketchId to zone type
 */
export function getGroup(
  sketch: Sketch | SketchCollection | NullSketchCollection | NullSketch
): Record<string, string> {
  const sketchFeatures = getSketchFeatures(sketch);
  const groups = sketchFeatures.reduce<Record<string, string>>(
    (groupsAcc, sketch) => {
      const sketchClassId = sketch.properties.sketchClassId;
      const group = sketchClassIdToGroup[sketchClassId];
      groupsAcc[sketch.properties.id] = group ? group : "unknown";
      return groupsAcc;
    },
    {}
  );

  return groups;
}
