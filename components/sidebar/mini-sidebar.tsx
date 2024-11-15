import { FC } from "react"
import { Button } from "../ui/button"
import { IconPlus, IconUser, IconSettings, IconChevronRight } from "@tabler/icons-react"
import NewChatIcon from "../Shapes/NewChatIcon"
import Robot from "../Shapes/robot"

interface SidebarMiniProps {
  onOpen: () => void
  onNewChat: () => void
}

export const SidebarMini: FC<SidebarMiniProps> = ({ onOpen, onNewChat }) => {
  return (
    <div className="flex flex-col items-center h-full py-4 space-y-6 bg-gray-900">
      {/* Logo */}
      <div className="mb-4">
        <Robot />
      </div>

      {/* New Chat */}
      <Button variant="ghost" size="icon" onClick={onNewChat}>
        <NewChatIcon />
      </Button>

      {/* User Profile */}
      <Button variant="ghost" size="icon">
        <IconUser className="w-6 h-6 text-white" />
      </Button>

      {/* Settings */}
      <Button variant="ghost" size="icon">
        <IconSettings className="w-6 h-6 text-white" />
      </Button>

      {/* Expand Sidebar */}
      <Button variant="ghost" size="icon" onClick={onOpen}>
        <IconChevronRight className="w-6 h-6 text-white" />
      </Button>
    </div>
  )
}
