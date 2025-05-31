import React, { createContext, useContext, useState } from "react";
import { Alert, Button, Slide, CircularProgress } from "@mui/material";
import { saveLikedFormSubmission } from "../../service/mockServer";

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  return context;
};

const SlideTransition = ({ in: inProp, children, onExited }) => (
  <Slide
    in={inProp}
    direction="left"
    mountOnEnter
    unmountOnExit
    timeout={300}
    onExited={onExited}
  >
    <div>{children}</div>
  </Slide>
);

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

    setTimeout(() => {
      setSnackbars((prev) =>
        prev.map((s) => (s.id === id ? { ...s, open: false } : s))
      );
    }, 10000);
    return id;
  };

  const setLoaderForId = (id, value) => {
    setLikedLoaders((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleExited = (id) => {
    setSnackbars((prev) => prev.filter((s) => s.id !== id));
    setLikedLoaders((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };
  const handleClose = (id) => (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbars((prev) =>
      prev.map((s) => (s.id === id ? { ...s, open: false } : s))
    );
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
      handleClose(id)();
    } catch (err) {
      handleClose(id)();
      let failedSnackID = showMessage(`Failed to save Like for ${formSubmission?.data?.firstName} ${formSubmission?.data?.lastName}`, "error", formSubmission, "save");
      setTimeout(() => {
        handleClose(failedSnackID)();
        handleLike(id, formSubmission);
      }, 3000);
    } finally {
      setLoaderForId(id, false);
    }
  };

  const handleRetry = (snackbar) => {
    handleClose(snackbar.id)();
    if (snackbar.type === "save") {
      handleLike(snackbar.id, snackbar.formSubmission);
    } else {
      setLikedVersion((prev) => prev + 1);
    }
  };

  return (
    <SnackbarContext.Provider value={{ showMessage, likedVersion, handleClose }}>
      {children}

      <div
        style={{
          position: "fixed",
          top: 64,
          right: 16,
          zIndex: 1400,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 400,
        }}
      >
        {snackbars.map((snackbar) => (
          <SlideTransition
            key={snackbar.id}
            in={snackbar.open}
            onExited={() => handleExited(snackbar.id)}
          >
            <Alert
              severity={snackbar.severity}
              variant="filled"
              onClose={() =>
                setSnackbars((prev) =>
                  prev.map((s) =>
                    s.id === snackbar.id ? { ...s, open: false } : s
                  )
                )
              }
              iconMapping={{
                success: <span style={{ fontSize: 22 }}>✅</span>,
                error: <span style={{ fontSize: 22 }}>❌</span>,
                warning: <span style={{ fontSize: 22 }}>⚠️</span>,
                info: <span style={{ fontSize: 22 }}>ℹ️</span>,
              }}
              sx={{
                borderRadius: 2,
                boxShadow:
                  "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px rgba(0,0,0,0.14)",
                fontWeight: 600,
                fontSize: "1rem",
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
                      Retry
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
                    </>
                  )}
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() =>
                      setSnackbars((prev) =>
                        prev.map((s) =>
                          s.id === snackbar.id
                            ? { ...s, open: false }
                            : s
                        )
                      )
                    }
                    sx={{ fontWeight: "bold" }}
                  >
                    Dismiss
                  </Button>
                </>
              }
            >
              {snackbar.message}
            </Alert>
          </SlideTransition>
        ))}
      </div>
    </SnackbarContext.Provider>
  );
};
