import { FC, useContext, useEffect, useState } from "react";
import {
  IconCheck,
  IconCopy,
  IconRepeat,
  IconThumbUp,
  IconThumbDown,
  IconX,
  IconEdit,
  IconThumbUpFilled,
  IconThumbDownFilled,
  IconMessageCircle,
} from "@tabler/icons-react";
import { WithTooltip } from "../ui/with-tooltip"; // Assuming you have this tooltip component already implemented
import VectorIcon from "../Shapes/VectorIcon.js";
import { updateMessageWithFeedback } from "@/db/messages";
import { ChatbotUIContext } from "@/context/context"

export const MESSAGE_ICON_SIZE = 18;

interface MessageActionsProps {
  isAssistant: boolean;
  isLast: boolean;
  isEditing: boolean;
  isHovering: boolean;
  onCopy: () => void;
  onEdit: () => void;
  onRegenerate: () => void;
}

export const MessageActions: FC<MessageActionsProps> = ({
  isAssistant,
  isLast,
  isEditing,
  isHovering,
  onCopy,
  onEdit,
  onRegenerate,
}) => {
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [thumbsUpClicked, setThumbsUpClicked] = useState(false);
  const [thumbsDownClicked, setThumbsDownClicked] = useState(false);
  const [comment, setComment] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [wasThumbsUpClickedBefore, setWasThumbsUpClickedBefore] = useState(false);
  const [wasThumbsDownClickedBefore, setWasThumbsDownClickedBefore] = useState(false);
  const {chatMessages, setChatMessages } = useContext(ChatbotUIContext)


  const handleCopy = () => {
    onCopy();
    setShowCheckmark(true);
  };

  const handleThumbDown = async () => {
    setThumbsDownClicked((prev) => {
      if (prev) {
        setAlertMessage("Do you want to cancel your response?");
      } else if (thumbsUpClicked) {
        setAlertMessage(
          "You previously liked this response. Do you want to change your feedback to dislike?"
        );
        setThumbsUpClicked(false);
      } else {
        setAlertMessage("Please explain why you disliked this response...");
      }
      if (!prev) {
        setWasThumbsDownClickedBefore(true);
        setWasThumbsUpClickedBefore(false); 

      }
      return !prev;
    });
    setShowCommentBox((prev) => !prev);
//     try{
//     // const updatedMessage = await updateMessageWithFeedback(chatMessages[0].id ,{thumbsUpClicked,thumbsDownClicked,null});
//     console.log("Message updated successfully:", updatedMessage);
// } catch (error) {
//   console.error("Error updating message:", error);
// }
  };

    const handleThumbUp = () => {
      setThumbsUpClicked((prev) => {
        if (prev) {
          setAlertMessage("Do you want to cancel your response?");
        } else if (thumbsDownClicked) {
          setAlertMessage(
            "You previously disliked this response. Do you want to change your feedback to like?"
          );
          setThumbsDownClicked(false);
        } else {
          setAlertMessage("Please explain why you liked this response...");
        }
        
        // Track if thumbs-up was clicked before opening comment box
        if (!prev) {
          setWasThumbsUpClickedBefore(true);
          setWasThumbsDownClickedBefore(false);
        }
        
        return !prev;
      });
      setShowCommentBox((prev) => !prev);
    };

  const handleCloseCommentBox = () => {
    // Restore thumbs-up if it was clicked before opening the comment box
    if (wasThumbsUpClickedBefore) {
      setThumbsUpClicked(true);
    }
    if (wasThumbsDownClickedBefore) {
      setThumbsDownClicked(true);
    }
    setShowCommentBox(false);
    setEditingComment(false);
    setAlertMessage(null);
    setWasThumbsUpClickedBefore(false); // Reset tracking state
  };
  

  const handleSubmitComment = () => {
    // Add your submit logic here (e.g., send the comment to the backend)
    setShowCommentBox(false);
    setEditingComment(false);
    setAlertMessage(null);
  };

  const handleEditComment = () => {
    setShowCommentBox(true);
    setEditingComment(true);
  };

  useEffect(() => {
    if (showCheckmark) {
      const timer = setTimeout(() => {
        setShowCheckmark(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showCheckmark]);

  return isLast || isHovering ? (
    <div className="relative flex items-center space-x-2 text-gray-300">
      {!isAssistant && isHovering && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>Edit</div>}
          trigger={
            <IconEdit
              className="cursor-pointer hover:opacity-50"
              size={MESSAGE_ICON_SIZE}
              onClick={onEdit}
            />
          }
        />
      )}

      {(!isAssistant && isHovering) && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>Copy</div>}
          trigger={
            showCheckmark ? (
              <IconCheck size={MESSAGE_ICON_SIZE} />
            ) : (
              <IconCopy
                className="cursor-pointer hover:opacity-50"
                size={MESSAGE_ICON_SIZE}
                onClick={handleCopy}
              />
            )
          }
        />
      )}

      {isLast && (
        <>
          <WithTooltip
            delayDuration={1000}
            side="bottom"
            display={<div>Copy</div>}
            trigger={
              showCheckmark ? (
                <IconCheck size={MESSAGE_ICON_SIZE} />
              ) : (
                <IconCopy
                  className="cursor-pointer hover:opacity-50"
                  size={MESSAGE_ICON_SIZE}
                  onClick={handleCopy}
                />
              )
            }
          />
          <WithTooltip
            delayDuration={1000}
            side="bottom"
            display={<div>Regenerate</div>}
            trigger={
              <IconRepeat
                className="cursor-pointer hover:opacity-50"
                size={MESSAGE_ICON_SIZE}
                onClick={onRegenerate}
              />
            }
          />
          <WithTooltip
            delayDuration={1000}
            side="bottom"
            display={<div>Thumbs Up</div>}
            trigger={
              thumbsUpClicked ? (
                <IconThumbUpFilled
                  className="cursor-pointer hover:opacity-50"
                  size={MESSAGE_ICON_SIZE}
                  onClick={handleThumbUp}
                />
              ) : (
                <IconThumbUp
                  className="cursor-pointer hover:opacity-50"
                  size={MESSAGE_ICON_SIZE}
                  onClick={handleThumbUp}
                />
              )
            }
          />
          <WithTooltip
            delayDuration={1000}
            side="bottom"
            display={<div>Thumbs Down</div>}
            trigger={
              thumbsDownClicked ? (
                <IconThumbDownFilled
                  className="cursor-pointer hover:opacity-50"
                  size={MESSAGE_ICON_SIZE}
                  onClick={handleThumbDown}
                />
              ) : (
                <IconThumbDown
                  className="cursor-pointer hover:opacity-50"
                  size={MESSAGE_ICON_SIZE}
                  onClick={handleThumbDown}
                />
              )
            }
          />
          {comment && (
            <WithTooltip
              delayDuration={1000}
              side="bottom"
              display={<div>Edit Comment</div>}
              trigger={
                <IconMessageCircle
                  className="cursor-pointer hover:opacity-50"
                  size={MESSAGE_ICON_SIZE}
                  onClick={handleEditComment}
                />
              }
            />
          )}
        </>
      )}

      {/* Comment Box */}
      {showCommentBox && (
        <div className="absolute top-0 mt-10 left-0 z-50 p-4 bg-gray-100 rounded shadow-lg w-72">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={handleCloseCommentBox}
          >
            <IconX size={MESSAGE_ICON_SIZE} />
          </button>
          {alertMessage && (
            <div className="mb-2 text-sm text-gray-700">{alertMessage}</div>
          )}
          <textarea
            className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            // placeholder="Please explain why you liked/disliked this response..."
            rows={3}
            value={comment || ""}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleSubmitComment}
            >
              {editingComment ? "Update Comment" : "Submit Comment"}
            </button>
          </div>
        </div>
      )}
    </div>
  ) : null;
};
