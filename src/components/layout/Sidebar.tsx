
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Settings, 
  CreditCard, 
  Users, 
  Package, 
  ListChecks, 
  Zap, 
  Code2, 
  Webhook
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ElementType;
  title: string;
  to: string;
  collapsed: boolean;
}

const SidebarItem = ({ icon: Icon, title, to, collapsed }: SidebarItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )
      }
    >
      <Icon className="h-5 w-5" />
      <span className={cn("transition-all duration-200", collapsed ? "opacity-0 w-0" : "opacity-100")}>{title}</span>
    </NavLink>
  );
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "h-screen flex flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        <h1 className={cn("font-semibold text-xl transition-all duration-200", collapsed ? "opacity-0 w-0" : "opacity-100")}>Admin SaaS</h1>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-secondary"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          )}
        </button>
      </div>
      
      <div className="flex flex-col gap-1 p-2 flex-1">
        <SidebarItem icon={LayoutDashboard} title="Dashboard" to="/" collapsed={collapsed} />
        <SidebarItem icon={Package} title="Produtos" to="/produtos" collapsed={collapsed} />
        <SidebarItem icon={Settings} title="Config. Checkout" to="/configuracao" collapsed={collapsed} />
        <SidebarItem icon={Zap} title="PIX Checkout" to="/pix" collapsed={collapsed} />
        <SidebarItem icon={Code2} title="Pixels & Eventos" to="/pixels" collapsed={collapsed} />
        <SidebarItem icon={Webhook} title="Webhooks" to="/webhooks" collapsed={collapsed} />
        <SidebarItem icon={CreditCard} title="Cartões" to="/cardcapture" collapsed={collapsed} />
      </div>
      
      <div className="flex flex-col gap-1 p-2 border-t border-border">
        <SidebarItem icon={Users} title="Clientes" to="/clientes" collapsed={collapsed} />
        <SidebarItem icon={ShoppingCart} title="Vendas" to="/vendas" collapsed={collapsed} />
      </div>
    </div>
  );
}
