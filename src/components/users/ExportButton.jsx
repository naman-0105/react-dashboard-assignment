import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Function to export to CSV
const exportToCSV = (users) => {
  const headers = [
    "Name",
    "Type",
    "Country",
    "Signed Up",
    "Email",
    "Role",
    "User ID",
  ];

  const rows = users.map((user) => [
    user.name,
    user.type || "Unassigned",
    user.country || "",
    new Date(user.signedUp || user.createdAt).toLocaleDateString(),
    user.email,
    user.role || "Employee",
    user.userId || "",
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // Create a blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "users_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to export to Excel (simplified for demonstration)
const exportToExcel = (users) => {
  const headers = [
    "Name",
    "Type",
    "Country",
    "Signed Up",
    "Email",
    "Role",
    "User ID",
  ];

  const data = users.map((user) => ({
    Name: user.name,
    Type: user.type || "Unassigned",
    Country: user.country || "",
    "Signed Up": new Date(user.signedUp || user.createdAt).toLocaleDateString(),
    Email: user.email,
    Role: user.role || "Employee",
    "User ID": user.userId || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  // Create and download the Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "users_export.xlsx");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToPDF = (users) => {
  const doc = new jsPDF();

  const headers = [
    ["Name", "Type", "Country", "Signed Up", "Email", "Role", "User ID"],
  ];

  const rows = users.map((user) => [
    user.name,
    user.type || "Unassigned",
    user.country || "",
    new Date(user.signedUp || user.createdAt).toLocaleDateString(),
    user.email,
    user.role || "Employee",
    user.userId || "",
  ]);

  doc.setFontSize(16);
  doc.text("Users Report", 14, 15);

  autoTable(doc, {
    startY: 20,
    head: headers,
    body: rows,
  });

  doc.save("users_report.pdf");
};

export function ExportButton({ users }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = () => {
    const text = users
      .map((user) => `${user.name}, ${user.email}, ${user.role || "Employee"}`)
      .join("\n");

    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("User data copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-9 ${
            isOpen ? "ring-2 ring-blue-600 ring-offset-1" : ""
          }`}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>OPTIONS</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
          Copy
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrint} className="cursor-pointer">
          Print
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>DOWNLOAD OPTIONS</DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => exportToExcel(users)}
          className="cursor-pointer flex items-center"
        >
          <span className="bg-green-600 w-5 h-5 rounded-sm flex items-center justify-center mr-2">
            <Download className="h-3 w-3 text-white" />
          </span>
          Excel
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => exportToCSV(users)}
          className="cursor-pointer flex items-center"
        >
          <span className="bg-blue-600 w-5 h-5 rounded-sm flex items-center justify-center mr-2">
            <Download className="h-3 w-3 text-white" />
          </span>
          CSV
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => exportToPDF(users)}
          className="cursor-pointer flex items-center"
        >
          <span className="bg-red-600 w-5 h-5 rounded-sm flex items-center justify-center mr-2">
            <Download className="h-3 w-3 text-white" />
          </span>
          PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
