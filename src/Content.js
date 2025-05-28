import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "./components/Context/SnackbarContext";
import { fetchLikedFormSubmissions, onMessage } from "./service/mockServer";

export default function Content() {
  const { showMessage, isChanged } = useSnackbar();

  const [likedList, setLikedList] = useState([]);

  const loadLiked = async () => {
    try {
      const submissions = await fetchLikedFormSubmissions();
      setLikedList(submissions.formSubmissions);
    } catch (e) {
      console.error("Failed to fetch liked submissions", e);
    }
  };

  useEffect(() => {
    loadLiked();
  }, [isChanged]);

  useEffect(() => {
    onMessage((formSubmission) => {
      showMessage(
        `${formSubmission.data.firstName} just signed up!`,
        "info",
        formSubmission
      );
    });
  }, []);

  console.log("likedList", likedList);
  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h4">Liked Form Submissions</Typography>

      {likedList?.map((submission) => (
        <div key={submission.id}>
          {submission.data.firstName} {submission.data.lastName} -{" "}
          {submission.data.email}
        </div>
      ))}
    </Box>
  );
}
