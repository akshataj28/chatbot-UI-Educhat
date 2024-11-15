import { FC, useContext, useEffect, useState } from "react"
import { ChatbotUIContext } from "@/context/context"
import { Tables } from "@/supabase/types"
import { ContentType } from "@/types"
import { SIDEBAR_WIDTH } from "../ui/dashboard"
import { TabsContent } from "../ui/tabs"
import { SidebarContent } from "./sidebar-content"
import { IconUser, IconSettings } from '@tabler/icons-react'
import NewChatIcon from '../Shapes/NewChatIcon'
import ClosingArrowButton from '../Shapes/ClosingArrowButton'
import Robot from "../Shapes/robot"
import { WithTooltip } from "../ui/with-tooltip"
import { ProfileSettings } from "../utility/profile-settings"
import { useChatHandler } from "../chat/chat-hooks/use-chat-handler"
import { Button } from "../ui/button"
import { Avatar } from "@mui/material"
import { useTheme } from "next-themes"

interface SidebarProps {
  contentType: ContentType
  showSidebar: boolean
  activePage: string;
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
  handleToggleSidebar: () => void
  handleSettingsClick:()=> void
  handleNewChatClick: ()=> void
  profileImageSrc: string; 
  displayName:string

}

const SidebarDataList = [
  {
    icon: <IconUser className="h-6 w-6" />,
    label: 'User',
  },
  {
    icon: <IconSettings className="h-6 w-6" />,
    label: 'Settings',
  },
  // {
  //   icon: <NewChatIcon />,
  //   label: 'New Chat',
  // },
]

export const Sidebar: FC<SidebarProps> = ({ contentType, showSidebar, setActivePage, handleToggleSidebar, handleSettingsClick,handleNewChatClick,profileImageSrc,displayName }) => {
  const {
    folders,
    chats,
    presets,
    prompts,
    files,
    collections,
    assistants,
    tools,
    models
  } = useContext(ChatbotUIContext)


  // const [activePage, setActivePage] = useState<ContentType>("chats");

  
  // const handleSettingsClick = () => {
  //   console.log("Settings clicked!"); // Check if this logs
  //   setActivePage("settings");
  // };
  
  // useEffect(() => {
  //   console.log("Active Page:", activePage); // Check if activePage updates correctly
  // }, [activePage]);
  
  const chatFolders = folders.filter(folder => folder.type === "chats")
  const presetFolders = folders.filter(folder => folder.type === "presets")
  const promptFolders = folders.filter(folder => folder.type === "prompts")
  const filesFolders = folders.filter(folder => folder.type === "files")
  const collectionFolders = folders.filter(folder => folder.type === "collections")
  const assistantFolders = folders.filter(folder => folder.type === "assistants")
  const toolFolders = folders.filter(folder => folder.type === "tools")
  const modelFolders = folders.filter(folder => folder.type === "models")
  const { handleNewChat } = useChatHandler()
  const { theme } = useTheme() // Access theme context to determine color

  // const settingsIconColor = theme === 'beige' || theme === 'light' ? 'text-black h-6 w-6' : 'text-white h-6 w-6'

  
  const renderSidebarContent = (
    contentType: ContentType,
    data: any[],
    folders: Tables<"folders">[]
  ) => {
    return (
     
        showSidebar && <SidebarContent contentType={contentType} data={data} folders={folders} />
    
    )
  }

 
  return (
    <TabsContent
      className="m-0 w-full space-y-2"
      style={{
        minWidth: showSidebar ? `calc(${SIDEBAR_WIDTH}px - 90px)` : "70px",
        maxWidth: showSidebar ? `calc(${SIDEBAR_WIDTH}px - 90px)` : "70px",
        width: showSidebar ? `calc(${SIDEBAR_WIDTH}px - 90px)` : "70px",
      }}
      value={contentType}
    >
      <div
  className={`flex h-full duration-300 bg-secondary fg-secondary `}
  // ${
  //   theme === 'beige' ? 'bg-beige-200 text-black' :
  //   theme === 'light' ? 'bg-white text-black' :
  //   'bg-black text-white'
  // }`
  // }
>
        <div className="flex flex-col h-full">
          <div style={{ marginLeft: "10px" }}>
            {/* EDUCHAT logo with Robot Icon */}
            <div className="flex items-center mt-4 mb-3 ml-3.5">
              <Robot className="h-7 w-7" />
              {showSidebar && (
                <span className="ml-4 text-lg font-bold justify-center">EDUCHAT</span>
              )}
            </div>

                {/* NewChatIcon and Closing Arrow */}
                {showSidebar && (
              <div className="flex items-center mb-2" style={{ marginLeft: "20px", marginTop: "20px" }}>
                <NewChatIcon className="h-4 w-4" onClick={handleNewChat}/>
                <button
                  className="flex items ml-9" // Adding margin-left here for spacing
                  style={{ transform: "rotate(0deg)", marginLeft:'270px' }}
                  onClick={() => handleToggleSidebar()}
                >
                  <ClosingArrowButton className="h-4 w-4"/>
                </button>
              </div>
            )}

            {/* Sidebar Icons */}
            <ul className="mt-4">
              {!showSidebar &&
                
                  <li
                    // key={index}
                    style={{ marginRight: "226px", }}
                    className={`flex items-center p-4 hover:bg-gray-700 cursor-pointer justify-center`}
                  >
                   < NewChatIcon className="h-4 w-4" onClick={handleNewChat} />
                  </li>
                }
            </ul>

        

            {/* Closing arrow for collapsed state */}
            {!showSidebar && (
              <button
                className="flex items"
                style={{ marginTop: "15px", marginLeft: "19px", transform: "rotate(180deg)" }}
                onClick={() => handleToggleSidebar()}
              >
                <ClosingArrowButton className="h-4 w-4"/>
              </button>
            )}
          </div>
          {!showSidebar && (
          <ul className="mt-3"  style={{marginTop:"460px" }}>
              
               
                  <><li
                style={{ marginRight: "220px" }}
                className={`flex items-center p-4 hover:bg-gray-700 cursor-pointer justify-center`}
              >
                {profileImageSrc===""?(<IconUser className="h-6 w-6" />) :(  
                <Avatar
                  src={profileImageSrc} 
                  className="w-10 h-10"
            /> 
            )}

              </li><li

                style={{ marginRight: "220px" }}
                className={`flex items-center p-4 hover:bg-gray-700 cursor-pointer justify-center`}
              >
                <button>  <IconSettings onClick={() => handleSettingsClick()} /></button>
                </li></>
                
            </ul>
            )}

         
          {/* Render content based on type */}
          {(() => {
            switch (contentType) {
              case "chats":
                return renderSidebarContent("chats", chats, chatFolders)
              case "presets":
                return renderSidebarContent("presets", presets, presetFolders)
              case "prompts":
                return renderSidebarContent("prompts", prompts, promptFolders)
              case "files":
                return renderSidebarContent("files", files, filesFolders)
              case "collections":
                return renderSidebarContent("collections", collections, collectionFolders)
              case "assistants":
                return renderSidebarContent("assistants", assistants, assistantFolders)
              case "tools":
                return renderSidebarContent("tools", tools, toolFolders)
              case "models":
                return renderSidebarContent("models", models, modelFolders)
              default:
                return null
            }
          })()}

{showSidebar && (
  <div
  className="bg-secondary fg-secondary"
    style={{
      display: "inline-flex",
      alignItems: "center",
      bottom: "0",
      width: "100%", // Change to 100% to occupy the full width
      height: "20px",
      paddingTop: "20px",
      paddingLeft: "20px",
      paddingBottom: "20px",
      justifyContent: "space-between",
      // backgroundColor: theme === "dark" ? "#000000":"#FFFF" 
      // boxSizing: "border-box", // Uncomment if needed to include padding in width
    }}
  >
    {profileImageSrc === "" ? (
      <IconUser className="h-6 w-6" />
    ) : (
      <Avatar src={profileImageSrc} className="w-10 h-10" />
    )}
    
    <div style={{ marginLeft: "10px", flex: 1 }}>
      {displayName === "" ? <span>username</span> : <span>{displayName}</span>}
    </div>

    <div style={{ flexGrow: 1 }} /> {/* This div will take up the remaining space */}
  
  <div className="justify-end" >
    <IconSettings onClick={handleSettingsClick} />
  </div>
</div>
 
)}

        </div>

       
      </div>

    </TabsContent>
  )
}





// import { FC, useState } from 'react';
// import { IconUser, IconSettings, IconChevronRight } from '@tabler/icons-react';
// import NewChatIcon from '../Shapes/NewChatIcon';
// import ClosingArrowButton from '../Shapes/ClosingArrowButton';
// import { SidebarContent } from './sidebar-content';
// import { useSearchParams } from 'next/navigation';
// import { ContentType } from '@/types';
// import { Tables } from '@/supabase/types';



// const SidebarDataList = [
//   {
//     icon: <IconUser className="h-6 w-6" />,
//     label: 'User',
//   },
//   {
//     icon: <IconSettings className="h-6 w-6" />,
//     label: 'Settings',
//   },
//   {
//     icon: <NewChatIcon />,
//     label: 'New Chat',
//   },
// ];
// interface SidebarProps {
//   contentType: ContentType
//   showSidebar: boolean
// }
// export const Sidebar: FC<SidebarProps> = ({ contentType, showSidebar }) => {
//   const [isOpen, setIsOpen] = useState(true);
//   // const searchParams = useSearchParams();
//   // const tabValue = searchParams.get("tab") || "chats"; // Move this inside the component

//   // const [contentType, setContentType] = useState<ContentType>(
//   //   tabValue as ContentType
//   // );
//   const renderSidebarContent = (
//     contentType: ContentType,
//     data: any[],
//     folders: Tables<"folders">[]
//   ) => {
//     console.log("data from renderSidebarContent", data)
//     return (
//       <SidebarContent contentType={contentType} data={data} folders={folders} />
//     )
//   }

//   return (
//     <div className={`flex h-screen ${isOpen ? 'w-64' : 'w-20'} duration-300 bg-gray-800 text-white`}>
//       <div className="flex flex-col justify-between h-full">
//         <div>
//           {{!isOpen&&<button className="p-4 text-white" onClick={() => setIsOpen(!isOpen)}>
//             {isOpen ? 'Close' : <ClosingArrowButton />}
//           </button>}}
//           <ul className="mt-4">
//             {!isOpen && SidebarDataList.map((item, index) => (
//               <li
//                 key={index}
//                 className={`flex items-center p-4 hover:bg-gray-700 cursor-pointer ${!isOpen && 'justify-center'}`}
//               >
//                 {item.icon}
//                 {/* {isOpen && <span className="ml-4">{item.label}</span>} */}
//               </li>
//             ))}
//              {isOpen && 
//               <li
//               className={`flex items-center p-4 hover:bg-gray-700 cursor-pointer ${!isOpen && 'justify-center'}`}
//               >
//                 <NewChatIcon />
//               </li>}
//           </ul>
//         </div>



//         {!isOpen && (
//           <button className="p-4 hover:bg-gray-700 cursor-pointer" onClick={() => setIsOpen(true)}>
//             <ClosingArrowButton />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;