import React from "react";
import {
  Box,
  Heading,
  Stack,
} from "@chakra-ui/react";
import "./App.css";
import Bar from "./Bar/NavBar";
import { useNavigate } from "react-router-dom";
function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  return (
    <Box className="dashbord">
      <Bar />
      <Heading>欢迎来我们</Heading>
      <Stack>
        <Stack paddingTop={"20px"}>
          <Box>
            <button     onClick={() => navigate("/listExp")} className="">查询花费</button>
          </Box>
          {token && (
            <Box>
              <button
                onClick={() => navigate("/add")}
                className="btn btn-primary"
              >
                记录花费
              </button>
            </Box>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

export default Dashboard;
