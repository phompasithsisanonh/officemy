import React,{useState} from "react";
import { Box, Heading, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
function Login() {
  const [password, setPassword] = useState("");
  const [tel, setTel] = useState("");
  
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
     
      await axios.post(
        `https://office-five-psi.vercel.app/api/login`,
        {
          tel,
          password
        }
      ).then((res)=>{
        const token = res.data.token;
        localStorage.setItem("token", token);
        Swal.fire({
          title: "注册成功",
          text:  res.data.message,
          icon: "scuccess",
          confirmButtonText: "关",
        });
        navigate("/add");
      }).catch((err)=>{
        console.log(err)
        Swal.fire({
          title: "无措",
          text:  err?.response?.data?.message,
          icon: "error",
          confirmButtonText: "关",
        });
      });
     
    } catch (error) {
      Swal.fire({
        title: "无措",
        text: error?.err?.response?.data?.message,
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
         注册
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
              onChange={(e)=>setTel(e.target.value)}
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
              onChange={(e)=>setPassword(e.target.value)}
              type="text"
              className="Input_order1"
              placeholder="密码"
            
            />
          </Stack>
          <Box display={"flex"} justifyContent={"center"}>
            <button onClick={handleLogin} className="btnOrder">
             注册
            </button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  </Box>
  )
}

export default Login