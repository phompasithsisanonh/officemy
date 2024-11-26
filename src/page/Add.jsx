import { Box, Input, Stack, Flex, useMediaQuery } from "@chakra-ui/react";
import React, { useState } from "react";
import Bar from "../Bar/NavBar"; // Assuming this is your custom component
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
function Add() {
  const [isSmallerThan600] = useMediaQuery("(max-width: 600px)");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [list, setList] = useState("");
  const [balance, setBalance] = useState("");
  const [typeExchange, setTypeExchange] = useState("");
  const [exchange, setExchange] = useState("");
  const [categoryExpence, setCategoryExpence] = useState("");
  const [codeNumber, setCodeNumber] = useState("");
  const [country, setCountry] = useState("");
  const [note, setNote] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const handleCurrencyChange = (e) => {
    const newType = e.target.value;
    setTypeExchange(newType);
    setIsDisabled(newType === "基普");
    setExchange("");
    if (newType !== "基普") {
      setExchange("");
    }
   
  };
  const handleOrder = async () => {
    try {
      setIsLoading(true);

      await axios
        .post(
          `${process.env.REACT_API}/api/checkcode `,
          {
            date,
            list,
            balance,
            typeExchange,
            exchange,
            categoryExpence,
            codeNumber,
            country,
            note
          },
        )
        .then((res) => {
          console.log(res);
          Swal.fire({
            title: "成功",
            text: res.data.message,
            icon: "success",
            confirmButtonText: "关",
          });
        })
        .catch((err) => {
          Swal.fire({
            title: "无措",
            text: err.response.data.message,
            icon: "error",
            confirmButtonText: "关",
          });
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };
  
  return (
    <Box>
      
      <Bar /> {/* Use your custom Bar component here */}
      <Flex
        className="adds"
        direction={isSmallerThan600 ? "column" : "row"}
        justifyContent="center"
        alignItems="center"
        paddingTop="30px"
        gap="20px" // Add some spacing between input groups
      >
        <button onClick={() => navigate("/")}>主页</button>
        <Stack className="order_1">
          <label>年/月/日</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="Input_order1"
          />
        </Stack>

        <Stack className="order_1">
          <label>编号</label>
          <Input
            value={codeNumber}
            onChange={(e) => setCodeNumber(e.target.value)}
            type="text"
            placeholder="编号"
            className="Input_order1"
          />
        </Stack>
      </Flex>
      <Flex
        className="adds"
        direction={isSmallerThan600 ? "column" : "row"}
        justifyContent="center"
        alignItems="center"
        paddingTop="30px"
        gap="20px" // Add some spacing between input groups
      >
        <Stack className="order_1">
          <label>事由</label>
          <Input
            value={list}
            onChange={(e) => setList(e.target.value)}
            type="text"
            placeholder="事由"
            className="Input_order1"
          />
        </Stack>

        <Stack className="order_1">
          <label>金额</label>
          <Input
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            type="text"
            placeholder="金额"
            className="Input_order1"
          />
        </Stack>
      </Flex>
      <Flex
        className="adds"
        direction={isSmallerThan600 ? "column" : "row"}
        justifyContent="center"
        alignItems="center"
        paddingTop="30px"
        gap="20px" // Add some spacing between input groups
      >
        <Stack className="order_1">
          <label>类型货币</label>
          <select
            value={typeExchange}
            onChange={handleCurrencyChange}
            className="Input_order1"
          >
            <option value="">类型货币</option>
            <option value="基普">基普</option>
            <option value="美元">美元</option>
            <option value="泰铢">泰铢</option>
          </select>
        </Stack>
        <Stack className="order_1">
          <label>country</label>
          <select
            value={country}
            onChange={(e)=>setCountry(e.target.value)}
            className="Input_order1"
          >
            <option value="">country</option>
            <option value="泰国">thai</option>
            <option value="老挝">laos</option>
          </select>
        </Stack>
        <Stack className="order_1">
          <label>类型花费</label>
          <select
            value={categoryExpence}
            onChange={(e) => setCategoryExpence(e.target.value)}
            className="Input_order1"
          >
            <option value="">类型</option>
            <option value="汽车费">汽车费</option>
            <option value="办公费">办公费</option>
            <option value="福利费">福利费 </option>
            <option value="差费">差费</option>
            <option value="招待费">招待费</option>
          </select>
        </Stack>
      </Flex>
      <Flex
        className="adds"
        direction={isSmallerThan600 ? "column" : "row"}
        justifyContent="center"
        alignItems="center"
        paddingTop="30px"
        gap="20px" // Add some spacing between input groups
      >
        <Stack className="order_1">
          <label>汇率</label>
          <Input
            disabled={isDisabled}
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
            type="text"
            placeholder="汇率"
            className="Input_order1"
          />
        </Stack>
        <Stack className="order_1">
          <label>备注</label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            type="text"
            placeholder="备注"
            className="Input_order1"
          />
        </Stack>
      </Flex>
      <Box
        display={"flex"}
        justifyContent="center"
        paddingTop={"30px"}
        alignItems="center"
      >
        <button onClick={handleOrder}>确认</button>
      </Box>
    </Box>
  );
}

export default Add;
