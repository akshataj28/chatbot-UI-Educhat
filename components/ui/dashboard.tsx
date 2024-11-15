"use client"

import { Sidebar } from "@/components/sidebar/sidebar"
import { SidebarSwitcher } from "@/components/sidebar/sidebar-switcher"
import { Button } from "@/components/ui/button"
import { Tabs } from "@/components/ui/tabs"
import useHotkey from "@/lib/hooks/use-hotkey"
import { cn } from "@/lib/utils"
import { ActivePage, ContentType } from "@/types"
import { IconChevronCompactRight } from "@tabler/icons-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC, useContext, useEffect, useState } from "react"
import { useSelectFileHandler } from "../chat/chat-hooks/use-select-file-handler"
import { CommandK } from "../utility/command-k"
import { UserProfileSettings } from "../utility/UserProfileSettings"
import { useChatHandler } from "../chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import { Avatar } from "@mui/material"
import { useTheme } from "next-themes"


export const SIDEBAR_WIDTH = 350

interface DashboardProps {
  children: React.ReactNode
}

export const Dashboard: FC<DashboardProps> = ({ children }) => {
  useHotkey("s", () => setShowSidebar(prevState => !prevState))
  const [activePage, setActivePage] = useState<ActivePage>("chats");
  const handleSettingsClick = () => {
    console.log("Settings clicked!"); // Check if this logs
    setActivePage("settings");
  };
  const {
    profile,
    setProfile,
    
  } = useContext(ChatbotUIContext)

  const handleNewChatClick = () => {
    console.log("NewChat clicked!"); // Check if this logs
    setActivePage("chats");
    handleNewChat();
  };
  const pathname = usePathname()
  const router = useRouter()
  const { theme } = useTheme() 
  const searchParams = useSearchParams()
  const tabValue = searchParams.get("tab") || "chats"

  const { handleSelectDeviceFile } = useSelectFileHandler()
  const { handleNewChat } = useChatHandler()

  const [contentType, setContentType] = useState<ContentType>(
    tabValue as ContentType
  )
  const [showSidebar, setShowSidebar] = useState(
    localStorage.getItem("showSidebar") === "true"
  )
  const [profileImageSrc, setProfileImageSrc] = useState(
    profile?.image_url || <Avatar/> // Use default avatar if no image exists
  );
  const handleProfileImageSave = (newImageSrc: string) => {
    setProfileImageSrc(newImageSrc); // Update the profile image for Sidebar
  };
  
 
  const [displayName, setDisplayName] = useState(profile?.display_name || "username")

  const onSaveProfileSettings = (newDisplayName: string) => {
    setDisplayName(newDisplayName); // Update the displayName state in Dashboard
  };
  const [isDragging, setIsDragging] = useState(false)

  const onFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const files = event.dataTransfer.files
    const file = files[0]

    handleSelectDeviceFile(file)

    setIsDragging(false)
  }

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleToggleSidebar = () => {
    setShowSidebar(prevState => !prevState)
    localStorage.setItem("showSidebar", String(!showSidebar))
  }
  useEffect(() => {
    console.log("Current active page:", activePage);
    if (activePage === "settings") {
      console.log("Active page is settings");
    }
  }, [activePage]);
  
  return (
    <div className="flex size-full">
      <CommandK />

          <div
      className={cn(
        "duration-200 dark:border-none bg-secondary fg-secondary" +
        (showSidebar ? "border-r-2" : "") 
        // ` ${
        //   theme === 'beige' ? 'bg-beige-200 text-black' :
        //   theme === 'light' ? 'bg-white text-black' :
        //   'bg-black text-white'
        // }`
      )}
      style={{
        // Sidebar
        minWidth: showSidebar ? `${SIDEBAR_WIDTH}px` : "70px",
        maxWidth: showSidebar ? `${SIDEBAR_WIDTH}px` : "70px",
        width: showSidebar ? `${SIDEBAR_WIDTH}px` : "70px"
      }}
    >
        {(
          <Tabs
            className="flex h-full"
            // value={activePage}
            // onValueChange={(value) => setActivePage(value as ContentType)}
            value={contentType}
            onValueChange={tabValue => {
              setContentType(tabValue as ContentType)
              router.replace(`${pathname}?tab=${tabValue}`)
            }}
          >
            {/* <SidebarSwitcher onContentTypeChange={setContentType} /> */}

            <Sidebar contentType={contentType} showSidebar={showSidebar} activePage={activePage}  setActivePage={setActivePage} handleNewChatClick={handleNewChatClick} 
            handleSettingsClick={handleSettingsClick} handleToggleSidebar={handleToggleSidebar} profileImageSrc={profileImageSrc} displayName={displayName} />
          </Tabs>
        )}
      </div>
       
      {/* <div
        className="bg-muted/50 relative flex w-screen min-w-[90%] grow flex-col sm:min-w-fit"+` ${
          theme === 'beige' ? 'bg-beige-200 text-black' :
          theme === 'light' ? 'bg-white text-black' :
          'bg-black text-white'
        }`
        // onDrop={onFileDrop}
        // onDragOver={onDragOver}
        // onDragEnter={handleDragEnter}
        // onDragLeave={handleDragLeave}
      > */}

        <div
          className={`relative flex w-screen min-w-[90%] grow flex-col sm:min-w-fit bg-seondary fg-secondary` 
          // ${
          //   theme === 'beige' ? 'bg-beige-200 text-black' :
          //   theme === 'light' ? 'bg-white text-black' :
          //   'bg-black text-white'
          // }`
        }
        >
        {activePage === "settings" ? (
          <UserProfileSettings 
          profileImageSrc={profileImageSrc} 
          onSaveProfileImage={handleProfileImageSave} // Function to handle the image save
          displayName={displayName}
          onSaveDisplayName={onSaveProfileSettings}/>
        ) : (
          children
        )}
 
        {/* <Button
          className={cn(
            "absolute left-[0px] top-[4%] right-[30px] z-10 size-[32px] cursor-pointer" // Changed top to 48%
            )}
          style={{
            // marginLeft: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",

            transform: showSidebar ? "rotate(180deg)" : "rotate(0deg)"
          }}
          variant="ghost"
          size="icon"
          onClick={handleToggleSidebar}
        >
          <IconChevronCompactRight size={24} />
        </Button> */}
      </div>
    </div>
  )
}
