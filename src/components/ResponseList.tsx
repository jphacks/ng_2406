"use client";

import { useState, useRef } from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import XIcon from "@mui/icons-material/X";
import { CHARACTER_OPTIONS, FACE_COLORS } from "@/constants/theme";

type FeedbackItem = {
  face: number;
  action: string;
  feedback: string;
  idx?: number;
};

type SaveState = "saving" | "saved" | "failed";

type ResponseListProps = {
  actions: string[];
  feedbacks: FeedbackItem[];
  diaryUrl: string | null;
  character: number;
  saveState?: SaveState;
};

const ResponseList = ({ actions, feedbacks, diaryUrl, character, saveState = "saved" }: ResponseListProps) => {
  const [tooltipText, setTooltipText] = useState("大切な人に共有");
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const selectedCharacter = CHARACTER_OPTIONS[character] || CHARACTER_OPTIONS[0];
  const selectedFont = selectedCharacter.font;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}?diary=${diaryUrl}`
      : "";

  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  if (!actions || actions.length === 0) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        setTooltipText("コピー完了！");
        setIsTooltipOpen(true);
        if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
        tooltipTimerRef.current = setTimeout(() => {
          setTooltipText("大切な人に共有");
          setIsTooltipOpen(false);
        }, 3000);
      },
      (err) => console.error("クリップボードへのコピーに失敗しました", err)
    );
  };

  const handleXPost = () => {
    const text = encodeURIComponent(
      `安心打診${selectedCharacter.alt}からの伝言です...！ #JPHACKS2024 #安心打診おばあ`
    );
    const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      {(() => {
        const disabled = saveState !== "saved";
        const stateLabel =
          saveState === "saving"
            ? "保存中..."
            : saveState === "failed"
            ? "保存に失敗しました"
            : null;
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={stateLabel ?? "Xでポスト"} placement="left" arrow>
              <span>
                <IconButton
                  onClick={handleXPost}
                  disabled={disabled}
                  sx={{ mr: 1, opacity: disabled ? 0.4 : 1 }}
                >
                  <XIcon style={{ width: 20, height: 20 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip
              title={stateLabel ?? tooltipText}
              placement="right"
              arrow
              open={disabled ? false : isTooltipOpen}
            >
              <span>
                <IconButton
                  onClick={handleShare}
                  disabled={disabled}
                  sx={{ opacity: disabled ? 0.4 : 1 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/share.png" alt="共有" style={{ width: 24, height: 24 }} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        );
      })()}
      {actions.map((action, index) => (
        <Paper key={index} elevation={3} sx={{ p: 2, mt: 2, width: "100%", bgcolor: "#f5f5f5" }}>
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <Avatar
              sx={{
                bgcolor: FACE_COLORS[feedbacks[index]?.face] || FACE_COLORS[3],
                mr: 2,
                width: 56,
                height: 56,
              }}
              src={selectedCharacter.altSrc}
              alt={selectedCharacter.alt}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: selectedFont,
                  "&.MuiTypography-root": { fontFamily: selectedFont },
                }}
              >
                {action}
              </Typography>
              {feedbacks[index] ? (
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: selectedFont,
                    "&.MuiTypography-root": { fontFamily: selectedFont },
                  }}
                >
                  {feedbacks[index].feedback}
                </Typography>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography sx={{ fontFamily: selectedFont }}>
                    フィードバックを読み込み中...
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default ResponseList;
