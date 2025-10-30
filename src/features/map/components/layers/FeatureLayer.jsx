import { Source, Layer } from "react-map-gl/maplibre";
import { useSelector } from "react-redux";

export const FeatureLayer = () => {
  const { features, selectedFeature } = useSelector((state) => state.featureReducer);
  if (!features || !features.features || features.features.length === 0) {
    return null;
  }

  const geojson = features;

  return (
    <>
      <Source id="feature-source" type="geojson" data={geojson}>
        <Layer
          id="feature-fill"
          type="fill"
          source="feature-source"
          interactive={true}
          filter={['==', '$type', 'Polygon']}
          paint={{
            'fill-color': ['coalesce', ['get', 'fill-color'], '#007cbf'],
            'fill-opacity': ['coalesce', ['get', 'fill-opacity'], 0.5],
          }}
          layout={{}}
        />
        <Layer
          id="feature-lines"
          type="line"
          source="feature-source"
          interactive={true}
          paint={{
            'line-color': ['coalesce', ['get', 'line-color'], '#007cbf'],
            'line-width': ['coalesce', ['get', 'line-width'], 2]
          }}
          layout={{}}
        />
        <Layer
          id="feature-points"
          type="circle"
          source="feature-source"
          interactive={true}
          paint={{
            'circle-radius': ['coalesce', ['get', 'circle-radius'], 4],
            'circle-color': ['coalesce', ['get', 'circle-color'], '#007cbf'],
            'circle-stroke-width': ['coalesce', ['get', 'circle-stroke-width'], 1],
            'circle-stroke-color': ['coalesce', ['get', 'circle-stroke-color'], '#ffffff']
          }}
          layout={{}}
        />
      </Source>
      {selectedFeature && (
        <Source
          id="selected-backend-feature"
          type="geojson"
          data={{
            type: "FeatureCollection",
            features: [selectedFeature],
          }}
        >
          {/* Fill layer para polígonos */}
          <Layer
            id="selected-backend-feature-fill"
            type="fill"
            source="selected-backend-feature"
            interactive={true}
            filter={['==', '$type', 'Polygon']}
            paint={{
              'fill-color': selectedFeature.properties?.['fill-color'] ?? '#d8904dff',
              'fill-opacity': selectedFeature.properties?.['fill-opacity'] ?? 0.7,
            }}
            layout={{}}
          />

          {/* Line layer para polígonos y líneas */}
          <Layer
            id="selected-backend-feature-line"
            type="line"
            source="selected-backend-feature"
            interactive={true}
            paint={{
              'line-color': selectedFeature.properties?.['line-color'] ?? '#d8904dff',
              'line-width': selectedFeature.properties?.['line-width'] ?? 5,
            }}
            layout={{}}
          />

          {/* Point layer */}
          <Layer
            id="selected-backend-feature-point"
            type="circle"
            source="selected-backend-feature"
            interactive={true}
            paint={{
              'circle-radius': selectedFeature.properties?.['circle-radius'] ?? 5,
              'circle-color': selectedFeature.properties?.['circle-color'] ?? '#d8904dff',
              'circle-stroke-width': selectedFeature.properties?.['circle-stroke-width'] ?? 1,
              'circle-stroke-color': selectedFeature.properties?.['circle-stroke-color'] ?? '#ffffff',
            }}
            layout={{}}
          />
        </Source>
      )}
    </>
  );
}
