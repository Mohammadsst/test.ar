import * as React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

interface ResponsiveFlexProps {
  children: React.ReactNode;
}

export default function ResponsiveFlex({ children }: ResponsiveFlexProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap", // Allows items to wrap onto the next line
        gap: 2, // Gap between items
        justifyContent: "center", // Centers items in the container
      }}
    >
      {React.Children.map(children, (child, index) => (
        <Box
          key={index}
          sx={{
            flexBasis: {
              xs: "100%", // Full width on extra-small screens
              sm: "47%", // Half width on small screens
              md: "30%", // One-third width on medium and larger screens
            },
            flexGrow: 1, // Allows items to grow and fill space as needed
            maxWidth: {
              xs: "100%",
              sm: "47%",
              md: "30%",
            },
          }}
        >
          <Item>{child}</Item>
        </Box>
      ))}
    </Box>
  );
}
