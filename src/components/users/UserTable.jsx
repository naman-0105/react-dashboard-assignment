// components/users/UserTable.js
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function UserTable({ users }) {
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  useEffect(() => {
  setPage(1);
}, [users]);

  const usersPerPage = 10;
  const totalPages = Math.ceil(users.length / usersPerPage);

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMonths =
      (now.getFullYear() - date.getFullYear()) * 12 +
      now.getMonth() -
      date.getMonth();

    if (diffMonths >= 12) {
      return "1 year ago";
    } else {
      return "6 months ago";
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    if (!sortConfig.key || !sortConfig.direction) return data;

    return [...data].sort((a, b) => {
      let aValue, bValue;

      // Handle special cases for different column types
      switch (sortConfig.key) {
        case "name":
          aValue = a.name ? a.name.toLowerCase() : "";
          bValue = b.name ? b.name.toLowerCase() : "";
          break;
        case "userId":
          aValue = a.userId ? parseInt(a.userId, 10) : 0;
          bValue = b.userId ? parseInt(b.userId, 10) : 0;
          break;
        case "signedUp":
          aValue = new Date(a.signedUp || a.createdAt || 0).getTime();
          bValue = new Date(b.signedUp || b.createdAt || 0).getTime();
          break;
        default:
          aValue = a[sortConfig.key]
            ? String(a[sortConfig.key]).toLowerCase()
            : "";
          bValue = b[sortConfig.key]
            ? String(b[sortConfig.key]).toLowerCase()
            : "";
      }

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  const getDualSortIcons = (columnName) => {
    const isSorted = sortConfig.key === columnName;

    return (
      <div className="flex flex-col ml-2 text-[8px] leading-none">
        <span
          className={`${
            isSorted && sortConfig.direction === "ascending"
              ? "text-blue-500"
              : "text-gray-200"
          }`}
        >
          ▲
        </span>
        <span
          className={`${
            isSorted && sortConfig.direction === "descending"
              ? "text-blue-500"
              : "text-gray-200"
          }`}
        >
          ▼
        </span>
      </div>
    );
  };

  // Apply sorting and pagination
  const sortedUsers = getSortedData([...users]);
  const paginatedUsers = sortedUsers.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-gray-50 px-4"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center px-4 text-gray-900">
                  <span>NAME</span>
                  {getDualSortIcons("name")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("type")}
              >
                <div className="flex items-center text-gray-900">
                  TYPE {getDualSortIcons("type")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("country")}
              >
                <div className="flex items-center text-gray-900">
                  COUNTRY {getDualSortIcons("country")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("signedUp")}
              >
                <div className="flex items-center text-gray-900">
                  SIGNED UP {getDualSortIcons("signedUp")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("email")}
              >
                <div className="flex items-center text-gray-900">
                  EMAIL {getDualSortIcons("email")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("role")}
              >
                <div className="flex items-center text-gray-900">
                  ROLE {getDualSortIcons("role")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("userId")}
              >
                <div className="flex items-center text-gray-900">
                  USER ID {getDualSortIcons("userId")}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow
                  key={user._id || user.userId || Math.random().toString()}
                >
                  <TableCell className="w-[350px] min-w-[250px] px-7">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        ) : (
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-[350px] min-w-[150px]">
                    {user.type || "Unassigned"}
                  </TableCell>
                  <TableCell className="w-[350px] min-w-[150px]">
                    {user.country || "United States"}
                  </TableCell>
                  <TableCell className="w-[350px] min-w-[150px]">
                    {formatDate(user.signedUp || user.createdAt)}
                  </TableCell>
                  <TableCell className="w-[350px] min-w-[150px]">
                    {user.email}
                  </TableCell>
                  <TableCell className="w-[250px] min-w-[150px]">
                    {user.role || "Employee"}
                  </TableCell>
                  <TableCell className="w-[150px] min-w-[150px]">
                    {user.userId || "12345"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 w-[250px] min-w-[150px]"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {users.length > 0 && (
        <div className="justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing: {Math.min(page * usersPerPage, users.length)} of{" "}
            {users.length}
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                const pageNumber = page <= 2 ? i + 1 : page - 1 + i;
                if (pageNumber <= totalPages) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={page === pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`cursor-pointer px-3 py-1 rounded-md transition-colors ${
                          page === pageNumber
                            ? "bg-blue-500 text-white"
                            : "bg-transparent text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={page === totalPages}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
