"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { StatsCard } from "@/components/admin/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Package, Users, ShoppingCart, TrendingUp, Activity, DollarSign, Eye } from "lucide-react"

const statsData = [
  {
    title: "Revenus Totaux",
    value: "€2,456,789",
    change: "+23.5%",
    trend: "up" as const,
    icon: DollarSign,
    gradient: "bg-gradient-to-r from-green-500 to-emerald-600",
  },
  {
    title: "Produits Actifs",
    value: "1,247",
    change: "+12.3%",
    trend: "up" as const,
    icon: Package,
    gradient: "bg-gradient-to-r from-blue-500 to-cyan-600",
  },
  {
    title: "Utilisateurs",
    value: "8,432",
    change: "+18.2%",
    trend: "up" as const,
    icon: Users,
    gradient: "bg-gradient-to-r from-purple-500 to-pink-600",
  },
  {
    title: "Commandes",
    value: "2,156",
    change: "+7.4%",
    trend: "up" as const,
    icon: ShoppingCart,
    gradient: "bg-gradient-to-r from-orange-500 to-red-600",
  },
]

const salesData = [
  { month: "Jan", sales: 45000, orders: 234, users: 1200 },
  { month: "Fév", sales: 52000, orders: 267, users: 1350 },
  { month: "Mar", sales: 48000, orders: 245, users: 1280 },
  { month: "Avr", sales: 61000, orders: 312, users: 1450 },
  { month: "Mai", sales: 55000, orders: 289, users: 1380 },
  { month: "Jun", sales: 67000, orders: 356, users: 1520 },
  { month: "Jul", sales: 72000, orders: 398, users: 1680 },
]

const categoryData = [
  { name: "CPU", value: 35, color: "#8884d8", sales: 450000 },
  { name: "GPU", value: 28, color: "#82ca9d", sales: 380000 },
  { name: "RAM", value: 20, color: "#ffc658", sales: 280000 },
  { name: "Storage", value: 17, color: "#ff7300", sales: 220000 },
]

const topProducts = [
  { name: "Intel Core i9-14900K", sales: 234, revenue: 137826, trend: "+12%" },
  { name: "NVIDIA RTX 4080 Super", sales: 156, revenue: 155984, trend: "+8%" },
  { name: "AMD Ryzen 9 7950X", sales: 189, revenue: 103951, trend: "+15%" },
  { name: "Corsair Vengeance DDR5", sales: 89, revenue: 16911, trend: "+5%" },
]

const recentActivity = [
  {
    id: 1,
    type: "order",
    message: "Nouvelle commande #1245 - €1,299.99",
    time: "Il y a 2 minutes",
    status: "success",
  },
  {
    id: 2,
    type: "user",
    message: "Nouvel utilisateur inscrit: alice@example.com",
    time: "Il y a 5 minutes",
    status: "info",
  },
  {
    id: 3,
    type: "stock",
    message: "Stock faible: NVIDIA RTX 4080 (8 unités)",
    time: "Il y a 15 minutes",
    status: "warning",
  },
  {
    id: 4,
    type: "product",
    message: "Produit ajouté: AMD Ryzen 7 7700X",
    time: "Il y a 1 heure",
    status: "success",
  },
]

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Vue d'ensemble de votre plateforme e-commerce</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Voir le site
            </Button>
            <Button>
              <Activity className="h-4 w-4 mr-2" />
              Rapport en temps réel
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Évolution des Ventes</span>
              </CardTitle>
              <CardDescription>Chiffre d'affaires et commandes des 7 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-purple-600" />
                <span>Répartition par Catégorie</span>
              </CardTitle>
              <CardDescription>Ventes par catégorie de produits</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Products */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Produits les plus vendus</CardTitle>
              <CardDescription>Top 4 des meilleures ventes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} ventes</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">€{product.revenue.toLocaleString()}</p>
                      <Badge variant="secondary" className="text-xs">
                        {product.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
              <CardDescription>Dernières actions sur la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === "success"
                          ? "bg-green-500"
                          : activity.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>État du Système</CardTitle>
              <CardDescription>Monitoring en temps réel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Serveur</span>
                  <Badge className="bg-green-100 text-green-800">En ligne</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Base de données</span>
                  <Badge className="bg-green-100 text-green-800">Opérationnelle</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API</span>
                  <Badge className="bg-green-100 text-green-800">Stable</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Stockage</span>
                  <Badge className="bg-yellow-100 text-yellow-800">78% utilisé</Badge>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Activity className="h-4 w-4 mr-2" />
                    Voir les détails
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
