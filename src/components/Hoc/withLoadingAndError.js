
import React from "react";
import { Box, Skeleton, Alert, AlertTitle, Button, Typography } from "@mui/material";

const withLoadingAndError = (WrappedComponent) => {
  return function ({
    isLoading,
    error,
    onRetry,
    skeletonCount = 3,
    data,
    ...props
  }) {
    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
          <Box mt={2}>
            <Button variant="outlined" color="error" onClick={onRetry}>
              Retry
            </Button>
          </Box>
        </Alert>
      );
    }

    if (isLoading) {
      return (
        <Box>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              animation="wave"
              height={72}
              sx={{ borderRadius: 2, mb: 2 }}
            />
          ))}
        </Box>
      );
    }

    if (!data || data.length === 0) {
      return (
        <Typography color="text.secondary">
          No data available.
        </Typography>
      );
    }

    return <WrappedComponent data={data} {...props} />;
  };
};

export default withLoadingAndError;
