import React from "react";
import { Box, Stack } from "@chakra-ui/react";
import "../App.css";
import { useNavigate } from "react-router-dom";
function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const hadleClick = () => {
    navigate("/");
    localStorage.removeItem("token");
  };
  return (
    <Box className="bar">
      <Stack className="bar1" direction={"row"} spacing={10}>
        {!token && (
          <Box>
            <button onClick={() => navigate("/login")} className="">
              ເຂົ້າສູ່ລະບົບ
            </button>
          </Box>
        )}
        {!token && (
          <Box>
            <button
              onClick={() => navigate("/resgister")}
              className="btn btn-primary"
            >
              ລົງທະບຽນ
            </button>
          </Box>
        )}
        {token  && (
          <Box>
            <button onClick={hadleClick} className="btn btn-primary">
              登出
            </button>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default NavBar;
