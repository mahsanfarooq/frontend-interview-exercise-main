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
      setLoader(false);
    } catch (e) {
      setLoadError("Failed to load liked submissions. Please try again.");
      showMessage("Failed to load liked submissions.", "error");
      setLoader(false);
      setTimeout(() => {
        loadLikedList()
      }, 3000);
    }
  };

  useEffect(() => {
    loadLikedList();
  }, [likedVersion]);

  useEffect(() => {
    onMessage((formSubmission) => {
      console.log("New form submission received:", formSubmission);
      showMessage(
        `${formSubmission.data.firstName} just signed up!`,
        "info",
        formSubmission
      );
    });
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Liked Form Submissions
      </Typography>

      <EnhancedLikedList
        isLoading={loader}
        error={loadError}
        onRetry={loadLikedList}
        data={likedList}
      />
    </Box>
  );
}
