"use client";
import type { FC } from "react";
import { useState } from "react";
import ShareIcon from "@mui/icons-material/Share";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface Props {
  id: string;
}

const ShareLit: FC<Props> = ({ id }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [url] = useState<string>(
    new URL(`/${id}`, window.location.origin).toString()
  );

  return (
    <>
      <IconButton aria-label="share" onClick={() => setOpen(() => true)}>
        <ShareIcon />
      </IconButton>
      <Dialog
        maxWidth={"sm"}
        fullWidth
        open={open}
        onClose={() => setOpen(() => false)}
      >
        <DialogTitle>Share</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={url}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={async () => {
                    navigator.clipboard.writeText(url).catch();
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
              ),
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareLit;
