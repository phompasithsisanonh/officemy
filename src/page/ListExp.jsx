import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Stack,
  Text,
  Flex,
  useMediaQuery,
  Spinner,
  Table as ChakraTable,
  Thead,
  Tbody,
  TableCaption,
  TableContainer,
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import { FaPrint, FaClipboardList } from "react-icons/fa";
import ReactToPrint from "react-to-print";
import * as XLSX from 'xlsx';
function ListExp() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [createData, setCreateData] = useState([]);
  const [total, setTotal] = useState(0);
  const [categoryExpence, setCategoryExpence] = useState("");
  const [loading, setLoading] = useState(false);
  let componentRef = useRef();
 

  const [isSmallerThan600] = useMediaQuery("(max-width: 600px)");
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };
  const filteredList = createData.filter(
    (row) =>
      row.categoryExpence &&
      row.categoryExpence.includes(categoryExpence) &&
      row.codeNumber.toLowerCase().includes(query.toLowerCase())
  );
  const handleExportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ExpenseData");
    XLSX.writeFile(workbook, "expense_data.xlsx");
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/listAll?page=${page}&limit=${limit}&categoryExpence=${categoryExpence}`
        );
        setCreateData(response.data.products);
        setTotal(response.data.total);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, limit, categoryExpence]);
  const ComponentTable = React.forwardRef((props, ref) => (
    <Flex
      className="adds"
      direction={isSmallerThan600 ? "column" : "row"}
      justifyContent="center"
      alignItems="center"
      paddingTop="30px"
      gap="20px" // Add some spacing between input groups
    >
      <TableContainer ref={componentRef}>
     <Heading display={'flex'} justifyContent={'center'}>楚盛老挝独资有限公司   月报销单明细表</Heading>
        <ChakraTable variant="striped" colorScheme="gray">
          <TableCaption>Total Products: {total}</TableCaption>
          <Thead>
            <TableRow>
              {[
                "#",
                "年/月/日",
                "编号",
                "事由",
                " 金额",
                "类型货币",
                "汇率",
                "类型花费",
                //   "edit",
                //   "Delete",
              ].map((header) => (
                <TableCell
                  key={header}
                  style={{
                    textAlign: "center",
                    color: "black",
                    fontFamily: "Noto Sans Lao, sans-serif",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </Thead>
          <Tbody>
            {filteredList.length > 0 ? (
              <>
                {filteredList.map((row, index) => (
                  <TableRow key={row._id}>
                    <TableCell
                      style={{
                        textAlign: "center",
                        color: "black",
                      }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        color: "black",
                      }}
                    >
                      {row.date}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        color: "black",
                      }}
                      component="th"
                    >
                      {row.codeNumber}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        color: "black",
                      }}
                      align="right"
                    >
                      {row.list}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        color: "black",
                      }}
                      align="right"
                    >
                      {row.balance.toLocaleString()}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        color: "black",
                      }}
                      align="right"
                    >
                      {row.typeExchange}
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        style={{
                          textAlign: "center",
                          width: "100%",
                          fontSize: "20px",
                        }}
                      >
                        {row.exchange}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        style={{
                          textAlign: "center",
                          width: "100%",
                          fontSize: "20px",
                        }}
                        fontFamily={"monospace"}
                      >
                        {row.categoryExpence}
                      </Box>
                    </TableCell>
                    {/* <TableCell align="right">
                <button className="com0">Edit</button>
              </TableCell>
              <TableCell align="right">
                <button className="com1">Delete</button>
              </TableCell> */}
                  </TableRow>
                ))}
              </>
            ) : (
              <Box paddingLeft={"150px"}>
                <Text>没有</Text>
              </Box>
            )}
          </Tbody>
        </ChakraTable>
      </TableContainer>
    </Flex>
  ));
  return (
    <Box>
      <Stack>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          className="order_1"
        >
          <button onClick={() => navigate("/")}>主页</button>
          <label>搜入</label>
          <input
            onChange={handleInputChange}
            value={query}
            className="Input_order1"
            placeholder="搜入 骗号"
          />
        </Box>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          className="order_1"
        >
          <Stack direction={'row'}>
          <ReactToPrint
              trigger={() => (
                <button
                  style={{
                    background: "blue",
                    width: "80px",
                    height: "40px",
                    borderRadius: "10px",
                    textAlign: "center",
                  }}
                >
                  <FaPrint />
                </button>
              )}
              content={() => componentRef.current}
            />
                     <button
            style={{
              background: "green", // Added green color
              width: "80px",
              height: "40px",
              borderRadius: "10px",
              textAlign: "center",
            }}
            onClick={handleExportXLSX}
          >
            <FaClipboardList /> {/* Used clipboard icon */}
          </button>
          </Stack>
          <label>类型花费</label>
          <select
            value={categoryExpence}
            onChange={(e) => setCategoryExpence(e.target.value)}
            className="order_select"
          >
            <option value="">类型</option>
            <option value="汽车费">汽车费</option>
            <option value="办公费">办公费</option>
            <option value="福利费">福利费 </option>
            <option value="差费">差费</option>
            <option value="招待费">招待费</option>
          </select>
        </Box>
      </Stack>
      {loading ? (
        <Spinner />
      ) : (
        <Stack>
          <ComponentTable ref={componentRef} />
          <Box display={"flex"} justifyContent={"center"} spacing={2}>
            <Pagination
              count={Math.ceil(total / limit)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Stack>
      )}
    </Box>
  );
}

export default ListExp;
