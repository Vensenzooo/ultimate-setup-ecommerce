"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { DataTable } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Plus, Users, UserCheck, UserX, Shield } from "lucide-react"
import { apiClient } from "@/lib/api/client"

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  orders: number;
  totalSpent: number;
  lastLogin: string;
  createdAt: string;
  avatar: string;
}

const permissions = [
  { id: "products.read", name: "Voir les produits", category: "Produits" },
  { id: "products.write", name: "Modifier les produits", category: "Produits" },
  { id: "products.delete", name: "Supprimer les produits", category: "Produits" },
  { id: "users.read", name: "Voir les utilisateurs", category: "Utilisateurs" },
  { id: "users.write", name: "Modifier les utilisateurs", category: "Utilisateurs" },
  { id: "users.delete", name: "Supprimer les utilisateurs", category: "Utilisateurs" },
  { id: "orders.read", name: "Voir les commandes", category: "Commandes" },
  { id: "orders.write", name: "Modifier les commandes", category: "Commandes" },
  { id: "analytics.read", name: "Voir les analytics", category: "Analytics" },
  { id: "settings.write", name: "Modifier les paramètres", category: "Système" },
]

const columns = [
  {
    key: "name",
    label: "Utilisateur",
    render: (value: string, row: any) => (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {value
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-sm text-gray-500">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    label: "Rôle",
    render: (value: string) => (
      <Badge variant={value === "Admin" ? "default" : value === "Modérateur" ? "secondary" : "outline"}>{value}</Badge>
    ),
  },
  {
    key: "status",
    label: "Statut",
    render: (value: string) => <Badge variant={value === "Actif" ? "default" : "secondary"}>{value}</Badge>,
  },
  {
    key: "orders",
    label: "Commandes",
  },
  {
    key: "totalSpent",
    label: "Total Dépensé",
    render: (value: number) => `€${value.toFixed(2)}`,
  },
  {
    key: "lastLogin",
    label: "Dernière Connexion",
  },
]

export default function UsersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  })
  const [userPermissions, setUserPermissions] = useState<string[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    apiClient.get<User[]>("users")
      .then(setUsers)
      .catch((err) => setError(err.message || "Erreur de chargement"))
      .finally(() => setLoading(false))
  }, [])

  const handleCreateUser = () => {
    console.log("Creating user:", newUser)
    setIsCreateDialogOpen(false)
    setNewUser({ name: "", email: "", role: "", password: "" })
  }

  const handleEdit = (user: User) => {
    console.log("Editing user:", user)
  }

  const handleDelete = (user: User) => {
    console.log("Deleting user:", user)
  }

  const handleView = (user: User) => {
    console.log("Viewing user:", user)
  }

  const handleManagePermissions = (user: User) => {
    setSelectedUser(user)
    setIsPermissionsDialogOpen(true)
  }

  const togglePermission = (permissionId: string) => {
    setUserPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((p) => p !== permissionId) : [...prev, permissionId],
    )
  }

  const groupedPermissions = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, typeof permissions>,
  )

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
            <p className="text-gray-600 mt-1">Gérez les utilisateurs, rôles et permissions</p>
          </div>
          <div className="flex items-center space-x-3">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
                  <DialogDescription>Ajoutez un nouvel utilisateur au système</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="jean@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Rôle</Label>
                      <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Client">Client</SelectItem>
                          <SelectItem value="Modérateur">Modérateur</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe temporaire</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateUser}>Créer l'utilisateur</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                  <p className="text-2xl font-bold text-gray-900">8,432</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                  <p className="text-2xl font-bold text-green-600">7,891</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisateurs Inactifs</p>
                  <p className="text-2xl font-bold text-orange-600">541</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <UserX className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Administrateurs</p>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Liste des Utilisateurs</CardTitle>
            <CardDescription>Gérez tous les utilisateurs de la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Chargement...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <DataTable
                data={users}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                selectable
              />
            )}
          </CardContent>
        </Card>

        {/* Permissions Dialog */}
        <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Gérer les Permissions</DialogTitle>
              <DialogDescription>Configurez les permissions pour {selectedUser?.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(([category, perms]) => (
                <div key={category} className="space-y-3">
                  <h4 className="font-semibold text-gray-900">{category}</h4>
                  <div className="space-y-2">
                    {perms.map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{permission.name}</p>
                        </div>
                        <Switch
                          checked={userPermissions.includes(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsPermissionsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsPermissionsDialogOpen(false)}>Sauvegarder</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
