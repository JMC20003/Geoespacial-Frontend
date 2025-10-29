

import NavbarContainer from './navbar/NavbarContainer'
import { Sidepanels } from './content-side-panels/Sidepanels'
import { MapContainer } from './map/MapContainer'

import { useGlobalState } from '../shared/context/GlobalState'


export const FeatureContainer = () => {
  const {openPanel} = useGlobalState();

  
  return (
    <>
        <NavbarContainer/>
        <Sidepanels/>
        <MapContainer/>
    </>
  )
}
