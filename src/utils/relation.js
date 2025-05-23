import * as turf from '@turf/turf';
import flatten from "@turf/flatten";

const isWithinMulti = (feature, container) => {
    if (feature.geometry.type === "MultiPolygon") {
      // Omvandla MultiPolygon till en samling Polygoner
      const flattened = flatten(feature);
      // Kontrollera om någon av de enskilda polygonerna ligger inom 'container'
      return flattened.features.some(polygon => turf.booleanWithin(polygon, container));
    } else {
      return turf.booleanWithin(feature, container);
    }
  };
const establishRelationship = (regions, municipals) => {
     // Gå igenom varje kommun och hitta den region som omsluter den
     const updatedMunicipals = municipals.features.map(municipal => {
        const containingRegion = regions.features.find(region => 
          isWithinMulti(municipal, region)
        );

        return {
          ...municipal,
          properties: {
            ...municipal.properties,
            region: containingRegion ? containingRegion.properties : null
          }
        };
      });
    return updatedMunicipals;
  };

export default establishRelationship;