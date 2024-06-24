import {
  QuestionAnswerTwoTone,
  ReviewsTwoTone,
  TextSnippetTwoTone,
} from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Divider, IconButton, List } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { CSSObject, Theme, styled, useTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import { AppConfig, DRAWER_WIDTH } from "./AppLayout";
import { NavigationItem } from "./NavigationItem";

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});
export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

type AppDrawerProps = {
  open: boolean;
  appState: AppConfig["app_state"];
  onDrawerClose(): void;
};

export const AppDrawer = ({
  open,
  appState,
  onDrawerClose,
}: AppDrawerProps) => {
  const theme = useTheme();

  const { pathname } = useLocation();

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={onDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List
        sx={{
          mx: "4px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: "1 0 auto",
        }}
      >
        {appState === "annotation" && (
          <>
            <NavigationItem
              title="Annotate"
              to="/"
              isSelected={pathname === "/" || pathname.includes("annotate")}
              isOpen={open}
              icon={<TextSnippetTwoTone />}
            />
            <NavigationItem
              title="Question&Answers"
              to="/answers"
              isSelected={pathname.includes("/answers")}
              isOpen={open}
              icon={<QuestionAnswerTwoTone />}
            />
          </>
        )}
        {appState === "review" && (
          <NavigationItem
            title="Review Q&A"
            to="/review"
            isSelected={pathname.includes("/review")}
            isOpen={open}
            icon={<ReviewsTwoTone />}
          />
        )}
      </List>
    </Drawer>
  );
};
