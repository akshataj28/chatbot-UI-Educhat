import { Tables } from "@/supabase/types"
import { ContentType, DataListType } from "@/types"
import { FC, useState } from "react"
import { SidebarCreateButtons } from "./sidebar-create-buttons"
import { SidebarDataList } from "./sidebar-data-list"
import { SidebarSearch } from "./sidebar-search"
import { WorkspaceSwitcher } from "../utility/workspace-switcher"

interface SidebarContentProps {
  contentType: ContentType
  data: DataListType
  folders: Tables<"folders">[]
}

export const SidebarContent: FC<SidebarContentProps> = ({
  contentType,
  data,
  folders
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const filteredData: any = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  // console.log("data from sidebarcontent", filteredData)

  return (
    // Subtract 50px for the height of the workspace settings
    <div className="flex max-h-[calc(100%-160px)] grow flex-col" style={{marginLeft:"10px"}}>
      <div className="mt-1 flex items-center ml-4" >
      {/* <WorkspaceSwitcher/> */}
        {/* <SidebarCreateButtons
          contentType={contentType}
          hasData={data.length > 0}
        /> */}
      </div>

      {/* <div className="mt-2">
        <SidebarSearch
          contentType={contentType}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div> */}
      {/* {/* <ToggleSidebar> */}
{/* 
      <ToggleSidebar/>  */}

      <SidebarDataList
        contentType={contentType}
        data={filteredData}
        folders={folders}
      />

    </div>
    
  )
}
