import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert, Button, Slide } from "@mui/material";
import { saveLikedFormSubmission } from "../../service/mockServer";

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  return context;
};

const SlideTransition = (props) => {
  return <Slide {...props} direction="left" />;
};

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [formSubmission, setFormSubmission] = useState(null);
  const [likedLoader, setLikedLoader] = useState(false);
  const [likedVersion, setLikedVersion] = useState(0);
  const [type, setType] = useState('fetch');

  const showMessage = (msg, sev = "info", submission = null, type = 'fetch') => {
    setMessage(msg);
    setSeverity(sev);
    setFormSubmission(submission);
    setOpen(true);
    setType(type);
  };

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    setFormSubmission(null);
  };

  const handleLike = async () => {
    console.log('formSubmission',formSubmission)
    if (!formSubmission) return;
    try {
      setLikedLoader(true);
      const updated = {
        ...formSubmission,
        data: { ...formSubmission.data, liked: true },
      };
      await saveLikedFormSubmission(updated);
      setLikedVersion((prev) => prev + 1);
      setLikedLoader(false);
      showMessage("New Like Saved!", "success");
    } catch (err) {
      setLikedLoader(false);
      setFormSubmission(formSubmission)
      if (open) setOpen(false);
      setTimeout(() => {
        showMessage("Failed to save Like.", "error", null, 'save');
      }, 100);
      setTimeout(() => {
        handleLike()
      }, 3000);
    }
  };
  const handleRetry = () => {
    if (type === 'save') {
      handleLike();
    } else {
      setLikedVersion((prev) => prev + 1);
    }

    if (open) setOpen(false);
  }

  return (
    <SnackbarContext.Provider value={{ showMessage, likedLoader, likedVersion }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={SlideTransition}
        sx={{
          mt: 8,
          "& .MuiSnackbarContent-root": {
            borderRadius: "8px",
            boxShadow:
              "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
            maxWidth: 400,
          },
        }}
      >
        <Alert
          severity={severity}
          onClose={handleClose}
          variant="filled"
          iconMapping={{
            success: <span style={{ fontSize: 22 }}>✅</span>,
            error: <span style={{ fontSize: 22 }}>❌</span>,
            warning: <span style={{ fontSize: 22 }}>⚠️</span>,
            info: <span style={{ fontSize: 22 }}>ℹ️</span>,
          }}
          action={
            <>
              {severity === "error" ? (
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    handleRetry();
                  }}
                  sx={{ fontWeight: "bold" }}
                >
                  Refresh
                </Button>
              ) : (
                <>
                  {severity !== "success" && (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleLike}
                      disabled={likedLoader}
                      sx={{ fontWeight: "bold" }}
                    >
                      {likedLoader ? "Saving..." : "Like"}
                    </Button>
                  )}
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleClose}
                    sx={{ fontWeight: "bold" }}
                  >
                    Dismiss
                  </Button>
                </>
              )}
            </>
          }

          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: 600,
            fontSize: "1rem",
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
