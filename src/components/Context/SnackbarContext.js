import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert, Button, Slide, CircularProgress } from "@mui/material";
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
  const [snackbars, setSnackbars] = useState([]);
  const [likedLoaders, setLikedLoaders] = useState({});
  const [likedVersion, setLikedVersion] = useState(0);

  const showMessage = (
    message,
    severity = "info",
    formSubmission = null,
    type = "fetch"
  ) => {
    const id = Date.now() + Math.random();
    const newSnackbar = {
      id,
      message,
      severity,
      formSubmission,
      open: true,
      type,
    };
    setSnackbars((prev) => [...prev, newSnackbar]);
  };

  const setLoaderForId = (id, value) => {
    setLikedLoaders((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleClose = (id) => (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbars((prev) =>
      prev.map((s) => (s.id === id ? { ...s, open: false } : s))
    );
  };

  const handleExited = (id) => {
    setSnackbars((prev) => prev.filter((s) => s.id !== id));
    setLikedLoaders((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleLike = async (id, formSubmission) => {
    if (!formSubmission) return;

    setLoaderForId(id, true);
    try {
      const updated = {
        ...formSubmission,
        data: { ...formSubmission.data, liked: true },
      };
      await saveLikedFormSubmission(updated);
      setLikedVersion((prev) => prev + 1);
    } catch (err) {
      showMessage("Failed to save Like.", "error", formSubmission, "save");
    } finally {
      setLoaderForId(id, false);
    }
  };

  const handleRetry = (snackbar) => {
    if (snackbar.type === "save") {
      handleLike(snackbar.id, snackbar.formSubmission);
    } else {
      setLikedVersion((prev) => prev + 1);
    }
  };

  return (
    <SnackbarContext.Provider value={{ showMessage, likedVersion }}>
      {children}
      {snackbars.map((snackbar) => (
        <Snackbar
          key={snackbar.id}
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={handleClose(snackbar.id)}
          onExited={() => handleExited(snackbar.id)}
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
            severity={snackbar.severity}
            onClose={handleClose(snackbar.id)}
            variant="filled"
            iconMapping={{
              success: <span style={{ fontSize: 22 }}>✅</span>,
              error: <span style={{ fontSize: 22 }}>❌</span>,
              warning: <span style={{ fontSize: 22 }}>⚠️</span>,
              info: <span style={{ fontSize: 22 }}>ℹ️</span>,
            }}
            action={
              <>
                {snackbar.severity === "error" ? (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => handleRetry(snackbar)}
                    sx={{ fontWeight: "bold" }}
                  >
                    Refresh
                  </Button>
                ) : (
                  <>
                    {snackbar.severity !== "success" && (
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() =>
                          handleLike(snackbar.id, snackbar.formSubmission)
                        }
                        disabled={likedLoaders[snackbar.id] || false}
                        sx={{ fontWeight: "bold" }}
                        startIcon={
                          likedLoaders[snackbar.id] ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : null
                        }
                      >
                        Like
                      </Button>
                    )}
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleClose(snackbar.id)}
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
            {snackbar.message}
          </Alert>
        </Snackbar>
      ))}
    </SnackbarContext.Provider>
  );
};
