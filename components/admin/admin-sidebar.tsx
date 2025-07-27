"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  BarChart3,
  AlertTriangle,
  FileText,
  Database,
  Shield,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react"
import Link from "next/link"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    current: true,
  },
  {
    name: "Produits",
    href: "/admin/products",
    icon: Package,
    current: false,
    badge: "1,247",
  },
  {
    name: "Utilisateurs",
    href: "/admin/users",
    icon: Users,
    current: false,
    badge: "8,432",
  },
  {
    name: "Commandes",
    href: "/admin/orders",
    icon: ShoppingCart,
    current: false,
    badge: "156",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    current: false,
  },
  {
    name: "Alertes",
    href: "/admin/alerts",
    icon: AlertTriangle,
    current: false,
    badge: "3",
    badgeVariant: "destructive" as const,
  },
  {
    name: "Logs",
    href: "/admin/logs",
    icon: FileText,
    current: false,
  },
  {
    name: "Base de données",
    href: "/admin/database",
    icon: Database,
    current: false,
  },
  {
    name: "Permissions",
    href: "/admin/permissions",
    icon: Shield,
    current: false,
  },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    current: false,
  },
  {
    name: "Paramètres",
    href: "/admin/settings",
    icon: Settings,
    current: false,
  },
]

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">US</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Ultimate Setup</h2>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0 hover:bg-gray-100">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                item.current
                  ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <Icon
                className={cn(
                  "flex-shrink-0 h-5 w-5 transition-colors",
                  item.current ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600",
                )}
              />
              {!collapsed && (
                <>
                  <span className="ml-3 truncate">{item.name}</span>
                  {item.badge && (
                    <Badge variant={item.badgeVariant || "secondary"} className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@ultimatesetup.com</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button variant="ghost" size="sm" className="w-full mt-2 justify-start text-gray-600 hover:text-gray-900">
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        )}
      </div>
    </div>
  )
}
