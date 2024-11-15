import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import { LLM_LIST } from "@/lib/models/llm/llm-list"
import { cn } from "@/lib/utils"
import { Tables } from "@/supabase/types"
import { LLM, LLMID, MessageImage, ModelProvider } from "@/types"
import {
  IconBolt,
  IconCaretDownFilled,
  IconCaretRightFilled,
  IconCircleFilled,
  IconFileText,
  IconMoodSmile,
  IconPencil
} from "@tabler/icons-react"
import Image from "next/image"
import { FC, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { ModelIcon } from "../models/model-icon"
import { Button } from "../ui/button"
import { FileIcon } from "../ui/file-icon"
import { FilePreview } from "../ui/file-preview"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { WithTooltip } from "../ui/with-tooltip"
import { MessageActions } from "./message-actions"
import { MessageMarkdown } from "./message-markdown"
import {Robot} from "../Shapes/robot"

const ICON_SIZE = 32

// Add 'className' to the props definition of MessageMarkdown
interface MessageMarkdownProps {
  content: string;
  className?: string; // Add this line to make it accept className as an optional prop
}

// MessageMarkdown component
// export const MessageMarkdown: FC<MessageMarkdownProps> = ({ content, className }) => {
//   return (
//     <div className={cn("markdown", className)}>
//       {/* Render markdown content */}
//       {content}
//     </div>
//   );
// };


interface MessageProps {
  message: Tables<"messages">
  fileItems: Tables<"file_items">[]
  isEditing: boolean
  isLast: boolean
  onStartEdit: (message: Tables<"messages">) => void
  onCancelEdit: () => void
  onSubmitEdit: (value: string, sequenceNumber: number) => void
}

export const Message: FC<MessageProps> = ({
  message,
  fileItems,
  isEditing,
  isLast,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit
}) => {
  const {
    assistants,
    profile,
    isGenerating,
    setIsGenerating,
    firstTokenReceived,
    availableLocalModels,
    availableOpenRouterModels,
    chatMessages,
    selectedAssistant,
    chatImages,
    assistantImages,
    toolInUse,
    files,
    models
  } = useContext(ChatbotUIContext)

  const { handleSendMessage } = useChatHandler()

  const editInputRef = useRef<HTMLTextAreaElement>(null)

  const [isHovering, setIsHovering] = useState(false)
  const [editedMessage, setEditedMessage] = useState(message.content)

  const [showImagePreview, setShowImagePreview] = useState(false)
  const [selectedImage, setSelectedImage] = useState<MessageImage | null>(null)

  const [showFileItemPreview, setShowFileItemPreview] = useState(false)
  const [selectedFileItem, setSelectedFileItem] =
    useState<Tables<"file_items"> | null>(null)

  const [viewSources, setViewSources] = useState(false)

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message.content)
    } else {
      const textArea = document.createElement("textarea")
      textArea.value = message.content
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }
  }

  const handleSendEdit = () => {
    onSubmitEdit(editedMessage, message.sequence_number)
    onCancelEdit()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isEditing && event.key === "Enter" && event.metaKey) {
      handleSendEdit()
    }
  }

  const handleRegenerate = async () => {
    setIsGenerating(true)
    await handleSendMessage(
      editedMessage || chatMessages[chatMessages.length - 2].message.content,
      chatMessages,
      true
    )
  }

  const handleStartEdit = () => {
    onStartEdit(message)
  }

  useEffect(() => {
    setEditedMessage(message.content)

    if (isEditing && editInputRef.current) {
      const input = editInputRef.current
      input.focus()
      input.setSelectionRange(input.value.length, input.value.length)
    }
  }, [isEditing])

  const MODEL_DATA = [
    ...models.map(model => ({
      modelId: model.model_id as LLMID,
      modelName: model.name,
      provider: "custom" as ModelProvider,
      hostedId: model.id,
      platformLink: "",
      imageInput: false
    })),
    ...LLM_LIST,
    ...availableLocalModels,
    ...availableOpenRouterModels
  ].find(llm => llm.modelId === message.model) as LLM

  const messageAssistantImage = assistantImages.find(
    image => image.assistantId === message.assistant_id
  )?.base64

  const selectedAssistantImage = assistantImages.find(
    image => image.path === selectedAssistant?.image_path
  )?.base64

  const modelDetails = LLM_LIST.find(model => model.modelId === message.model)

  const fileAccumulator: Record<
    string,
    {
      id: string
      name: string
      count: number
      type: string
      description: string
    }
  > = {}

  const fileSummary = fileItems.reduce((acc, fileItem) => {
    const parentFile = files.find(file => file.id === fileItem.file_id)
    if (parentFile) {
      if (!acc[parentFile.id]) {
        acc[parentFile.id] = {
          id: parentFile.id,
          name: parentFile.name,
          count: 1,
          type: parentFile.type,
          description: parentFile.description
        }
      } else {
        acc[parentFile.id].count += 1
      }
    }
    return acc
  }, fileAccumulator)

  return (
    <div className="flex justify-center"> {/* Wrap in flex container */}
      <div className="w-full max-w-5xl mx-4"> {/* Add margins and max width */}
        <div
          className={cn(
            "flex w-full",
            message.role === "user" ? "justify-end" : "justify-start","p-2" ,
            // message.role === "user" ? "" : "bg-secondary"
          )}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onKeyDown={handleKeyDown}
        >
          <div
            className={cn(
              "relative flex w-full flex-col p-9",
              message.role === "user" ? "items-end text-left" : "items-start text-left",
              "sm:w-[750px] sm:px-0 md:w-[750px] lg:w-[750px] xl:w-[860px]",
             
            )}
          >
            <div
              className={cn(
                "absolute mr-[200px] my-2 itms-center",
                message.role === "user" ? "left-0 top-1/2 transform -translate-y-1/2" : "left-5 bottom-0 sm:left-0 mx-9"
              )}
            >
              <MessageActions
                onCopy={handleCopy}
                onEdit={handleStartEdit}
                isAssistant={message.role === "assistant"}
                isLast={isLast}
                isEditing={isEditing}
                isHovering={isHovering}
                onRegenerate={handleRegenerate}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                {message.role === "assistant" ? (
                  messageAssistantImage ? (
                    <Image
                      style={{
                        width: `${ICON_SIZE}px`,
                        height: `${ICON_SIZE}px`
                      }}
                      className="rounded"
                      src={messageAssistantImage}
                      alt="assistant image"
                      height={ICON_SIZE}
                      width={ICON_SIZE}
                    />
                  ) : (
                    <WithTooltip
                      display={<div>{MODEL_DATA?.modelName}</div>}
                      trigger={
                        <ModelIcon
                          provider={modelDetails?.provider || "custom"}
                          height={ICON_SIZE}
                          width={ICON_SIZE}
                        />
                      }
                    />
                  )
                ) : null}
                <div className="font-semibold flex items-center">
                  {message.role === "assistant" ? (
                    <div className="flex space-x-2">
                      <Robot style={{ marginBottom:"10px"}}/>
                      <div className="text-md">
                      <MessageMarkdown content={message.content} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex space-x-2 mr-4 items-center">

                    <div className="bg-secondary fg-secondary rounded-lg shadow-md max-w-[700px] min-w-[700px] text-md mr-4 ml-4  flex p-4 items-center">
                      <MessageMarkdown content={message.content} />
                    </div>

                     { profile?.image_url ? (
                  
                        <Image
                          className={`size-[32px] rounded`}
                          src={profile?.image_url}
                          height={32}
                          width={32}
                          alt="user image"
                          style={{ borderRadius: '50%'}}
                        />

                      ) : (
                        <IconMoodSmile
                          className="bg-primary text-secondary border-primary rounded border-DEFAULT p-1"
                          size={ICON_SIZE}
                        />
                      )}
                      {/* <div className="text-md ml-2 mr-3">
                      {profile?.display_name ?? profile?.username}
                      </div> */}
                    </div>
                   
                  )}
              </div>
             </div>

              {!firstTokenReceived && isGenerating && isLast && message.role === "assistant" ? (
                <>
                  {(() => {
                    switch (toolInUse) {
                      case "none":
                        return <IconCircleFilled className="animate-pulse" size={8} />
                      default:
                        return null
                    }
                  })()}
                </>
              ) : isEditing ? (
                <>
                  <TextareaAutosize
                    className="resize-none overflow-hidden bg-secondary p-3 text-sm leading-normal focus:outline-none mx-9"
                    value={editedMessage}
                    textareaRef={editInputRef}
                    onValueChange={setEditedMessage}
                  />
                  <Button className="mt-3 ml-auto" onClick={handleSendEdit} variant="primary">
                    Save
                  </Button>
                  <Button className="mt-3" onClick={onCancelEdit} variant="ghost">
                    Cancel
                  </Button>
                </>
              ) : null }
            </div>



              {/* Display associated files */}
              {Object.keys(fileSummary).map(fileId => (
                <div
                  key={fileId}
                  onClick={() =>
                    setSelectedFileItem(
                      fileItems.find(fileItem => fileItem.file_id === fileId) || null
                    )
                  }
                  className="flex cursor-pointer items-center space-x-2 bg-secondary hover:bg-secondary-dark p-2 rounded-md"
                >
                  <FileIcon
                    className="rounded-md"
                    type={fileSummary[fileId].type}
                  />
                  <div className="truncate">{fileSummary[fileId].name}</div>
                  <div className="text-xs text-muted">
                    ({fileSummary[fileId].count})
                  </div>
                </div>
              ))}
            </div>
                 
           {/* Shaded bar beneath user's inquiry
        {message.role === "user" && (
          <div className="mt-4 bg-gray-400 rounded-md" style={{ height: "4px", width: "90%", marginLeft: "auto" }} />
        )} */}
      
        </div>
       
      </div>
    </div>
  )
}
