"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useCart } from "@/hooks/use-cart"
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Monitor,
  Zap,
  Box,
  CircuitBoardIcon as Motherboard,
  ShoppingCart,
  Info,
  AlertTriangle,
  CheckCircle,
  Star,
  TrendingUp,
  Flame,
  Award,
} from "lucide-react"

const componentCategories = [
  { id: "cpu", name: "Processeur", icon: Cpu, required: true },
  { id: "motherboard", name: "Carte mère", icon: Motherboard, required: true },
  { id: "ram", name: "Mémoire RAM", icon: MemoryStick, required: true },
  { id: "gpu", name: "Carte graphique", icon: Monitor, required: true },
  { id: "storage", name: "Stockage", icon: HardDrive, required: true },
  { id: "psu", name: "Alimentation", icon: Zap, required: true },
  { id: "case", name: "Boîtier", icon: Box, required: false },
]

const mockComponents = {
  cpu: [
    {
      id: "cpu-1",
      name: "AMD Ryzen 7 7800X3D",
      price: 449,
      image: "/placeholder.svg?height=200&width=200&text=AMD+7800X3D",
      description: "Processeur gaming haute performance avec technologie 3D V-Cache",
      specifications: {
        cores: 8,
        threads: 16,
        baseClock: "4.2 GHz",
        boostClock: "5.0 GHz",
        cache: "96MB",
        tdp: "120W",
        socket: "AM5",
        architecture: "Zen 4",
      },
      compatibility: { socket: "AM5", maxRam: 128, ramSpeed: 5200 },
      badges: ["Populaire", "Gaming"],
      rating: 4.9,
      pros: ["Excellent pour le gaming", "Cache 3D révolutionnaire", "Efficacité énergétique"],
      cons: ["Prix élevé", "Pas idéal pour la productivité pure"],
    },
    {
      id: "cpu-2",
      name: "Intel Core i7-13700K",
      price: 389,
      image: "/placeholder.svg?height=200&width=200&text=Intel+13700K",
      description: "Processeur polyvalent avec architecture hybride P-cores et E-cores",
      specifications: {
        cores: 16,
        threads: 24,
        baseClock: "3.4 GHz",
        boostClock: "5.4 GHz",
        cache: "30MB",
        tdp: "125W",
        socket: "LGA1700",
        architecture: "Raptor Lake",
      },
      compatibility: { socket: "LGA1700", maxRam: 128, ramSpeed: 5600 },
      badges: ["Nouveau", "Polyvalent"],
      rating: 4.7,
      pros: ["Excellent multitâche", "Bon rapport qualité-prix", "Compatible DDR4/DDR5"],
      cons: ["Consommation élevée", "Chauffe beaucoup"],
    },
  ],
  motherboard: [
    {
      id: "mb-1",
      name: "ASUS ROG STRIX X670E-E",
      price: 329,
      image: "/placeholder.svg?height=200&width=200&text=ASUS+X670E",
      description: "Carte mère haut de gamme pour processeurs AMD AM5",
      specifications: {
        socket: "AM5",
        chipset: "X670E",
        ramSlots: 4,
        maxRam: "128GB",
        ramSpeed: "DDR5-6000+",
        pciSlots: "3x PCIe 5.0 x16",
        storage: "4x M.2, 8x SATA",
        usb: "USB 3.2 Gen 2x2, USB-C",
        ethernet: "2.5Gb LAN",
        wifi: "WiFi 6E",
      },
      compatibility: { socket: "AM5", supportedCpus: ["7800X3D", "7700X", "7600X"] },
      badges: ["Premium", "WiFi 6E"],
      rating: 4.8,
      pros: ["Excellente connectivité", "BIOS intuitif", "Refroidissement optimal"],
      cons: ["Prix élevé", "Taille imposante"],
    },
  ],
  ram: [
    {
      id: "ram-1",
      name: "G.Skill Trident Z5 32GB DDR5-6000",
      price: 189,
      image: "/placeholder.svg?height=200&width=200&text=G.Skill+DDR5",
      description: "Kit mémoire DDR5 haute performance avec RGB",
      specifications: {
        capacity: "32GB (2x16GB)",
        type: "DDR5",
        speed: "6000 MHz",
        timings: "CL30-38-38-96",
        voltage: "1.35V",
        rgb: "Oui",
        heatspreader: "Aluminium",
      },
      compatibility: { type: "DDR5", speed: 6000 },
      badges: ["RGB", "Haute Performance"],
      rating: 4.6,
      pros: ["Excellentes performances", "RGB personnalisable", "Bon overclocking"],
      cons: ["Prix élevé", "Timings moyens"],
    },
  ],
  gpu: [
    {
      id: "gpu-1",
      name: "NVIDIA RTX 4080 SUPER",
      price: 1199,
      image: "/placeholder.svg?height=200&width=200&text=RTX+4080+SUPER",
      description: "Carte graphique haut de gamme pour gaming 4K et ray tracing",
      specifications: {
        gpu: "AD103",
        vram: "16GB GDDR6X",
        baseClock: "2295 MHz",
        boostClock: "2550 MHz",
        memorySpeed: "23 Gbps",
        busWidth: "256-bit",
        rtCores: "76",
        tensorCores: "304",
        powerConsumption: "320W",
      },
      compatibility: { minPsu: 750, pciSlots: 3 },
      badges: ["4K Ready", "Ray Tracing"],
      rating: 4.8,
      pros: ["Excellent en 4K", "Ray tracing performant", "DLSS 3.0"],
      cons: ["Prix très élevé", "Consommation importante"],
    },
  ],
  storage: [
    {
      id: "storage-1",
      name: "Samsung 980 PRO 2TB",
      price: 159,
      image: "/placeholder.svg?height=200&width=200&text=Samsung+980+PRO",
      description: "SSD NVMe PCIe 4.0 ultra-rapide pour gaming et création",
      specifications: {
        capacity: "2TB",
        interface: "PCIe 4.0 x4",
        formFactor: "M.2 2280",
        readSpeed: "7000 MB/s",
        writeSpeed: "5100 MB/s",
        tbw: "1200 TBW",
        warranty: "5 ans",
      },
      compatibility: { interface: "M.2", pcie: "4.0" },
      badges: ["PCIe 4.0", "Gaming"],
      rating: 4.7,
      pros: ["Vitesses exceptionnelles", "Fiabilité Samsung", "Bon rapport Go/€"],
      cons: ["Chauffe un peu", "Cache SLC limité"],
    },
  ],
  psu: [
    {
      id: "psu-1",
      name: "Corsair RM850x 850W 80+ Gold",
      price: 139,
      image: "/placeholder.svg?height=200&width=200&text=Corsair+RM850x",
      description: "Alimentation modulaire silencieuse avec certification 80+ Gold",
      specifications: {
        wattage: "850W",
        efficiency: "80+ Gold",
        modular: "Entièrement modulaire",
        fan: "135mm FDB",
        rails: "+12V single rail",
        protection: "OVP, UVP, OCP, OTP, SCP",
        warranty: "10 ans",
      },
      compatibility: { wattage: 850, efficiency: "80+ Gold" },
      badges: ["Modulaire", "Silencieux"],
      rating: 4.8,
      pros: ["Très silencieux", "Câbles de qualité", "Garantie 10 ans"],
      cons: ["Prix premium", "Ventilateur parfois audible"],
    },
  ],
  case: [
    {
      id: "case-1",
      name: "Fractal Design Define 7",
      price: 179,
      image: "/placeholder.svg?height=200&width=200&text=Fractal+Define+7",
      description: "Boîtier ATX silencieux avec excellent airflow",
      specifications: {
        type: "ATX Mid Tower",
        dimensions: "240 x 475 x 547mm",
        motherboard: "ATX, mATX, ITX",
        gpuClearance: "440mm",
        cpuClearance: "185mm",
        fans: "3x 140mm inclus",
        radiator: "360mm top/front",
        drives: '6x 3.5", 4x 2.5"',
      },
      compatibility: { type: "ATX", gpuLength: 440 },
      badges: ["Silencieux", "Premium"],
      rating: 4.6,
      pros: ["Très silencieux", "Construction solide", "Excellent airflow"],
      cons: ["Assez lourd", "Prix élevé"],
    },
  ],
}

export default function ConfiguratorPage() {
  const [activeTab, setActiveTab] = useState("cpu")
  const [selectedComponents, setSelectedComponents] = useState<Record<string, any>>({})
  const [compatibilityIssues, setCompatibilityIssues] = useState<string[]>([])
  const [notes, setNotes] = useState<Record<string, string>>({})
  const { addConfiguration, getTotalPrice } = useCart()

  // Navigation automatique
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const currentCategoryIndex = componentCategories.findIndex((cat) => cat.id === activeTab)
    const currentCategory = componentCategories[currentCategoryIndex]

    // Si un composant requis est sélectionné, passer au suivant
    if (selectedComponents[activeTab] && currentCategory?.required) {
      const nextCategory = componentCategories[currentCategoryIndex + 1]
      if (nextCategory) {
        timeoutId = setTimeout(() => {
          setActiveTab(nextCategory.id)
          toast.success(
            `${currentCategory.name} sélectionné ! Passons ${nextCategory.required ? "au" : "à l'étape optionnelle :"} ${nextCategory.name.toLowerCase()}`,
            { duration: 3000 },
          )
        }, 1000)
      } else {
        // Configuration terminée
        toast.success("🎉 Configuration terminée ! Tous les composants requis sont sélectionnés.", {
          duration: 4000,
        })
      }
    }

    // Si un composant requis est désélectionné, revenir à cette étape
    if (!selectedComponents[activeTab] && currentCategory?.required && currentCategoryIndex > 0) {
      const hasOtherComponents = Object.keys(selectedComponents).some(
        (key) => key !== activeTab && selectedComponents[key],
      )
      if (hasOtherComponents) {
        timeoutId = setTimeout(() => {
          toast.warning(`${currentCategory.name} requis pour continuer la configuration`)
        }, 500)
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [selectedComponents, activeTab])

  // Vérification de compatibilité
  useEffect(() => {
    const issues: string[] = []

    const cpu = selectedComponents.cpu
    const motherboard = selectedComponents.motherboard
    const ram = selectedComponents.ram
    const gpu = selectedComponents.gpu
    const psu = selectedComponents.psu

    // Vérifier socket CPU/Motherboard
    if (cpu && motherboard && cpu.compatibility.socket !== motherboard.compatibility.socket) {
      issues.push(
        `Socket incompatible: ${cpu.name} (${cpu.compatibility.socket}) avec ${motherboard.name} (${motherboard.compatibility.socket})`,
      )
    }

    // Vérifier RAM
    if (
      ram &&
      motherboard &&
      ram.compatibility.type !== "DDR5" &&
      motherboard.specifications.ramSpeed.includes("DDR5")
    ) {
      issues.push(`Type de RAM incompatible: ${ram.name} avec ${motherboard.name}`)
    }

    // Vérifier alimentation
    if (gpu && psu && gpu.compatibility.minPsu > psu.compatibility.wattage) {
      issues.push(
        `Alimentation insuffisante: ${gpu.name} nécessite ${gpu.compatibility.minPsu}W, ${psu.name} fournit ${psu.compatibility.wattage}W`,
      )
    }

    setCompatibilityIssues(issues)
  }, [selectedComponents])

  const selectComponent = (category: string, component: any) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [category]: component,
    }))
  }

  const removeComponent = (category: string) => {
    setSelectedComponents((prev) => {
      const newComponents = { ...prev }
      delete newComponents[category]
      return newComponents
    })
  }

  const getTotalConfigPrice = () => {
    return Object.values(selectedComponents).reduce((total: number, component: any) => {
      return total + (component?.price || 0)
    }, 0)
  }

  const addToCart = () => {
    const requiredComponents = componentCategories.filter((cat) => cat.required)
    const missingRequired = requiredComponents.filter((cat) => !selectedComponents[cat.id])

    if (missingRequired.length > 0) {
      toast.error(`Composants requis manquants: ${missingRequired.map((c) => c.name).join(", ")}`)
      return
    }

    if (compatibilityIssues.length > 0) {
      toast.error("Veuillez résoudre les problèmes de compatibilité avant d'ajouter au panier")
      return
    }

    addConfiguration(selectedComponents)
    toast.success(
      `Configuration ajoutée au panier ! (${Object.keys(selectedComponents).length} composants - ${getTotalConfigPrice()}€)`,
    )
  }

  const getBadgeVariant = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "nouveau":
        return "default"
      case "populaire":
        return "secondary"
      case "gaming":
        return "destructive"
      case "premium":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getBadgeIcon = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "nouveau":
        return <Star className="w-3 h-3" />
      case "populaire":
        return <TrendingUp className="w-3 h-3" />
      case "gaming":
        return <Flame className="w-3 h-3" />
      case "premium":
        return <Award className="w-3 h-3" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configurateur PC</h1>
        <p className="text-gray-600">Créez votre configuration PC personnalisée étape par étape</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Configuration principale */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-6 bg-gradient-to-r from-slate-50 to-slate-100 p-2 rounded-xl shadow-sm">
              {componentCategories.map((category, index) => {
                const Icon = category.icon
                const isSelected = selectedComponents[category.id]
                const isActive = activeTab === category.id
                const isCompleted = isSelected && !isActive
                const isNext = !isSelected && index === componentCategories.findIndex((cat) => cat.id === activeTab) + 1
                const isDisabled = !category.required && !selectedComponents.cpu

                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className={`
          relative flex flex-col items-center p-4 min-h-[80px] transition-all duration-300 ease-in-out
          ${
            isActive
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-300 ring-offset-2"
              : isCompleted
                ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md hover:shadow-lg hover:scale-102"
                : isNext
                  ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-md animate-pulse"
                  : isDisabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                    : "bg-white hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md hover:scale-102 border border-slate-200"
          }
          ${!isDisabled ? "hover:transform hover:transition-transform" : ""}
          rounded-lg border-0
        `}
                    disabled={isDisabled}
                  >
                    <div className="relative">
                      <Icon
                        className={`
            h-6 w-6 mb-2 transition-all duration-300
            ${isActive ? "animate-bounce" : isCompleted ? "animate-pulse" : ""}
          `}
                      />

                      {/* Status indicators */}
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                      )}

                      {isNext && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center animate-ping">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        </div>
                      )}

                      {category.required && !isSelected && !isActive && !isDisabled && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                    </div>

                    <span
                      className={`
          text-xs font-medium text-center leading-tight
          ${isActive || isCompleted ? "font-bold" : ""}
        `}
                    >
                      {category.name}
                    </span>

                    {category.required && (
                      <div
                        className={`
            text-[10px] mt-1 px-1 py-0.5 rounded-full
            ${
              isActive || isCompleted
                ? "bg-white/20 text-white"
                : isDisabled
                  ? "bg-gray-200 text-gray-400"
                  : "bg-red-100 text-red-600"
            }
          `}
                      >
                        Requis
                      </div>
                    )}

                    {/* Progress indicator */}
                    <div
                      className={`
          absolute bottom-0 left-0 right-0 h-1 rounded-b-lg transition-all duration-500
          ${
            isCompleted
              ? "bg-green-400"
              : isActive
                ? "bg-blue-400 animate-pulse"
                : isNext
                  ? "bg-orange-400"
                  : "bg-transparent"
          }
        `}
                    />
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {componentCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <category.icon className="h-6 w-6" />
                      {category.name}
                      {category.required && <Badge variant="destructive">Requis</Badge>}
                    </h2>
                    <p className="text-gray-600">
                      {category.required
                        ? "Sélectionnez un composant pour continuer"
                        : "Composant optionnel pour votre configuration"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockComponents[category.id as keyof typeof mockComponents]?.map((component) => (
                    <Card
                      key={component.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedComponents[category.id]?.id === component.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => selectComponent(category.id, component)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">{component.name}</CardTitle>
                            <CardDescription className="text-sm">{component.description}</CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{component.price}€</div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {component.rating}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {component.badges.map((badge) => (
                            <Badge
                              key={badge}
                              variant={getBadgeVariant(badge)}
                              className="text-xs flex items-center gap-1"
                            >
                              {getBadgeIcon(badge)}
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <img
                          src={component.image || "/placeholder.svg"}
                          alt={component.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />

                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(component.specifications)
                              .slice(0, 4)
                              .map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-gray-500 capitalize">{key}:</span>
                                  <span className="font-medium">{value}</span>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                <Info className="w-4 h-4 mr-1" />
                                Détails
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{component.name}</DialogTitle>
                                <DialogDescription>{component.description}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                <img
                                  src={component.image || "/placeholder.svg"}
                                  alt={component.name}
                                  className="w-full h-48 object-cover rounded-lg"
                                />

                                <div>
                                  <h4 className="font-semibold mb-2">Spécifications techniques</h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    {Object.entries(component.specifications).map(([key, value]) => (
                                      <div key={key} className="flex justify-between py-1 border-b">
                                        <span className="text-gray-500 capitalize">{key}:</span>
                                        <span className="font-medium">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2 text-green-600">Points forts</h4>
                                    <ul className="space-y-1 text-sm">
                                      {component.pros.map((pro, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                          <CheckCircle className="w-4 h-4 text-green-500" />
                                          {pro}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2 text-orange-600">Points faibles</h4>
                                    <ul className="space-y-1 text-sm">
                                      {component.cons.map((con, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                                          {con}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor={`notes-${component.id}`}>Notes personnelles</Label>
                                  <Textarea
                                    id={`notes-${component.id}`}
                                    placeholder="Ajoutez vos notes sur ce composant..."
                                    value={notes[component.id] || ""}
                                    onChange={(e) =>
                                      setNotes((prev) => ({
                                        ...prev,
                                        [component.id]: e.target.value,
                                      }))
                                    }
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {selectedComponents[category.id]?.id === component.id ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeComponent(category.id)
                              }}
                            >
                              Retirer
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                selectComponent(category.id, component)
                              }}
                            >
                              Sélectionner
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Résumé de configuration */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Configuration actuelle</CardTitle>
              <CardDescription>{Object.keys(selectedComponents).length} composant(s) sélectionné(s)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {componentCategories.map((category) => {
                const component = selectedComponents[category.id]
                const Icon = category.icon

                return (
                  <div key={category.id} className="flex items-center gap-3 p-2 rounded-lg border">
                    <Icon className={`h-5 w-5 ${component ? "text-green-600" : "text-gray-400"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{category.name}</div>
                      {component ? (
                        <div className="text-xs text-gray-600 truncate">
                          {component.name} - {component.price}€
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400">{category.required ? "Requis" : "Optionnel"}</div>
                      )}
                    </div>
                    {component && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeComponent(category.id)}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                )
              })}

              {/* Compatibilité */}
              {compatibilityIssues.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-800 text-sm">Problèmes de compatibilité</span>
                  </div>
                  <ul className="space-y-1 text-xs text-red-700">
                    {compatibilityIssues.map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prix total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">{getTotalConfigPrice()}€</span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={addToCart}
                  disabled={Object.keys(selectedComponents).length === 0 || compatibilityIssues.length > 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Ajouter au panier
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
