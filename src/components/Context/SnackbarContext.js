import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert, Button } from "@mui/material";
import { saveLikedFormSubmission } from "../../service/mockServer";

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  return context;
};

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [formSubmission, setFormSubmission] = useState(null);
  const [likedLoader, setLikedLoader] = useState(false);

  const showMessage = (msg, sev = "info", submission = null) => {
    setMessage(msg);
    setSeverity(sev);
    setFormSubmission(submission);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormSubmission(null);
  };

  const handleLike = async () => {
    if (!formSubmission) return;
    setLikedLoader(true);
    try {
      const updated = {
        ...formSubmission,
        data: { ...formSubmission.data, liked: true },
      };
      await saveLikedFormSubmission(updated);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      handleClose();
      setLikedLoader(false);
    }
  };

  return (
    <SnackbarContext.Provider value={{ showMessage, likedLoader }}>
      {children}
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert
          severity={severity}
          onClose={handleClose}
          action={
            <>
              <Button color="inherit" size="small" onClick={handleLike}>
                Like
              </Button>
              <Button color="inherit" size="small" onClick={handleClose}>
                Dismiss
              </Button>
            </>
          }
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
