import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Skeleton,
  Fade,
  Paper,
  Stack,
} from "@mui/material";
import { useSnackbar } from "./components/Context/SnackbarContext";
import { fetchLikedFormSubmissions, onMessage } from "./service/mockServer";
 
export default function Content() {
  const { showMessage, likedLoader } = useSnackbar();
 
  const [likedList, setLikedList] = useState([]);
  const [loader, setLoader] = useState(false);
 
  const loadLiked = async () => {
    try {
      const submissions = await fetchLikedFormSubmissions();
      setLikedList(submissions.formSubmissions || []);
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
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Liked Form Submissions
      </Typography>
 
      {loader || likedLoader ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            animation="wave"
            height={72}
            sx={{ borderRadius: 2, mb: 2 }}
          />
        ))
      ) : likedList.length === 0 ? (
        <Typography color="text.secondary">No liked submissions.</Typography>
      ) : (
        likedList.map((submission) => {
          const { firstName, lastName, email } = submission.data;
          const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
 
          return (
            <Fade in timeout={500} key={submission.id}>
              <Paper
                elevation={3}
                sx={{
                  display: "flex",
                  cursor: "pointer",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  backgroundColor: "background.paper",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    transform: "scale(1.02)",
                    boxShadow: 6,
                  },
                }}
              >
                <Avatar>{initials}</Avatar>
                <Stack>
                  <Typography fontWeight="bold">
                    {firstName} {lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {email}
                  </Typography>
                </Stack>
              </Paper>
            </Fade>
          );
        })
      )}
    </Box>
  );
}
 