
import { Typography, Avatar, Paper, Stack, Fade } from "@mui/material";
export const LikedSubmissionsList = ({ data }) => {
  return data.map((submission) => {
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
  });
};
