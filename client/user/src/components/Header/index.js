import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Stack, useMediaQuery } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

import Search from "./Search";
import Logo from "../../images/logo.png";
import Styled from "./Styled";
import { navigations } from "./NavItems";
import MobileDrawer from "./MobileDrawer";

const Header = () => {
  const lgScreen = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <header>
      <Styled.StackCont
        direction="row"
        spacing={2}
        sx={{
          gap: 1,
          ["@media (max-width: 975px)"]: {
            justifyContent: "space-around",
          },
        }}
      >
        <Styled.LogoLink to="/" component={RouterLink}>
          <Box component="img" src={Logo} style={{ width: "100%" }} />
        </Styled.LogoLink>

        {lgScreen && <Search lgScreen={lgScreen} />}

        {lgScreen ? (
          <Box>
            <Styled.Btn color="secondary" variant="contained">
              register
            </Styled.Btn>
            <Styled.Btn signin="1" variant="contained" sx={{ ml: 1 }}>
              sign in
            </Styled.Btn>
          </Box>
        ) : (
          <Box component="span" sx={{ ml: "auto!important" }}>
            <MenuIcon
              onClick={() => {
                setOpenMenu(!openMenu);
              }}
            />
          </Box>
        )}
      </Styled.StackCont>
      <Styled.StackCont
        sx={{
          backgroundImage: "unset",
          py: lgScreen ? 0 : 2,
          gap: 1,
        }}
        direction="row"
        spacing={1}
      >
        {lgScreen ? (
          <Stack direction="row" sx={{ width: "40%", height: "50px" }}>
            <Box component="nav">
              <ul>
                {navigations.map((navigation, index) => (
                  <li key={index}>
                    <Styled.RouteLink
                      component={RouterLink}
                      to={navigation.href}
                    >
                      {navigation.name}
                    </Styled.RouteLink>
                  </li>
                ))}
              </ul>
            </Box>
          </Stack>
        ) : (
          <>
            <Search lgScreen={lgScreen} />
            <Stack
              sx={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Styled.Btn color="secondary" variant="contained">
                register
              </Styled.Btn>
            </Stack>
          </>
        )}
      </Styled.StackCont>
      {!lgScreen && (
        <MobileDrawer openMenu={openMenu} setOpenMenu={setOpenMenu} />
      )}
    </header>
  );
};

export default React.memo(Header);
