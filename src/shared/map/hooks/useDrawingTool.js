// src/shared/map/hooks/useDrawingTool.js

import { useEffect } from 'react';
import { setDrawMode } from '@/shared/map/tools/setDrawMode';

export const useDrawingTool = ({
  mode,
  mapRef,
  drawRef,
  onDrawComplete = () => {},
  autoReset = true,
}) => {
  useEffect(() => {
    if (!mapRef || !drawRef) return;

    const map = mapRef.getMap();

    const handleCreate = (e) => {
      const feature = e.features?.[0];
      if (feature) {
        onDrawComplete(feature);
        if (autoReset) {
          drawRef.deleteAll();
        }
      }
    };

    map.on('draw.create', handleCreate);
    return () => {
      map.off('draw.create', handleCreate);
    };
  }, [mapRef, drawRef, onDrawComplete]);

  const activate = () => {
    setDrawMode(mapRef, drawRef, mode);
  };

  return {
    activate,
  };
};
