import {
  Sketch,
  SketchCollection,
  NullSketchCollection,
  NullSketch,
  getSketchFeatures,
} from "@seasketch/geoprocessing/client-core";

// Designation of protection levels
export const groups = ["mpa", "aquaculture", "energy", "tourism", "other"];
export const groupsDisplay = [
  "Marine Protected Area",
  "Aquaculture Area",
  "Renewable Energy Area",
  "Tourism Area",
  "Other Area",
];

export const zoneTypeToGroup: Record<string, string> = {
  MPA: "mpa",
  AQUA: "aquaculture",
  ENERGY: "energy",
  TOURISM: "tourism",
  OTHER: "other",
};

export const sketchClassIdToGroup: Record<string, string> = {
  752: "aquaculture",
  745: "mpa",
};

// Display values for groups (plural)
export const groupDisplayMapPl: Record<string, string> = {
  mpa: "Marine Protected Area(s)",
  aquaculture: "Aquaculture Area(s)",
  energy: "Renewable Energy Area(s)",
  tourism: "Tourism Area(s)",
  other: "Other Area(s)",
};

// Display values for groups (singular)
export const groupDisplayMapSg: Record<string, string> = {
  mpa: "Marine Protected Area",
  aquaculture: "Aquaculture Area",
  energy: "Renewable Energy Area",
  tourism: "Tourism Area",
  other: "Other Area",
};

// Mapping groupIds to colors
export const groupColorMap: Record<string, string> = {
  mpa: "#FFE1A3",
  aquaculture: "#98DBF4",
  energy: "#CC66FF",
  tourism: "#4DDB98",
  other: "#FF6666",
};

/**
 * Gets zone types for all zones in a sketch collection from user attributes
 * @param sketch User-created Sketch | SketchCollection
 * @returns <string, string> mapping of sketchId to zone type
 */
export function getGroup(
  sketch: Sketch | SketchCollection | NullSketchCollection | NullSketch,
): Record<string, string> {
  const sketchFeatures = getSketchFeatures(sketch);
  const groups = sketchFeatures.reduce<Record<string, string>>(
    (groupsAcc, sketch) => {
      // New mapping using single sketch class with zone_type attribute
      const zoneType = sketch.properties.zone_type;
      const sketchClassId = sketch.properties.sketchClassId;
      const group = zoneType
        ? zoneTypeToGroup[zoneType]
        : sketchClassIdToGroup[sketchClassId];
      groupsAcc[sketch.properties.id] = group ? group : "other";

      return groupsAcc;
    },
    {},
  );

  return groups;
}
