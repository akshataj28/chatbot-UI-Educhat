"use client"

import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger
// } from "@/components/ui/popover"
import { ChatbotUIContext } from "@/context/context"
import { createWorkspace } from "@/db/workspaces"
import useHotkey from "@/lib/hooks/use-hotkey"
import { IconBuilding, IconHome, IconPlus } from "@tabler/icons-react"
import { ChevronsUpDown } from "lucide-react"
import Image from "next/image"
import { useRouter,useSearchParams,usePathname } from "next/navigation"
import { FC, useContext, useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import NewChatIcon from "../Shapes/NewChatIcon"
import ClosingArrowButton from "../Shapes/ClosingArrowButton"
import { cn } from "@/lib/utils"
import { Tabs } from "../ui/tabs"
import { ContentType } from "@/types"
import { SidebarSwitcher } from "../sidebar/sidebar-switcher"
import { Sidebar } from "../sidebar/sidebar"

const SIDEBAR_WIDTH = 350; // Full width of sidebar
const SIDEBAR_MIN_WIDTH = 50; 

interface WorkspaceSwitcherProps {}

export const WorkspaceSwitcher: FC<WorkspaceSwitcherProps> = ({}) => {
  useHotkey(";", () => setOpen(prevState => !prevState))

  const {
    workspaces,
    workspaceImages,
    selectedWorkspace,
    setSelectedWorkspace,
    setWorkspaces
  } = useContext(ChatbotUIContext)

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tabValue = searchParams.get("tab") || "chats"
  const [contentType, setContentType] = useState<ContentType>(
    tabValue as ContentType
  )
  const { handleNewChat } = useChatHandler()

  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [search, setSearch] = useState("")
  useHotkey("s", () => setShowSidebar(prevState => !prevState))

  const [showSidebar, setShowSidebar] = useState(
    localStorage.getItem("showSidebar") === "true"
  )
  useHotkey("s", () => handleToggleSidebar())

  const handleToggleSidebar = () => {
    setShowSidebar(prevState => !prevState)
    localStorage.setItem("showSidebar", String(!showSidebar))
  }
  useEffect(() => {
    if (!selectedWorkspace) return

    setValue(selectedWorkspace.id)
  }, [selectedWorkspace])

  const handleCreateWorkspace = async () => {
    if (!selectedWorkspace) return

    const createdWorkspace = await createWorkspace({
      user_id: selectedWorkspace.user_id,
      default_context_length: selectedWorkspace.default_context_length,
      default_model: selectedWorkspace.default_model,
      default_prompt: selectedWorkspace.default_prompt,
      default_temperature: selectedWorkspace.default_temperature,
      description: "",
      embeddings_provider: "openai",
      include_profile_context: selectedWorkspace.include_profile_context,
      include_workspace_instructions:
        selectedWorkspace.include_workspace_instructions,
      instructions: selectedWorkspace.instructions,
      is_home: false,
      name: "New Workspace"
    })

    setWorkspaces([...workspaces, createdWorkspace])
    setSelectedWorkspace(createdWorkspace)
    setOpen(false)

    return router.push(`/${createdWorkspace.id}/chat`)
  }

  // const getWorkspaceName = (workspaceId: string) => {
  //   const workspace = workspaces.find(workspace => workspace.id === workspaceId)

  //   if (!workspace) return

  //   return workspace.name
  // }

  // const handleSelect = (workspaceId: string) => {
  //   const workspace = workspaces.find(workspace => workspace.id === workspaceId)

  //   if (!workspace) return

  //   setSelectedWorkspace(workspace)
  //   setOpen(false)

  //   return router.push(`/${workspace.id}/chat`)
  // }

  // const workspaceImage = workspaceImages.find(
  //   image => image.workspaceId === selectedWorkspace?.id
  // )
  // const imageSrc = workspaceImage
  //   ? workspaceImage.url
  //   : selectedWorkspace?.is_home
  //     ? ""
  //     : ""

  // const IconComponent = selectedWorkspace?.is_home ? NewChatIcon : IconBuilding

  return (
    
    <>
    
    <Button
       className="flex w-full items-center space-x-2"
      variant="ghost"
      size="icon"      
      onClick={handleNewChat}
      style={{
        marginRight:"100px"}}
    >
      <NewChatIcon />
      {/* <div className="ml-2 ">New Chat</div> */}
    </Button>
   
    <Button
        style={{
          marginLeft: "140px",
          transform: showSidebar ? "rotate(0deg)" : "rotate(180deg)",
        }}
        variant="ghost"
        size="icon"
        onClick={handleToggleSidebar}
      >
        <ClosingArrowButton />
      </Button>

   
   
     
      </>
    // <Popover open={open} onOpenChange={setOpen}>
    //   <PopoverTrigger
    //     className="border-input flex h-[36px]
    //     w-full cursor-pointer items-center justify-between rounded-md border px-2 py-1 hover:opacity-50"
    //   >
    //     <div className="flex items-center truncate">
    //       {selectedWorkspace && (
    //         <div className="flex items-center">
    //           {workspaceImage ? (
    //             <Image
    //               style={{ width: "22px", height: "22px" }}
    //               className="mr-2 rounded"
    //               src={imageSrc}
    //               width={22}
    //               height={22}
    //               alt={selectedWorkspace.name}
    //             />
    //           ) : (
    //             <IconComponent className="mb-0.5 mr-2" size={22} />
    //           )}
    //         </div>
    //       )}

    //       {getWorkspaceName(value) || "Select workspace..."}
    //     </div>

    //     <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
    //   </PopoverTrigger>

    //   <PopoverContent className="p-2">
    //     <div className="space-y-2">
        
    //       <Button
    //         className="flex w-full items-center space-x-2"
    //         size="sm"
    //         onClick={handleCreateWorkspace}
    //       >
    //         <IconPlus />
    //         <div className="ml-2">New Workspace</div>
    //       </Button>

    //       <Input
    //         placeholder="Search workspaces..."
    //         autoFocus
    //         value={search}
    //         onChange={e => setSearch(e.target.value)}
    //       />

    //       <div className="flex flex-col space-y-1">
    //         {workspaces
    //           .filter(workspace => workspace.is_home)
    //           .map(workspace => {
    //             const image = workspaceImages.find(
    //               image => image.workspaceId === workspace.id
    //             )

    //             return (
    //               <Button
    //                 key={workspace.id}
    //                 className="flex items-center justify-start"
    //                 variant="ghost"
    //                 onClick={() => handleSelect(workspace.id)}
    //               >
    //                 {image ? (
    //                   <Image
    //                     style={{ width: "28px", height: "28px" }}
    //                     className="mr-3 rounded"
    //                     src={image.url || ""}
    //                     width={28}
    //                     height={28}
    //                     alt={workspace.name}
    //                   />
    //                 ) : (
    //                   <IconHome className="mr-3" size={28} />
    //                 )}

    //                 <div className="text-lg font-semibold">
    //                   {workspace.name}
    //                 </div>
    //               </Button>
    //             )
    //           })}

    //         {workspaces
    //           .filter(
    //             workspace =>
    //               !workspace.is_home &&
    //               workspace.name.toLowerCase().includes(search.toLowerCase())
    //           )
    //           .sort((a, b) => a.name.localeCompare(b.name))
    //           .map(workspace => {
    //             const image = workspaceImages.find(
    //               image => image.workspaceId === workspace.id
    //             )

    //             return (
    //               <Button
    //                 key={workspace.id}
    //                 className="flex items-center justify-start"
    //                 variant="ghost"
    //                 onClick={() => handleSelect(workspace.id)}
    //               >
    //                 {image ? (
    //                   <Image
    //                     style={{ width: "28px", height: "28px" }}
    //                     className="mr-3 rounded"
    //                     src={image.url || ""}
    //                     width={28}
    //                     height={28}
    //                     alt={workspace.name}
    //                   />
    //                 ) : (
    //                   <IconBuilding className="mr-3" size={28} />
    //                 )}

    //                 <div className="text-lg font-semibold">
    //                   {workspace.name}
    //                 </div>
    //               </Button>
    //             )
    //           })}
    //       </div>
    //     </div>
        
    //   </PopoverContent>
    // </Popover>
  )
}