import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export function CircularProgressComponent({
  size = 24,
  ...otherProps
}) {
  return <CircularProgress size={size} {...otherProps} />;
}
