import { CSSProperties } from "react";

export const SessionViewTheme = {
  colors: {
    chatTopBar: "#40799d",
    chatBackground: "#FFFFF0",
    chatText: "#221f20",
    currentUserBubble: "#fefff1",
    otherUserBubble: "#5298c8",
    currentUserText: "#000000",
    otherUserText: "#ffffff",
  },
  fonts: {
    primary: "'Segoe UI', system-ui, sans-serif",
  },
};

export const getChatContainerStyleOut = (): CSSProperties => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  position: "relative",
  alignItems: "baseline",
  fontFamily: SessionViewTheme.fonts.primary,
});

export const getChatContainerStyle = (): CSSProperties => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  fontFamily: SessionViewTheme.fonts.primary,
});

export const getChatContainerTopBar = (): CSSProperties => ({
  height: "20px",
  width: "100%",
  backgroundColor: SessionViewTheme.colors.chatTopBar,
  border: "1px solid black",
  marginBottom: "1px",
});

export const getChatContainerBottomCard = (): CSSProperties => ({
  padding: "16px",
  backgroundColor: SessionViewTheme.colors.chatBackground,
  color: SessionViewTheme.colors.chatText,
  boxShadow: "0 0 0 1px white",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  height: "100%",
  overflowY: "auto",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
});

export const getTitleStyle = (): CSSProperties => ({
  fontSize: "12px",
  textAlign: "center",
  fontFamily: SessionViewTheme.fonts.primary,
});

export const getMessageWrapperStyle = (
  isCurrentUser: boolean,
): CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  alignItems: isCurrentUser ? "flex-end" : "flex-start",
  maxWidth: "70%",
  alignSelf: isCurrentUser ? "flex-end" : "flex-start",
  gap: "8px",
  fontFamily: SessionViewTheme.fonts.primary,
});

export const getUsernameStyle = (isCurrentUser: boolean): CSSProperties => ({
  fontSize: "12px",
  fontWeight: "600",
  color: "rgba(0, 0, 0, 0.7)",
  marginBottom: "4px",
  paddingLeft: isCurrentUser ? "0" : "12px",
  paddingRight: isCurrentUser ? "12px" : "0",
  textAlign: isCurrentUser ? "right" : "left",
  fontFamily: SessionViewTheme.fonts.primary,
});

export const getMessageBubbleStyle = (
  isCurrentUser: boolean,
): CSSProperties => ({
  padding: "16px 20px",
  borderRadius: isCurrentUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
  background: isCurrentUser
    ? SessionViewTheme.colors.currentUserBubble
    : SessionViewTheme.colors.otherUserBubble,
  color: isCurrentUser
    ? SessionViewTheme.colors.currentUserText
    : SessionViewTheme.colors.otherUserText,
  wordWrap: "break-word",
  fontSize: "15px",
  lineHeight: "1.6",
  fontWeight: "bold",
  border: isCurrentUser
    ? "1px solid #000"
    : "1px solid rgba(255, 255, 255, 0.1)",
  position: "relative",
  fontFamily: SessionViewTheme.fonts.primary,
});
