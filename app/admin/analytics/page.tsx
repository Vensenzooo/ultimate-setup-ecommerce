"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  Download,
  BarChart3,
  PieChartIcon,
  LineChartIcon,
  AlertTriangle,
} from "lucide-react"

const salesData = [
  { month: "Jan", sales: 45000, orders: 120, users: 1200 },
  { month: "Fév", sales: 52000, orders: 145, users: 1350 },
  { month: "Mar", sales: 48000, orders: 132, users: 1280 },
  { month: "Avr", sales: 61000, orders: 168, users: 1520 },
  { month: "Mai", sales: 55000, orders: 155, users: 1420 },
  { month: "Jun", sales: 67000, orders: 189, users: 1680 },
  { month: "Jul", sales: 72000, orders: 205, users: 1850 },
  { month: "Aoû", sales: 69000, orders: 198, users: 1780 },
  { month: "Sep", sales: 78000, orders: 225, users: 1950 },
  { month: "Oct", sales: 82000, orders: 240, users: 2100 },
  { month: "Nov", sales: 89000, orders: 265, users: 2280 },
  { month: "Déc", sales: 95000, orders: 285, users: 2450 },
]

const categoryData = [
  { name: "Processeurs", value: 35, color: "#3b82f6" },
  { name: "Cartes graphiques", value: 28, color: "#ef4444" },
  { name: "Mémoire RAM", value: 15, color: "#10b981" },
  { name: "Stockage", value: 12, color: "#f59e0b" },
  { name: "Cartes mères", value: 10, color: "#8b5cf6" },
]

const topProducts = [
  { name: "AMD Ryzen 7 7800X3D", sales: 1250, revenue: 561250, growth: 15.2 },
  { name: "NVIDIA RTX 4080 SUPER", sales: 890, revenue: 1067110, growth: 8.7 },
  { name: "Intel Core i7-13700K", sales: 1120, revenue: 435680, growth: -2.1 },
  { name: "G.Skill Trident Z5 32GB", sales: 2340, revenue: 442260, growth: 12.5 },
  { name: "Samsung 980 PRO 2TB", sales: 1890, revenue: 300510, growth: 6.8 },
]

const userBehaviorData = [
  { page: "Accueil", views: 45230, bounceRate: 32, avgTime: "2:45" },
  { page: "Catalogue", views: 38920, bounceRate: 28, avgTime: "4:12" },
  { page: "Configurateur", views: 15680, bounceRate: 18, avgTime: "8:35" },
  { page: "Comparateur", views: 12450, bounceRate: 22, avgTime: "5:28" },
  { page: "Produit", views: 28760, bounceRate: 35, avgTime: "3:15" },
]

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-gray-600">Analyse détaillée des performances de votre plateforme</p>
          </div>
          <div className="flex items-center gap-4">
            <Select defaultValue="30d">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 derniers jours</SelectItem>
                <SelectItem value="30d">30 derniers jours</SelectItem>
                <SelectItem value="90d">90 derniers jours</SelectItem>
                <SelectItem value="1y">1 an</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€847,230</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% vs mois dernier
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2% vs mois dernier
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nouveaux utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2.1% vs mois dernier
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.24%</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.3% vs mois dernier
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              Ventes
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Catégories
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Produits
            </TabsTrigger>
            <TabsTrigger value="behavior" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Comportement
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des ventes</CardTitle>
                  <CardDescription>Chiffre d'affaires mensuel sur 12 mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      sales: {
                        label: "Ventes",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          stroke="var(--color-sales)"
                          strokeWidth={2}
                          dot={{ fill: "var(--color-sales)" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Commandes et utilisateurs</CardTitle>
                  <CardDescription>Évolution mensuelle</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      orders: {
                        label: "Commandes",
                        color: "hsl(var(--chart-2))",
                      },
                      users: {
                        label: "Utilisateurs",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={2} />
                        <Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} />
                        <Legend />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par catégorie</CardTitle>
                  <CardDescription>Pourcentage des ventes par catégorie</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Pourcentage",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance par catégorie</CardTitle>
                  <CardDescription>Détails des ventes par catégorie</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryData.map((category) => (
                      <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{category.value}%</div>
                          <div className="text-sm text-gray-500">des ventes</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top produits</CardTitle>
                <CardDescription>Produits les plus vendus ce mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.sales} ventes</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">€{product.revenue.toLocaleString()}</div>
                        <div
                          className={`text-sm flex items-center gap-1 ${
                            product.growth > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {product.growth > 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {Math.abs(product.growth)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Comportement utilisateur</CardTitle>
                <CardDescription>Analyse du trafic et engagement par page</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userBehaviorData.map((page) => (
                    <div key={page.page} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{page.page}</div>
                        <div className="text-sm text-gray-500">{page.views.toLocaleString()} vues</div>
                      </div>
                      <div className="flex items-center gap-8 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{page.bounceRate}%</div>
                          <div className="text-gray-500">Rebond</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{page.avgTime}</div>
                          <div className="text-gray-500">Temps moyen</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trafic par source</CardTitle>
                  <CardDescription>Origine des visiteurs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Recherche organique</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Réseaux sociaux</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-12 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">28%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Publicité payante</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-8 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">18%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Direct</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-4 h-2 bg-orange-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">9%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appareils utilisés</CardTitle>
                  <CardDescription>Répartition par type d'appareil</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Desktop</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-14 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">62%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Mobile</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-10 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">32%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tablette</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">6%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Insights et recommandations</CardTitle>
            <CardDescription>Analyses automatiques basées sur vos données</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Tendance positive</span>
                </div>
                <p className="text-sm text-green-700">
                  Les ventes de processeurs AMD ont augmenté de 15% ce mois-ci, principalement grâce au 7800X3D.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Opportunité</span>
                </div>
                <p className="text-sm text-blue-700">
                  Le configurateur a un taux de conversion élevé (8.2%). Considérez augmenter le trafic vers cette page.
                </p>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Attention</span>
                </div>
                <p className="text-sm text-orange-700">
                  Le taux de rebond sur la page d'accueil est de 32%. Optimisez le contenu pour améliorer l'engagement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
