import {
  Typography,
  Avatar,
  Paper,
  Stack,
  Fade,
  Slide,
} from "@mui/material";
import { useEffect, useState } from "react";

export const LikedSubmissionsList = ({ data }) => {
  const [visibleIds, setVisibleIds] = useState([]);

  useEffect(() => {
    const timeouts = data.map((item, index) =>
      setTimeout(() => {
        setVisibleIds((prev) => [...prev, item.id]);
      }, index * 10)
    );
    return () => timeouts.forEach(clearTimeout);
  }, [data]);

  return data.map((submission, index) => {
    const { firstName, lastName, email } = submission.data;
    const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

    return (
      <Slide
        in={visibleIds.includes(submission.id)}
        direction="up"
        timeout={20 + index * 50}
        key={submission.id}
      >
        <Fade in={visibleIds.includes(submission.id)} timeout={20}>
          <Paper
            elevation={4}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2.5,
              mb: 2,
              borderRadius: 3,
              backgroundColor: "background.paper",
              cursor: "pointer",
              transition: "all 0.35s ease",
              "&:hover": {
                backgroundColor: "rgba(0, 123, 255, 0.04)",
                transform: "translateY(-2px) scale(1.01)",
                boxShadow: 6,
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                color: "white",
                fontWeight: 600,
                width: 48,
                height: 48,
                fontSize: "1.1rem",
              }}
            >
              {initials}
            </Avatar>
            <Stack spacing={0.3}>
              <Typography fontWeight={600} fontSize="1.05rem">
                {firstName} {lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {email}
              </Typography>
            </Stack>
          </Paper>
        </Fade>
      </Slide>
    );
  });
};
