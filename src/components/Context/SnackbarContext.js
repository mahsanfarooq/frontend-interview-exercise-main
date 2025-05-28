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
  const [isChanged, setIsChanged] = useState(false);

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
    try {
      const updated = {
        ...formSubmission,
        data: { ...formSubmission.data, liked: true },
      };
      await saveLikedFormSubmission(updated);
      setIsChanged(true);
      setTimeout(() => {
        setIsChanged(false);
      }, 1000);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      handleClose();
    }
  };

  return (
    <SnackbarContext.Provider value={{ showMessage, isChanged }}>
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
