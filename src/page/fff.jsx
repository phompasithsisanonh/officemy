import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Heading,
  Input,
  Stack,
  Text,
  Flex,
  useMediaQuery,
  Spinner,
  Table as ChakraTable, 
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Pagination from "@mui/material/Pagination";
import axios from "axios";
import { FaPrint, FaClipboardList } from "react-icons/fa";
import Swal from "sweetalert2";
import ReactToPrint from "react-to-print";

function ListExp() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  let componentRef = useRef();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/listAll?page=${page}&limit=${limit}&query=${query}`
        );
        setData(response.data.products);
        setTotal(response.data.total);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, limit, query]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Flex direction="column" alignItems="center" p={4}>
      <Heading mb={4}>Expense List</Heading>

      <InputGroup mb={4}>
        <InputLeftAddon>Search</InputLeftAddon>
        <Input value={query} onChange={(e) => setQuery(e.target.value)} />
      </InputGroup>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <TableContainer ref={componentRef}>
            <ChakraTable variant="striped" colorScheme="gray">
              <TableCaption>Total Products: {total}</TableCaption>
              <Thead>
              <TableRow>
              {[
                "#",
                " date",
                "codeNumber",
                "list",
                " balance",
                "typeExchange",
                "exchange",
                "categoryExpence",
                "edit",
                "Delete",
              ].map((header) => (
                <TableCell
                  key={header}
                  style={{
                    textAlign: "center",
                    color: "rgb(255, 255, 255)",
                    fontFamily: "Noto Sans Lao, sans-serif",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
              </Thead>
              <Tbody>
              {filteredList.map((row, index) => (
              <TableRow key={row._id}>
                <TableCell
                  style={{
                    textAlign: "center",
                    color: "rgb(255, 255, 255)",
                  }}
                >
                  {index + 1}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "center",
                    color: "rgb(255, 255, 255)",
                  }}
                >
                  {row.date}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "center",
                    color: "rgb(255, 255, 255)",
                  }}
                  component="th"
                >
                  {row.codeNumber}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "center",
                    color: "rgb(255, 255, 255)",
                  }}
                  align="right"
                >
                  {row.list}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "center",
                    color: "rgb(255, 255, 255)",
                  }}
                  align="right"
                >
                  {row.balance.toLocaleString()}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "center",
                    color: "rgb(255, 255, 255)",
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
                  >
                    {row.categoryExpence}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <button className="com0">Edit</button>
                </TableCell>
                <TableCell align="right">
                  <button className="com1">Delete</button>
                </TableCell>
              </TableRow>
            ))}
              </Tbody>
            </ChakraTable>
          </TableContainer>
          <Pagination
            count={Math.ceil(total / limit)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            mt={4}
          />
        </>
      )}
    </Flex>
  );
}

export default ListExp;