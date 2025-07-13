import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [openDialog, setOpenDialog] = useState(null);
  const navigate = useNavigate();
  
  const handleSignOut = () => {
    logout();
    navigate('/');
  };
  
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold px-6">Dashboard</h1>
        
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="primary" className="h-11 w-11 rounded-full mr-7">
                <Avatar className="h-11 w-11">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setOpenDialog("profile")}
              >
                Profile & account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>


      {/* Dialogs */}
      <Dialog
        open={openDialog === "profile"}
        onOpenChange={() => setOpenDialog(null)}
      >
        <DialogContent>
          <div className="flex flex-col items-center justify-center text-center space-y-6 py-6">
            <DialogHeader className="flex flex-col items-center justify-center text-center">
              <DialogTitle>Profile & Account</DialogTitle>
              <DialogDescription>
                Manage your profile information and account settings.
              </DialogDescription>
            </DialogHeader>

            <Avatar className="h-20 w-20 shadow-md border">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="text-center space-y-1">
              <p className="text-sm text-gray-500 font-medium">Email</p>
              <p className="text-md font-semibold text-gray-800">
                {user?.email}
              </p>
            </div>

            <DialogFooter>
              <Button onClick={() => setOpenDialog(null)}>Close</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}