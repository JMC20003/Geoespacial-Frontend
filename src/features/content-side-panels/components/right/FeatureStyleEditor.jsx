import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SketchPicker } from 'react-color'; // Assuming you have react-color installed
import { CompactPicker } from 'react-color';
import { circle } from '@turf/turf';

export const FeatureStyleEditor = ({ selectedFeature, onStyleChange }) => {
  const [tempStyle, setTempStyle] = useState({});

  useEffect(() => {
    if (selectedFeature) {
      // Initialize temporary style from selectedFeature's properties
      // You'll need to define which properties correspond to style
      setTempStyle({
        fillColor: selectedFeature.properties?.['fill-color'] || '#007cbf',
        circleColor: selectedFeature.properties?.['circle-color'] || '#007cbf',
        lineColor: selectedFeature.properties?.['line-color'] || '#007cbf',
        lineWidth: selectedFeature.properties?.['line-width'] || 2,
        circleRadius: selectedFeature.properties?.['circle-radius'] || 4,
        // Add other style properties as needed
      });
    }
  }, [selectedFeature]);

  const handleColorChange = (color, property) => {
    const newStyle = { ...tempStyle, [property]: color.hex };
    setTempStyle(newStyle);
    onStyleChange(newStyle); // Notify parent of temporary change
  };

  if (!selectedFeature) {
    return <div className="p-4 text-gray-500">Selecciona una geometría para editar su estilo.</div>;
  }

  const styleControlsByType = {
  Polygon: [
    { label: "Color de Relleno", prop: "fillColor", type: "color" },
    { label: "Color de Línea", prop: "lineColor", type: "color" },
    { label: "Color de Punto", prop: "circleColor", type: "color" },
    { label: "Ancho de Línea", prop: "lineWidth", type: "number" },
    { label: "Tamaño de Punto", prop: "circleRadius", type: "number" },

  ],
  LineString: [
    { label: "Color de Línea", prop: "lineColor", type: "color" },
    { label: "Color de Punto", prop: "circleColor", type: "color" },
    { label: "Ancho de Línea", prop: "lineWidth", type: "number" },
    { label: "Tamaño de Punto", prop: "circleRadius", type: "number" },
  ],
  Point: [
    { label: "Color de Punto", prop: "circleColor", type: "color" },
    { label: "Tamaño de Punto", prop: "circleRadius", type: "number" },
  ]
};

const controlsToRender = styleControlsByType[selectedFeature.geometry.type] || [];

return (
  <div className="p-4">
    <h3 className="text-lg font-semibold mb-4">
      Estilo de Geometría (ID: {selectedFeature.id})
    </h3>

    {controlsToRender.map((control) => (
      <div className="mb-4" key={control.prop}>
        <label className="block text-sm font-medium text-gray-700">{control.label}</label>
        {control.type === "color" ? (
          <CompactPicker
            color={tempStyle[control.prop]}
            onChangeComplete={(color) => handleColorChange(color, control.prop)}
          />
        ) : (
          <input
            type="number"
            value={tempStyle[control.prop]}
            onChange={(e) =>
              handleColorChange({ hex: parseInt(e.target.value) }, control.prop)
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        )}
      </div>
    ))}
  </div>
);
};