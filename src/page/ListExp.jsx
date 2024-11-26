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
  Button,
  Input,
  Select,
  Tfoot,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import Swal from "sweetalert2";
import { FaPrint, FaClipboardList } from "react-icons/fa";
import ReactToPrint from "react-to-print";
import * as XLSX from "xlsx";

function ListExp() {
  const [page, setPage] = useState(1);
  const token = localStorage.getItem("token");
  const limit = 500;
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [createData, setCreateData] = useState([]);
  const [total, setTotal] = useState(0);
  const [categoryExpence, setCategoryExpence] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const componentRef = useRef();

  const [isSmallerThan600] = useMediaQuery("(max-width: 600px)");

  // Pagination Handler
  const handlePageChange = (event, value) => setPage(value);

  // Input Search Handler
  const handleInputChange = (event) => setQuery(event.target.value);

  // Export to Excel
  const handleExportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ExpenseData");
    XLSX.writeFile(workbook, "expense_data.xlsx");
  };

  // Filter and Sort data
  const filteredList = createData
    .filter(
      (row) =>
        (!year || new Date(row.date).getFullYear() === year) &&
        (!month || new Date(row.date).getMonth() === month - 1) &&
        (!categoryExpence || row.categoryExpence.includes(categoryExpence)) &&
        (!country || row.country.toLowerCase().includes(country.toLowerCase()))
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calculate Total Balances
  const totalBalance = (currency) =>
    createData.reduce(
      (sum, row) => (row.typeExchange === currency ? sum + row.balance : sum),
      0
    );

  // Fetch Data
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://office-five-psi.vercel.app/api/listAll?page=${page}&limit=${limit}&categoryExpence=${categoryExpence}&country=${country}&year=${year}&month=${month}`
      );
      setCreateData(response.data.products);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Failed to fetch products", error);
      Swal.fire({
        title: "Error",
        text: "Failed to load data.",
        icon: "error",
        confirmButtonText: "Close",
      });
    } finally {
      setLoading(false);
    }
  };

  const DeleteController = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:8000/api/delete/${id}`
      );
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "Close",
      });
      setCreateData((prevData) => prevData.filter((user) => user._id !== id));
      setTotal("");
      setPage(1);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to delete item.",
        icon: "error",
        confirmButtonText: "Close",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, categoryExpence, country, year, month]);

  // Table Component
  const ComponentTable = React.forwardRef((props, ref) => (
    <Flex
      direction={isSmallerThan600 ? "column" : "row"}
      justifyContent="space-between"
      alignItems="center"
      paddingTop="30px"
      gap="20px"
    >
      <TableContainer ref={componentRef} width="100%">
        <Heading textAlign="center" mb={6}>
          楚盛老挝独资有限公司 月报销单明细表
        </Heading>
        <ChakraTable variant="striped" colorScheme="gray">
          <TableCaption>全部: {total.toLocaleString()}</TableCaption>
          <Thead>
            <TableRow>
              {[
                "#",
                "类型花费",
                "年/月/日",
                "编号",
                "事由",
                "金额",
                "类型货币",
                "汇率",
                "国家",
                "总共",
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
              filteredList.map((row, index) => (
                <TableRow key={row._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.categoryExpence}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.codeNumber}</TableCell>
                  <TableCell>{row.list}</TableCell>
                  <TableCell>{row.balance.toLocaleString()}</TableCell>
                  <TableCell>{row.typeExchange}</TableCell>
                  <TableCell>{row.exchange}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>{row.total.toLocaleString()}</TableCell>
                  <TableCell>
                    {token && (
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => DeleteController(row._id)}
                      >
                        删除
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <Box paddingLeft="550px">
                <Text>没有数据</Text>
              </Box>
            )}
          </Tbody>
          <Tfoot>
            <TableRow>
              <TableCell colSpan={9} style={{ textAlign: "right" }}>
                美元总支出:
              </TableCell>
              <TableCell>{totalBalance("美元").toLocaleString()}</TableCell>
            </TableRow>
            {country === "泰国" ? (
              <TableRow>
                <TableCell colSpan={9} style={{ textAlign: "right" }}>
                  泰铢总支出:
                </TableCell>
                <TableCell>{totalBalance("泰铢").toLocaleString()}</TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={9} style={{ textAlign: "right" }}>
                  基普总支出:
                </TableCell>
                <TableCell>{totalBalance("基普").toLocaleString()}</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell colSpan={9} style={{ textAlign: "right" }}>
                合计:
              </TableCell>
              <TableCell>
                {createData
                  .reduce((sum, row) => sum + row.total, 0)
                  .toLocaleString()}
              </TableCell>
            </TableRow>
          </Tfoot>
        </ChakraTable>
      </TableContainer>
    </Flex>
  ));

  return (
    <Box>
      <Stack spacing={6} p={5}>
        <Flex justify="center" align="center">
          <Button onClick={() => navigate("/")} mr={5} colorScheme="teal">
            主页
          </Button>
          <Input
            value={query}
            onChange={handleInputChange}
            placeholder="搜索编号"
            width="200px"
            mr={5}
            size="sm"
          />
        </Flex>

        <Flex justify="center" align="center" mb={5}>
          <ReactToPrint
            trigger={() => (
              <Button
                colorScheme="blue"
                leftIcon={<FaPrint />}
                size="sm"
                mr={5}
              >
                打印
              </Button>
            )}
            content={() => componentRef.current}
          />
          <Button
            colorScheme="green"
            leftIcon={<FaClipboardList />}
            size="sm"
            onClick={handleExportXLSX}
          >
            导出
          </Button>
        </Flex>

        <Flex justify="center" align="center">
          <Select
            value={categoryExpence}
            onChange={(e) => setCategoryExpence(e.target.value)}
            width="200px"
            size="sm"
          >
            <option value="">选择类型</option>
            <option value="汽车费">汽车费</option>
            <option value="办公费">办公费</option>
            <option value="福利费">福利费</option>
            <option value="差费">差费</option>
            <option value="招待费">招待费</option>
          </Select>
        </Flex>
        <Flex justify="center" align="center">
          <Select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            width="200px"
            size="sm"
          >
            <option value="">国家</option>
            <option value="泰国">泰国</option>
            <option value="老挝">老挝</option>
          </Select>
        </Flex>
        <Flex justify="center" align="center">
          <Select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            width="200px"
            size="sm"
          >
            <option value="">月</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </Select>
        </Flex>

        {loading ? (
          <Flex justify="center">
            <Spinner />
          </Flex>
        ) : (
          <>
            <ComponentTable ref={componentRef} />
            <Flex justify="center" mt={5}>
              <Pagination
                count={Math.ceil(total / limit)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Flex>
          </>
        )}
      </Stack>
    </Box>
  );
}

export default ListExp;

// import React, { useEffect, useRef, useState } from "react";
// import {
//   Box,
//   Stack,
//   Text,
//   Flex,
//   useMediaQuery,
//   Spinner,
//   Table as ChakraTable,
//   Thead,
//   Tbody,
//   TableCaption,
//   TableContainer,
//   Heading,
//   Button,
//   Input,
//   Select,
//   Tfoot,
// } from "@chakra-ui/react";
// import { useNavigate } from "react-router-dom";
// import TableCell from "@mui/material/TableCell";
// import TableRow from "@mui/material/TableRow";
// import Pagination from "@mui/material/Pagination";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { FaPrint, FaClipboardList } from "react-icons/fa";
// import ReactToPrint from "react-to-print";
// import * as XLSX from "xlsx";

// function ListExp() {
//   const [page, setPage] = useState(1);
//   const token = localStorage.getItem("token");
//   const limit = 500;
//   const navigate = useNavigate();
//   const [query, setQuery] = useState("");
//   const [createData, setCreateData] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [categoryExpence, setCategoryExpence] = useState("");
//   const [country, setCountry] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [year, setYear] = useState();
//   const [month, setMonth] = useState();
//   let componentRef = useRef();

//   const [isSmallerThan600] = useMediaQuery("(max-width: 600px)");

//   const handlePageChange = (event, value) => {
//     setPage(value);
//   };

//   const handleInputChange = (event) => {
//     setQuery(event.target.value);
//   };
//   const filteredList = createData.filter(
//     (row) =>
//       new Date(row.date).getFullYear() === year &&
//       new Date(row.date).getMonth() === month &&
//       row.country &&
//       row.categoryExpence &&
//       row.categoryExpence.includes(categoryExpence) &&
//       row.country.toLowerCase().includes(country)

//   );
//   const sorted = filteredList.sort((a, b) => new Date(a.date) - Date.now());
//   const handleExportXLSX = () => {
//     const worksheet = XLSX.utils.json_to_sheet(filteredList);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "ExpenseData");
//     XLSX.writeFile(workbook, "expense_data.xlsx");
//   };

//   const TotalBlanceUSD = createData.reduce((sum, products) => {
//     if (products.typeExchange === "美元") {
//       return sum + products.balance;
//     } else {
//       return sum;
//     }
//   }, 0);

//   const TotalBlanceBATH = createData.reduce((sum, products) => {
//     if (products.typeExchange === "泰铢") {
//       return sum + products.balance;
//     } else {
//       return sum;
//     }
//   }, 0);

//   const TotalBlanceKIP = createData.reduce((sum, products) => {
//     if (products.typeExchange === "基普") {
//       return sum + products.balance;
//     } else {
//       return sum;
//     }
//   }, 0);

//   const TotalBlance = createData.reduce((sum, products) => {
//     return sum + products.total;
//   }, 0);

//   const DeleteController = async (id) => {
//     try {
//       setLoading(true);
//       await axios
//         .delete(`http://localhost:8000/api/delete/${id}`)
//         .then((res) => {
//           Swal.fire({
//             title: "成功",
//             text: res.data.message,
//             icon: "success",
//             confirmButtonText: "Close",
//           });
//           setCreateData((prevData) =>
//             prevData.filter((user) => user._id !== id)
//           );
//           setTotal("");
//           setPage("");
//         })
//         .catch((err) => {
//           Swal.fire({
//             title: "无措",
//             text: err.response.data.message,
//             icon: "error",
//             confirmButtonText: "Close",
//           });
//         });
//     } catch (error) {
//       console.error("Failed to fetch products", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `http://localhost:8000/api/listAll?page=${page}&limit=${limit}&categoryExpence=${categoryExpence}`
//         );
//         setCreateData(response.data.products);
//         setTotal(response.data.total);
//       } catch (error) {
//         console.error("Failed to fetch products", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [page, limit, categoryExpence]);

//   const ComponentTable = React.forwardRef((props, ref) => (
//     <Flex
//       direction={isSmallerThan600 ? "column" : "row"}
//       justifyContent="space-between"
//       alignItems="center"
//       paddingTop="30px"
//       gap="20px"
//     >
//       <TableContainer ref={componentRef} width="100%">
//         <Heading textAlign="center" mb={6}>
//           楚盛老挝独资有限公司 月报销单明细表
//         </Heading>
//         <ChakraTable variant="striped" colorScheme="gray">
//           <TableCaption>全部: {total.toLocaleString()}</TableCaption>
//           <Thead>
//             <TableRow>
//               {[
//                 "#",
//                 "年/月/日",
//                 "编号",
//                 "事由",
//                 "金额",
//                 "类型货币",
//                 "汇率",
//                 "类型花费",
//                 "国家",
//                 "总共",
//               ].map((header) => (
//                 <TableCell
//                   key={header}
//                   style={{
//                     textAlign: "center",
//                     color: "black",
//                     fontFamily: "Noto Sans Lao, sans-serif",
//                   }}
//                 >
//                   {header}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </Thead>
//           <Tbody>
//             {filteredList.length > 0 ? (
//               sorted.map((row, index) => (
//                 <TableRow key={row._id}>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>{row.date}</TableCell>
//                   <TableCell>{row.codeNumber}</TableCell>
//                   <TableCell>{row.list}</TableCell>
//                   <TableCell>{row.balance.toLocaleString()}</TableCell>
//                   <TableCell>{row.typeExchange}</TableCell>
//                   <TableCell>{row.exchange}</TableCell>
//                   <TableCell>{row.categoryExpence}</TableCell>
//                   <TableCell>{row.country}</TableCell>
//                   <TableCell>{row.total.toLocaleString()}</TableCell>

//                   <TableCell>
//                     {token && (
//                       <Button
//                         size="sm"
//                         colorScheme="red"
//                         onClick={() => DeleteController(row._id)}
//                       >
//                         删除
//                       </Button>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <Box paddingLeft="550px">
//                 <Text>没有数据</Text>
//               </Box>
//             )}
//           </Tbody>
//           <Tfoot>
//             <TableRow>
//               <TableCell colSpan={9} style={{ textAlign: "right" }}>
//                 美元总支出:
//               </TableCell>
//               <TableCell>{TotalBlanceUSD.toLocaleString()}</TableCell>
//             </TableRow>
//             {country === "泰国" ? (
//               <TableRow>
//                 <TableCell colSpan={9} style={{ textAlign: "right" }}>
//                   泰铢总支出:
//                 </TableCell>
//                 <TableCell>{TotalBlanceBATH.toLocaleString()}</TableCell>
//               </TableRow>
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={9} style={{ textAlign: "right" }}>
//                   基普总支出:
//                 </TableCell>
//                 <TableCell>{TotalBlanceKIP.toLocaleString()}</TableCell>
//               </TableRow>
//             )}
//             <TableRow>
//               <TableCell colSpan={9} style={{ textAlign: "right" }}>
//                 合计:
//               </TableCell>
//               <TableCell>{TotalBlance.toLocaleString()}</TableCell>
//             </TableRow>
//           </Tfoot>
//         </ChakraTable>
//       </TableContainer>
//     </Flex>
//   ));

//   return (
//     <Box>
//       <Stack spacing={6} p={5}>
//         <Flex justify="center" align="center">
//           <Button onClick={() => navigate("/")} mr={5} colorScheme="teal">
//             主页
//           </Button>
//           <Input
//             value={query}
//             onChange={handleInputChange}
//             placeholder="搜索编号"
//             width="200px"
//             mr={5}
//             size="sm"
//           />
//         </Flex>

//         <Flex justify="center" align="center" mb={5}>
//           <ReactToPrint
//             trigger={() => (
//               <Button
//                 colorScheme="blue"
//                 leftIcon={<FaPrint />}
//                 size="sm"
//                 mr={5}
//               >
//                 打印
//               </Button>
//             )}
//             content={() => componentRef.current}
//           />
//           <Button
//             colorScheme="green"
//             leftIcon={<FaClipboardList />}
//             size="sm"
//             onClick={handleExportXLSX}
//           >
//             导出
//           </Button>
//         </Flex>

//         <Flex justify="center" align="center">
//           <Select
//             value={categoryExpence}
//             onChange={(e) => setCategoryExpence(e.target.value)}
//             width="200px"
//             size="sm"
//           >
//             <option value="">选择类型</option>
//             <option value="汽车费">汽车费</option>
//             <option value="办公费">办公费</option>
//             <option value="福利费">福利费</option>
//             <option value="差费">差费</option>
//             <option value="招待费">招待费</option>
//           </Select>
//         </Flex>
//         <Flex justify="center" align="center">
//           <Select
//             value={country}
//             onChange={(e) => setCountry(e.target.value)}
//             width="200px"
//             size="sm"
//           >
//             <option value="">country</option>
//             <option value="泰国">thai</option>
//             <option value="老挝">laos</option>
//           </Select>
//         </Flex>
//         <Flex justify="center" align="center">
//           <Select
//             value={month}
//             onChange={(e) => setMonth(e.target.value)}
//             width="200px"
//             size="sm"
//           >
//             <option value="">月</option>
//             <option value="1">1</option>
//             <option value="2">2</option>
//             <option value="3">3</option>
//             <option value="4">4</option>
//             <option value="5">5</option>
//             <option value="6">6</option>
//             <option value="7">7</option>
//             <option value="8">8</option>
//             <option value="9">9</option>
//             <option value="10">10</option>
//             <option value="11">11</option>
//             <option value="12">12</option>
//           </Select>
//         </Flex>
//         {loading ? (
//           <Flex justify="center">
//             <Spinner />
//           </Flex>
//         ) : (
//           <>
//             <ComponentTable ref={componentRef} />
//             <Flex justify="center" mt={5}>
//               <Pagination
//                 count={Math.ceil(total / limit)}
//                 page={page}
//                 onChange={handlePageChange}
//                 color="primary"
//               />
//             </Flex>
//           </>
//         )}
//       </Stack>
//     </Box>
//   );
// }

// export default ListExp;
