import React from "react";
import { Box, Heading, Stack } from "@chakra-ui/react";
import "./App.css";
import Bar from "./Bar/NavBar";
import { useNavigate } from "react-router-dom";
function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  return (
    <Box className="dashbord">
      <Bar />
      <Heading>ຍິນດີຕ້ອນຮັບ</Heading>
      <Stack>
        <Stack paddingTop={"20px"}>
          <Box>
            <button onClick={() => navigate("/listExp")} className="">
              ລາຍການລາຍຈ່າຍ
            </button>
          </Box>{" "}
          <Box>
            <button onClick={() => navigate("/dash")} className="">
            ແຜນພາບລວມ
            </button>
          </Box>
          {token && (
            <Box>
              <button
                onClick={() => navigate("/add")}
                className="btn btn-primary"
              >
                ບັນທືກລາຍຈ່າຍ
              </button>
            </Box>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

export default Dashboard;
