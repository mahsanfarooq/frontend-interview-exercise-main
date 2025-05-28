import React from "react";
import Container from "@mui/material/Container";

import Header from "./Header";
import Content from "./Content";
import { SnackbarProvider } from "./components/Context/SnackbarContext";

function App() {
  return (
    <SnackbarProvider>
      <Header />
      <Container>
        <Content />
      </Container>
    </SnackbarProvider>
  );
}

export default App;
