import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSnackbar } from "./components/Context/SnackbarContext";
import { fetchLikedFormSubmissions, onMessage } from "./service/mockServer";
import withLoadingAndError from "./components/Hoc/withLoadingAndError";
import { LikedSubmissionsList } from "./components/Lists/LikedSubmissionsList";


const EnhancedLikedList = withLoadingAndError(LikedSubmissionsList);

export default function Content() {
  const { showMessage, likedLoader, likedVersion } = useSnackbar();

  const [likedList, setLikedList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const loadLikedList = async () => {
    setLoader(true);
    setLoadError(null);
    try {
      const submissions = await fetchLikedFormSubmissions();
      setLikedList(submissions.formSubmissions || []);
    } catch (e) {
      console.error("Failed to fetch liked submissions", e);
      setLoadError("Failed to load liked submissions. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    loadLikedList();
  }, [likedVersion]);

  useEffect(() => {
    onMessage((formSubmission) => {
      showMessage(
        `${formSubmission.data.firstName} just signed up!`,
        "info",
        formSubmission
      );
    });
  }, [showMessage]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Liked Form Submissions
      </Typography>

      <EnhancedLikedList
        isLoading={loader || likedLoader}
        error={loadError}
        onRetry={loadLikedList}
        data={likedList}
      />
    </Box>
  );
}
