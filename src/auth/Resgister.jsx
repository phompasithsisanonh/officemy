import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Box, Heading, Stack } from "@chakra-ui/react";
function Resgister() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [tel, setTel] = useState("");

  const handleAdmin = async () => {
    try {
      await axios
        .post(`https://office-five-psi.vercel.app/api/register`, {
          password,
          tel,
        })
        .then((res) => {
          Swal.fire({
            title: "登录成功",
            text: res.data.message,
            icon: "success",
            confirmButtonText: "关",
          });
          navigate("/add");
        })
        .catch((err) => {
          Swal.fire({
            title: "无措",
            text: err?.response?.data?.message,
            icon: "error",
            confirmButtonText: "关",
          });
        });
    } catch (error) {
      Swal.fire({
        title: "error!",
        text: error?.err?.response?.data.message,
        icon: "error",
        confirmButtonText: "ປິດ",
      });
    }
  };
  return (
    <Box>
      <Stack
        paddingTop={"100px"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Stack
          paddingTop={"60px"}
          direction={"row"}
          lassName="login_gup  input-group mb-3"
        >
          <Stack>
            <Heading display={"flex"} justifyContent={"center"}>
              登记
            </Heading>
            <Stack className="order_1">
              <label>手机号码</label>
              <input
                style={{
                  width: "410px",
                  height: "45px",
                  borderRadius: "10px",
                  paddingLeft: "20px",
                }}
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                type="text"
                className="Input_order1"
                placeholder="手机号码"
              />
            </Stack>
            <Stack className="order_1">
              <label>密码</label>
              <input
                style={{
                  width: "410px",
                  height: "45px",
                  borderRadius: "10px",
                  paddingLeft: "20px",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="text"
                className="Input_order1"
                placeholder="密码"
              />
            </Stack>
            <Box display={"flex"} justifyContent={"center"}>
              <button onClick={handleAdmin} className="btnOrder">
                登录
              </button>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default Resgister;
