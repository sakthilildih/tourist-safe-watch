import { SidebarTrigger } from "@/components/ui/sidebar";
import { Shield, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Tourist Safety Dashboard</h1>
            <p className="text-sm text-muted-foreground">Tourism Department & Police</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
            3
          </span>
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}