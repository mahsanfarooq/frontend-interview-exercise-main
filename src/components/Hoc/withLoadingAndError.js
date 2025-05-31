
import React from "react";
import { Box, Skeleton, Typography } from "@mui/material";

const withLoadingAndError = (WrappedComponent) => {
  return function ({
    isLoading,
    error,
    onRetry,
    skeletonCount = 3,
    data,
    ...props
  }) {


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
