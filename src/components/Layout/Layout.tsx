"use client";

import { Box, Container } from "@mui/material";
import type { FC, ReactNode } from "react";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => (
  <Box>
    <Header />
    <Container maxWidth="lg">
      <Box
        component={"main"}
        sx={{
          marginTop: 8,
          paddingY: 1,
        }}
      >
        {children}
      </Box>
    </Container>
  </Box>
);

export default Layout;
