// "use client";

// import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler";
// import { usePathname, useSearchParams, useRouter } from "next/navigation";
// import { FC, useState } from "react";
// import { Button } from "../ui/button";
// import NewChatIcon from "../Shapes/NewChatIcon";
// import ClosingArrowButton from "../Shapes/ClosingArrowButton";
// import useHotkey from "@/lib/hooks/use-hotkey";
// import { ContentType } from "@/types";

// interface ToggleSidebarProps {}

// export const ToggleSidebar: FC<ToggleSidebarProps> = () => {
//   useHotkey(";", () => setOpen((prevState) => !prevState));

//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const tabValue = searchParams.get("tab") || "chats";
//   const [contentType, setContentType] = useState<ContentType>(
//     tabValue as ContentType
//   );
//   const { handleNewChat } = useChatHandler();
//   const router = useRouter();

//   const [showSidebar, setShowSidebar] = useState(
//     localStorage.getItem("showSidebar") === "true"
//   );

//   const handleToggleSidebar = () => {
//     setShowSidebar((prevState) => !prevState);
//     localStorage.setItem("showSidebar", String(!showSidebar));
//   };

//   return (
//     <>
//       <Button
//         className="flex w-full items-center space-x-2"
//         variant="ghost"
//         size="icon"
//         onClick={handleNewChat}
//         style={{
//           marginRight: "100px",
//         }}
//       >
//         <NewChatIcon />
//       </Button>

//       <Button
//         style={{
//           marginLeft: "140px",
//           transform: showSidebar ? "rotate(0deg)" : "rotate(180deg)",
//         }}
//         variant="ghost"
//         size="icon"
//         onClick={handleToggleSidebar}
//       >
//         <ClosingArrowButton />
//       </Button>
//     </>
//   );
// };
// function setOpen(arg0: (prevState: any) => boolean): void {
//     throw new Error("Function not implemented.");
// }

