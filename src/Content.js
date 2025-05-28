import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "./components/Context/SnackbarContext";
import { fetchLikedFormSubmissions, onMessage } from "./service/mockServer";
import { CircularProgressComponent } from "./components/CircularProgress";

export default function Content() {
  const { showMessage, likedLoader } = useSnackbar();

  const [likedList, setLikedList] = useState([]);
  const [loader, setLoader] = useState(false);

  const loadLiked = async () => {
    try {
      const submissions = await fetchLikedFormSubmissions();
      setLikedList(submissions.formSubmissions);
    } catch (e) {
      console.error("Failed to fetch liked submissions", e);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    setLoader(true);
    loadLiked();
  }, [likedLoader]);

  useEffect(() => {
    onMessage((formSubmission) => {
      showMessage(
        `${formSubmission.data.firstName} just signed up!`,
        "info",
        formSubmission
      );
    });
  }, []);

  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h4">Liked Form Submissions</Typography>

      {likedList?.map((submission) => (
        <div key={submission.id}>
          {submission.data.firstName} {submission.data.lastName} -{" "}
          {submission.data.email}
        </div>
      ))}
      {(loader || likedLoader) && <CircularProgressComponent size={20} />}
    </Box>
  );
}
