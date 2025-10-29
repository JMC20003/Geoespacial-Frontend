
import { BottomPanel } from '@/shared/layout/bottom/BottomPanel'
import { LeftPanel } from '@/shared/layout/left/LeftPanel'
import { RightPanel } from '@/shared/layout/right/RightPanel'
import { LayerList } from './components/left/LayerList'
import { TableContent } from './components/bottom/TableContent'
import { useGlobalState } from '@/shared/context/GlobalState'

export const Sidepanels = () => {
  const {setSelectView}= useGlobalState()


  const handleViewChange = (value)=>{
    setSelectView(value)
  }

  return (
    <>
        <LeftPanel
          title="Contenido"
          tabs={[
            { key: "layers", label: "Capas", content: <LayerList /> },
            { key: "leyend", label: "Leyenda", content: <component /> },
          ]}
        />


        <RightPanel />


        <BottomPanel 
          title=""
          tabs={[
            { key: "layers", label: "", content: <TableContent /> },
          ]}
          renderContent={()=>(
            <>
              <select
                onChange={(e) => handleViewChange(e.target.value)}
                className="focus:outline-0 text-[12px] text-gray-900"
                defaultValue="all"
              >
                <option value="all">Entidades visibles en el mapa</option>
                <option value="selec">Entidades seleccionadas</option>
              </select>
            </>
          )}
        
        />
    </>
  )
}
