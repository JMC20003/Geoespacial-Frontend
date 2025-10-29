import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "mapbox-gl/dist/mapbox-gl.css";

import RouteIndex from '@/app/routes/Index'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLayerData } from "@/shared/redux/features/mapSlice";
import { getAllTables } from "@/shared/services/tableServices";

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();


  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllTables();
        dispatch(setLayerData(data.data));
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setIsLoading(true);
      }
    };

    load();
  }, []);

  if(!isLoading) {
    return <></>
  }

  return (
    <>
      <RouteIndex />
    </>
  )
}

export default App
