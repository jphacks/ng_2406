"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Image from "next/image";
import { CHARACTER_OPTIONS } from "@/constants/theme";

type HeaderProps = {
  character: number;
  onCharacterChange: (index: number) => void;
};

const Header = ({ character, onCharacterChange }: HeaderProps) => {
  const [openHandout, setOpenHandout] = useState(false);

  const handleLogoClick = () => {
    onCharacterChange(0);
    window.location.href = "/";
  };

  const selectedCharacter = CHARACTER_OPTIONS[character] || CHARACTER_OPTIONS[0];

  return (
    <>
      <AppBar position="fixed" color="default" elevation={2} sx={{ width: "100%" }}>
        <Toolbar>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <Typography variant="h6" component="div">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={selectedCharacter.alt}
                src={selectedCharacter.logoSrc}
                style={{
                  height: "40px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
                onClick={handleLogoClick}
              />
            </Typography>
            <Button onClick={() => setOpenHandout(true)}>つかいかた</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog open={openHandout} onClose={() => setOpenHandout(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <Image
            src="/handout.png"
            alt="使い方"
            width={2179}
            height={3147}
            sizes="(max-width: 900px) 100vw, 900px"
            style={{ width: "100%", height: "auto" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHandout(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
