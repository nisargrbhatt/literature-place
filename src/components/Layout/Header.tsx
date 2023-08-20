"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useThemeContext } from "@/context/ThemeContext";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  styled,
} from "@mui/material";
import type { FC, MouseEvent } from "react";
import { useState } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { deepOrange } from "@mui/material/colors";
import { loginWithGoogle } from "@/firebase/auth/login";
import { logout } from "@/firebase/auth/logout";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness5Icon from "@mui/icons-material/Brightness5";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import PersonIcon from "@mui/icons-material/Person";

const MuiLink = styled(Link)<LinkProps>(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontSize: 22,
}));

interface Props {}

const Header: FC<Props> = () => {
  const { user } = useAuthContext();
  const { mode, changeMode } = useThemeContext();

  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorLitEl, setAnchorLitEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLitMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorLitEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLitClose = () => {
    setAnchorLitEl(null);
  };

  return (
    <AppBar>
      <Toolbar>
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <MuiLink href={"/"}>Literature</MuiLink>
        </Box>
        <div>
          {user && (
            <Tooltip title="Contribute Something">
              <IconButton
                size="large"
                aria-label="Contribute Something"
                aria-controls="menu-lit-appbar"
                aria-haspopup="true"
                onClick={handleLitMenu}
                color="inherit"
              >
                <LocalLibraryIcon />
              </IconButton>
            </Tooltip>
          )}
          <Menu
            id="menu-lit-appbar"
            anchorEl={anchorLitEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorLitEl)}
            onClose={handleLitClose}
          >
            <MenuItem
              onClick={() => {
                router.push("/add-literature");
                handleLitClose();
              }}
            >
              <ListItemIcon>
                <MenuBookIcon />
              </ListItemIcon>
              <ListItemText>Literature</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                router.push("/add-author");
                handleLitClose();
              }}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText>Author</ListItemText>
            </MenuItem>
          </Menu>
        </div>
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            {!user && <AccountCircle />}
            {user && (
              <Avatar
                sx={{ bgcolor: deepOrange[500] }}
                alt={user.displayName ?? ""}
                src={user?.photoURL ?? ""}
              >
                {user.displayName?.at(0)}
              </Avatar>
            )}
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                changeMode(mode === "dark" ? "light" : "dark");
                handleClose();
              }}
            >
              <ListItemIcon>
                {mode === "dark" ? <Brightness7Icon /> : <Brightness5Icon />}
              </ListItemIcon>
              <ListItemText>{mode}</ListItemText>
            </MenuItem>
            {user && (
              <MenuItem
                onClick={() => {
                  logout();
                  handleClose();
                }}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            )}
            {!user && (
              <MenuItem
                onClick={() => {
                  loginWithGoogle();
                  handleClose();
                }}
              >
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText>Login</ListItemText>
              </MenuItem>
            )}
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
