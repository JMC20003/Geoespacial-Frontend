import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  setSelectedFeature,
  clearSelectedFeature,
  fetchFeatures
} from '@/shared/redux/features/featureSlice';
import { setActiveDrawMode } from '@/shared/redux/features/mapSlice';
import { getFeatureById, updateFeature, createFeatureCollection, deleteFeature} from '@/features/map/services/featureAPI';


export const useDrawingTool = () => {
  const dispatch = useDispatch();
  const mapBoxDrawStateRef = useSelector(state => state.mapReducer.mapBoxDrawStateRef);
  const mapInstanceFromRedux = useSelector(state => state.mapReducer.mapRef);
  const { selectedFeature } = useSelector(state => state.featureReducer);
  const [isEditing, setIsEditing] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Efecto para detectar cuando el mapa está listo
  useEffect(() => {
    if (mapInstanceFromRedux) {
      setIsMapReady(true);
    } else {
      setIsMapReady(false);
    }
  }, [mapInstanceFromRedux]);
  
  // Detectar click en el mapa y seleccionar feature
  useEffect(() => {
    if (!isMapReady) {
      return;
    }
    const map = mapInstanceFromRedux.getMap();
    toast.success("Mapa listo para interacción con features.");

    const interactiveFeatureLayerIds = ['feature-fill', 'feature-lines', 'feature-points'];

    const onClick = async (event) => {

      let feature = event.features?.[0];

      // Fallback: Si event.features es undefined, intentar queryRenderedFeatures
      if (!feature && event.point) {
        console.log('event.features is undefined, attempting queryRenderedFeatures...');
        const queriedFeatures = map.queryRenderedFeatures(event.point, {
          layers: interactiveFeatureLayerIds
        });
        feature = queriedFeatures?.[0];
      }
      
      if (!feature) {
        console.log('No feature detected after all attempts. Clearing selection.');
        dispatch(clearSelectedFeature());
        return;
      }

      const isInteractiveLayer = interactiveFeatureLayerIds.includes(feature.layer.id);
      if (isInteractiveLayer) {
        const backendId = feature.id; // Usar feature.id directamente

        if (!backendId) {
          console.warn('Feature clicked has no backend ID:', feature);
          dispatch(clearSelectedFeature());
          return;
        }

        try {
          const response = await getFeatureById(backendId);
          dispatch(setSelectedFeature(response)); // Pasa el objeto feature completo
        } catch (err) {
          console.error('Error fetching feature details:', err);
          dispatch(clearSelectedFeature());
        }
      } else {
        dispatch(clearSelectedFeature());
      }
    };

    map.on('click', onClick);
    return () => map.off('click', onClick);
  }, [isMapReady, dispatch]);

  // Editar feature
  const handleEdit = () => {
    if (!selectedFeature || !mapBoxDrawStateRef) {
      return;
    }

    setIsEditing(true);
    mapBoxDrawStateRef.deleteAll();

    // Si es FeatureCollection, tomar la primera feature
    const featureToEdit = selectedFeature.type === 'FeatureCollection'
      ? selectedFeature.features[0]
      : selectedFeature;

    if (!featureToEdit?.geometry) {
      toast.error("El feature seleccionado no tiene geometría válida.");
      return;
    }

    // Mapbox Draw necesita que el ID esté en el nivel superior del objeto feature
    // y que sea un string o number. Si el ID no está presente, Mapbox Draw lo generará.
    const featureToAdd = { ...featureToEdit, id: featureToEdit.id || undefined };
    const featureIds = mapBoxDrawStateRef.add(featureToAdd);

    if (featureIds?.length) {
      mapBoxDrawStateRef.changeMode('direct_select', { featureId: featureIds[0] });
    } else {
      console.log('handleEdit: No feature IDs returned after adding to Mapbox Draw.');
    }
  };

  // Guardar feature(s)
  const handleSave = async () => {
    if (!mapBoxDrawStateRef) return;

    const drawn = mapBoxDrawStateRef.getAll();
    if (drawn.features.length === 0) return;

    if (isEditing && selectedFeature) { // Editing an existing feature
      try {

        const featureToUpdate = { ...drawn.features[0], id: selectedFeature.id };
        await updateFeature(featureToUpdate.id, featureToUpdate);
        toast.success("Geometría actualizada correctamente.");
        mapBoxDrawStateRef.deleteAll(); // Limpiar el dibujo del control
        setIsEditing(false);
        dispatch(fetchFeatures()); // Recargar features desde el backend
        dispatch(clearSelectedFeature()); // Deseleccionar la feature
      } catch (err) {
        toast.error("Error al actualizar la geometría.");
      }
    } else { // Drawing a new feature
      const payload = {
        type: "FeatureCollection",
        features: drawn.features.map(f => {
          const { id, ...rest } = f;
          return rest; // Asegurarse de que los nuevos features no tengan IDs temporales de Mapbox Draw
        }),
      };
      try {
        await createFeatureCollection(payload);
        toast.success("Geometrías guardadas correctamente.");
        dispatch(fetchFeatures()); // Recargar features desde el backend
        mapBoxDrawStateRef.deleteAll(); // Limpiar el dibujo del control
      } catch (err) {
        console.error('Error al guardar las geometrías:', err);
        toast.error("Error al guardar las geometrías.");
      }
    }
  };

  //  Eliminar feature
  const handleDelete = async () => {
    if (!selectedFeature) return;
    try {
      await deleteFeature(selectedFeature.id);
      dispatch (fetchFeatures());
      dispatch(clearSelectedFeature());
      toast.success("Feature eliminado correctamente.");
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar el feature.");
    }
  };

  //  Selección de herramienta
  const toolKeyToDrawMode = {
    poligono: 'draw_polygon',
    linea: 'draw_line_string',
    punto: 'draw_point',
    circulo: 'draw_circle',
    extension: 'draw_rectangle',
    lazo: 'draw_freehand'
  };

  const handleToolSelection = (toolKey) => {
    const drawMode = toolKeyToDrawMode[toolKey] || 'simple_select';
    dispatch(setActiveDrawMode(drawMode));
  };

  return {
    handleDelete,
    handleEdit,
    handleSave,
    handleToolSelection,
    isEditing,
    selectedFeature,
  };
};
