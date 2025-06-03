import * as React from "react";

import { Avatar, Box, Grow, Typography } from "@mui/material";

import Message from "../model/Message";
import MessageContent from "../model/MessageContent";

/**
 * @interface IChatMessageProps - Interface representing props for a chat message component.
 * @property id - The unique identifier of the message.
 * @property message - The message object.
 * @property showDate - Indicates whether to show the date.
 * @property showTime - Indicates whether to show the time.
 */
interface IChatMessageProps {
  id: string;
  message: Message<MessageContent>;
  showDate: boolean;
  showTime: boolean;
}

export const ChatMessage = ({
  id,
  message,
  showDate,
  showTime,
}: IChatMessageProps) => {
  if (message.deletedAt) {
    return <div id={id} />;
  }

  const dispDate = message.updatedAt ? message.updatedAt : message.createdAt;

  const ChatAvator = (
    <Box
      minWidth={0}
      flexShrink={0}
      ml={message.self ? 1 : 0}
      mr={message.self ? 0 : 1}
    >
      <Avatar alt={message.username} src={message.avatar} />
    </Box>
  );

  const ChatUsername = (
    <Box maxWidth="100%" mx={1}>
      <Typography variant="body2" align={message.self ? "right" : "left"}>
        {message.username}
      </Typography>
    </Box>
  );

  const ChatDate = (
    <Box maxWidth="100%" mx={1}>
      <Typography
        variant="body2"
        align={message.self ? "right" : "left"}
        color="textSecondary"
      >
        {dispDate?.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Typography>
    </Box>
  );

  return (
    <Grow in>
      <Box maxWidth="100%" display="flex" flexDirection="column" pb={1}>
        {showDate && (
          <Typography align="center">
            {dispDate?.toLocaleDateString()}
          </Typography>
        )}
        <Box
          id={id}
          maxWidth="100%"
          pl={message.self ? "20%" : 0}
          pr={message.self ? 0 : "20%"}
          mb={1}
          pb={1}
          display="flex"
          justifyContent={message.self ? "flex-end" : "flex-start"}
          style={{ overflowWrap: "break-word" }}
        >
          {message.avatar && !message.self && ChatAvator}
          <Box minWidth={0} display="flex" flexDirection="column">
            {message.username && ChatUsername}
            <Box
              maxWidth="100%"
              py={3}
              px={2}
              bgcolor={message.self ? "primary.main" : "background.paper"}
              color={message.self ? "primary.contrastText" : "text.primary"}
              borderRadius={4}
              boxShadow={2}
            >
              {message.type === "text" && (
                <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
                  {message.content}
                </Typography>
              )}
              {message.type === "jsx" && <div>{message.content}</div>}
            </Box>
            {showTime && ChatDate}
          </Box>
          {message.avatar && message.self && ChatAvator}
        </Box>
      </Box>
    </Grow>
  );
};

export default ChatMessage;
