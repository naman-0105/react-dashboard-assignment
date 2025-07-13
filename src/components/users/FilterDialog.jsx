import React, { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function FilterDialog({ onFilter }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("All");
  const [type, setType] = useState("Any");
  const [signedUp, setSignedUp] = useState("Any status");
  const [location, setLocation] = useState("Any location");

  const handleApply = () => {
    onFilter({ role, type, signedUp, location });
    setOpen(false);
  };

  const handleClear = () => {
    setRole("All");
    setType("Any");
    setSignedUp("Any status");
    setLocation("");
    onFilter({
      role: "All",
      type: "Any",
      signedUp: "Any status",
      location: "",
    });
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-9 ${open ? "ring-2 ring-blue-600 ring-offset-1" : ""}`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[300px] p-4 space-y-4 mr-12">
        <div className="grid gap-2">
          <Label htmlFor="role">ROLE</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {["All", "Employee", "Owner", "Admin"].map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="type">TYPE</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {["Any", "Subscription", "Non-subscription", "Unassigned"].map(
                (option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    {option}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="signedUp">SIGNED UP</Label>
          <Select value={signedUp} onValueChange={setSignedUp}>
            <SelectTrigger id="signedUp">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {["Any status", "1 year ago", "6 months ago"].map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="location">LOCATION</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger id="location">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {[
                "Any location",
                "India",
                "United States",
                "United Kingdom",
                "Japan",
                "France",
                "Australia",
                "Germany",
                "Brazil",
                "Switzerland",
              ].map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-3 px-1">
          <Button variant="outline" onClick={handleClear} size="sm">
            Clear
          </Button>
          <Button onClick={handleApply} size="sm">
            Apply
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
