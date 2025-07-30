"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
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
  ArrowRight,
  ArrowLeft,
  Save,
  Download,
  Share2,
  Trash2,
  RefreshCw,
  Settings,
  TrendingUp,
  Flame,
  Award,
} from "lucide-react"
import { apiClient } from "@/lib/api/client"

export interface Component {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  specifications: Record<string, string | number>;
  compatibility?: Record<string, string | number | string[]>;
  badges: string[];
  rating: number;
  pros?: string[];
  cons?: string[];
}

const componentCategories = [
  { id: "cpu", name: "Processeur", icon: Cpu, required: true },
  { id: "motherboard", name: "Carte mère", icon: Motherboard, required: true },
  { id: "ram", name: "Mémoire RAM", icon: MemoryStick, required: true },
  { id: "gpu", name: "Carte graphique", icon: Monitor, required: true },
  { id: "storage", name: "Stockage", icon: HardDrive, required: true },
  { id: "psu", name: "Alimentation", icon: Zap, required: true },
  { id: "case", name: "Boîtier", icon: Box, required: false },
]

export default function ConfiguratorPage() {
  const [componentsData, setComponentsData] = useState<Record<string, Component[]>>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    apiClient.get<Record<string, Component[]>>("components")
      .then(setComponentsData)
      .catch((err) => setError(err.message || "Erreur de chargement"))
      .finally(() => setLoading(false))
  }, [])

  const [activeTab, setActiveTab] = useState("cpu")
  const [selectedComponents, setSelectedComponents] = useState<Record<string, Component>>({})
  const [compatibilityIssues, setCompatibilityIssues] = useState<string[]>([])
  const [compatibilitySuggestions, setCompatibilitySuggestions] = useState<Array<{type: string, message: string, action: () => void}>>([])
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [configurationName, setConfigurationName] = useState("Ma Configuration")
  const [isAutoNavigate, setIsAutoNavigate] = useState(true)
  const [savedConfigurations, setSavedConfigurations] = useState<any[]>([])
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [hasShownCompletionDialog, setHasShownCompletionDialog] = useState(false)
  const { addConfiguration, getTotalPrice } = useCart()
  const { toast } = useToast()

  // Navigation automatique
  useEffect(() => {
    if (!isAutoNavigate) return // Ne pas naviguer automatiquement si désactivé
    
    let timeoutId: NodeJS.Timeout

    const currentCategoryIndex = componentCategories.findIndex((cat) => cat.id === activeTab)
    const currentCategory = componentCategories[currentCategoryIndex]

    // Si un composant requis est sélectionné, passer au suivant
    if (selectedComponents[activeTab] && currentCategory?.required) {
      const nextCategory = componentCategories[currentCategoryIndex + 1]
      if (nextCategory) {
        timeoutId = setTimeout(() => {
          setActiveTab(nextCategory.id)
          toast({
            title: "Composant sélectionné",
            description: `${currentCategory.name} sélectionné ! Passons ${nextCategory.required ? "au" : "à l'étape optionnelle :"} ${nextCategory.name.toLowerCase()}`,
          })
        }, 1000)
      } else {
        // Configuration terminée
        toast({
          title: "🎉 Configuration terminée !",
          description: "Tous les composants requis sont sélectionnés.",
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
          toast({
            title: "Composant requis",
            description: `${currentCategory.name} requis pour continuer la configuration`,
            variant: "destructive",
          })
        }, 500)
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [selectedComponents, activeTab, isAutoNavigate])

  // Vérification de compatibilité améliorée avec suggestions
  useEffect(() => {
    const issues: string[] = []
    const suggestions: Array<{type: string, message: string, action: () => void}> = []

    const cpu = selectedComponents.cpu
    const motherboard = selectedComponents.motherboard
    const ram = selectedComponents.ram
    const gpu = selectedComponents.gpu
    const psu = selectedComponents.psu
    const storage = selectedComponents.storage

    // Vérifier socket CPU/Motherboard
    if (cpu && motherboard) {
      const cpuSocket = cpu.specifications?.socket || cpu.compatibility?.socket
      const mbSocket = motherboard.specifications?.socket || motherboard.compatibility?.socket
      
      if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
        issues.push(
          `Socket incompatible: ${cpu.name} (${cpuSocket}) avec ${motherboard.name} (${mbSocket})`
        )
        
        // Suggestion : trouver une carte mère compatible
        const compatibleMotherboard = componentsData.motherboard?.find(mb => 
          (mb.specifications?.socket || mb.compatibility?.socket) === cpuSocket
        )
        
        if (compatibleMotherboard) {
          suggestions.push({
            type: 'motherboard',
            message: `Remplacer par ${compatibleMotherboard.name} (${cpuSocket}) - ${compatibleMotherboard.price}€`,
            action: () => selectComponent('motherboard', compatibleMotherboard)
          })
        }
        
        // Suggestion alternative : trouver un CPU compatible
        const compatibleCpu = componentsData.cpu?.find(c => 
          (c.specifications?.socket || c.compatibility?.socket) === mbSocket
        )
        
        if (compatibleCpu) {
          suggestions.push({
            type: 'cpu',
            message: `Ou remplacer par ${compatibleCpu.name} (${mbSocket}) - ${compatibleCpu.price}€`,
            action: () => selectComponent('cpu', compatibleCpu)
          })
        }
      }
    }

    // Vérifier compatibilité RAM
    if (ram && motherboard) {
      const ramType = ram.specifications?.type || ram.compatibility?.type
      const mbRamSupport = motherboard.specifications?.ramType || "DDR4" // Valeur par défaut
      
      if (ramType && ramType !== mbRamSupport) {
        issues.push(`Type de RAM incompatible: ${ram.name} (${ramType}) avec ${motherboard.name} (${mbRamSupport})`)
        
        // Suggestion : trouver de la RAM compatible
        const compatibleRam = componentsData.ram?.find(r => 
          (r.specifications?.type || r.compatibility?.type) === mbRamSupport
        )
        
        if (compatibleRam) {
          suggestions.push({
            type: 'ram',
            message: `Remplacer par ${compatibleRam.name} (${mbRamSupport}) - ${compatibleRam.price}€`,
            action: () => selectComponent('ram', compatibleRam)
          })
        }
      }
      
      // Vérifier capacité RAM maximale
      const ramCapacity = parseInt(ram.specifications?.capacity?.toString() || "0")
      const maxRam = parseInt(motherboard.specifications?.maxRam?.toString() || "128")
      
      if (ramCapacity > maxRam) {
        issues.push(`Capacité RAM excessive: ${ram.name} (${ramCapacity}GB) dépasse la limite de ${motherboard.name} (${maxRam}GB)`)
        
        // Suggestion : trouver de la RAM avec une capacité appropriée
        const compatibleRam = componentsData.ram?.find(r => {
          const capacity = parseInt(r.specifications?.capacity?.toString() || "0")
          const type = r.specifications?.type || r.compatibility?.type
          return capacity <= maxRam && type === mbRamSupport
        })
        
        if (compatibleRam) {
          suggestions.push({
            type: 'ram',
            message: `Remplacer par ${compatibleRam.name} (${compatibleRam.specifications?.capacity}GB) - ${compatibleRam.price}€`,
            action: () => selectComponent('ram', compatibleRam)
          })
        }
      }
    }

    // Vérifier alimentation
    if (gpu && psu) {
      const gpuMinPsu = parseInt(gpu.compatibility?.minPsu?.toString() || "0")
      const psuWattage = parseInt(psu.specifications?.wattage?.toString() || "0")
      
      if (gpuMinPsu > 0 && psuWattage > 0 && gpuMinPsu > psuWattage) {
        issues.push(
          `Alimentation insuffisante: ${gpu.name} nécessite ${gpuMinPsu}W, ${psu.name} fournit ${psuWattage}W`
        )
        
        // Suggestion : trouver une alimentation plus puissante
        const compatiblePsu = componentsData.psu?.find(p => {
          const wattage = parseInt(p.specifications?.wattage?.toString() || "0")
          return wattage >= gpuMinPsu
        })
        
        if (compatiblePsu) {
          suggestions.push({
            type: 'psu',
            message: `Remplacer par ${compatiblePsu.name} (${compatiblePsu.specifications?.wattage}W) - ${compatiblePsu.price}€`,
            action: () => selectComponent('psu', compatiblePsu)
          })
        }
      }
    }

    // Vérifier compatibilité stockage avec carte mère
    if (storage && motherboard) {
      const storageInterface = storage.specifications?.interface
      if (storageInterface === "PCIe 4.0" && !motherboard.specifications?.pciSlots?.toString().includes("PCIe")) {
        issues.push(`Interface de stockage non optimale: ${storage.name} nécessite PCIe 4.0 pour de meilleures performances`)
        
        // Suggestion : trouver un stockage compatible
        const compatibleStorage = componentsData.storage?.find(s => 
          s.specifications?.interface === "SATA" || s.specifications?.interface === "PCIe 3.0"
        )
        
        if (compatibleStorage) {
          suggestions.push({
            type: 'storage',
            message: `Remplacer par ${compatibleStorage.name} (${compatibleStorage.specifications?.interface}) - ${compatibleStorage.price}€`,
            action: () => selectComponent('storage', compatibleStorage)
          })
        }
      }
    }

    // Calculer la consommation totale approximative
    if (cpu && gpu && Object.keys(selectedComponents).length >= 4) {
      const estimatedConsumption = 
        (parseInt(cpu.specifications?.tdp?.toString() || "65")) + // CPU TDP
        (parseInt(gpu.specifications?.power?.toString() || "250")) + // GPU power
        100 // Autres composants (MB, RAM, stockage, ventilateurs)
        
      const psuWattage = parseInt(psu?.specifications?.wattage?.toString() || "0")
      
      if (psuWattage > 0 && estimatedConsumption > (psuWattage * 0.8)) {
        issues.push(
          `Consommation élevée: Configuration estimée à ${estimatedConsumption}W, recommandé d'utiliser au maximum 80% de ${psuWattage}W (${Math.round(psuWattage * 0.8)}W)`
        )
        
        // Suggestion : trouver une alimentation plus puissante
        const recommendedWattage = Math.ceil(estimatedConsumption / 0.8)
        const compatiblePsu = componentsData.psu?.find(p => {
          const wattage = parseInt(p.specifications?.wattage?.toString() || "0")
          return wattage >= recommendedWattage
        })
        
        if (compatiblePsu) {
          suggestions.push({
            type: 'psu',
            message: `Remplacer par ${compatiblePsu.name} (${compatiblePsu.specifications?.wattage}W) - ${compatiblePsu.price}€`,
            action: () => selectComponent('psu', compatiblePsu)
          })
        }
      }
    }

    setCompatibilityIssues(issues)
    setCompatibilitySuggestions(suggestions)
  }, [selectedComponents, componentsData])

  const selectComponent = (category: string, component: Component) => {
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
    return Object.values(selectedComponents).reduce((total: number, component: Component) => {
      return total + (component?.price || 0)
    }, 0)
  }

  // Nouvelles fonctions utilitaires
  const getCompletionPercentage = useCallback(() => {
    const requiredCategories = componentCategories.filter(cat => cat.required)
    const completedRequired = requiredCategories.filter(cat => selectedComponents[cat.id])
    return Math.round((completedRequired.length / requiredCategories.length) * 100)
  }, [selectedComponents])

  const isConfigurationComplete = useCallback(() => {
    return componentCategories
      .filter(cat => cat.required)
      .every(cat => selectedComponents[cat.id])
  }, [selectedComponents])

  const saveConfiguration = useCallback(async () => {
    try {
      const config = {
        name: configurationName,
        components: selectedComponents,
        notes,
        totalPrice: getTotalConfigPrice(),
        userId: 'anonymous' // TODO: Utiliser l'ID utilisateur réel avec Clerk
      }
      
      const response = await fetch('/api/configurations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde')
      }
      
      const savedConfig = await response.json()
      
      // Recharger les configurations depuis la base de données
      await loadSavedConfigurations()
      
      toast({
        title: "Configuration sauvegardée",
        description: `Configuration "${configurationName}" sauvegardée dans la base de données !`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration",
        variant: "destructive",
      })
    }
  }, [configurationName, selectedComponents, notes])

  const loadConfiguration = useCallback((config: any) => {
    const components = typeof config.components === 'string' ? JSON.parse(config.components) : config.components
    const configNotes = typeof config.notes === 'string' ? JSON.parse(config.notes) : config.notes || {}
    
    setSelectedComponents(components)
    setNotes(configNotes)
    setConfigurationName(config.name)
    toast({
      title: "Configuration chargée",
      description: `Configuration "${config.name}" chargée depuis la base de données !`,
    })
  }, [])

  const loadSavedConfigurations = useCallback(async () => {
    try {
      const response = await fetch('/api/configurations?userId=anonymous')
      if (response.ok) {
        const configs = await response.json()
        setSavedConfigurations(configs)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des configurations:', error)
    }
  }, [])

  const deleteConfiguration = useCallback(async (configId: number) => {
    try {
      const response = await fetch(`/api/configurations?id=${configId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }
      
      // Recharger les configurations
      await loadSavedConfigurations()
      
      toast({
        title: "Configuration supprimée",
        description: "Configuration supprimée de la base de données",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la configuration",
        variant: "destructive",
      })
    }
  }, [])

  const resetConfiguration = useCallback(() => {
    setSelectedComponents({})
    setNotes({})
    setCompatibilityIssues([])
    setCompatibilitySuggestions([])
    setActiveTab("cpu")
    setConfigurationName("Ma Configuration")
    setShowCompletionDialog(false)
    setHasShownCompletionDialog(false)
    toast({
      title: "Configuration réinitialisée",
      description: "Configuration réinitialisée !",
    })
  }, [])

  const shareConfiguration = useCallback(async () => {
    const configData = {
      name: configurationName,
      components: selectedComponents,
      totalPrice: getTotalConfigPrice()
    }
    
    const url = `${window.location.origin}/configurator?config=${encodeURIComponent(JSON.stringify(configData))}`
    
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Lien copié",
        description: "Lien de configuration copié dans le presse-papiers !",
      })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      })
    }
  }, [configurationName, selectedComponents])

  const navigateToNext = useCallback(() => {
    const currentIndex = componentCategories.findIndex(cat => cat.id === activeTab)
    if (currentIndex < componentCategories.length - 1) {
      setActiveTab(componentCategories[currentIndex + 1].id)
    }
  }, [activeTab])

  const navigateToPrevious = useCallback(() => {
    const currentIndex = componentCategories.findIndex(cat => cat.id === activeTab)
    if (currentIndex > 0) {
      setActiveTab(componentCategories[currentIndex - 1].id)
    }
  }, [activeTab])

  // Charger les configurations sauvegardées depuis la base de données au démarrage
  useEffect(() => {
    loadSavedConfigurations()
  }, [loadSavedConfigurations])

  // Vérifier si la configuration est complète
  useEffect(() => {
    if (isConfigurationComplete() && !showCompletionDialog && !hasShownCompletionDialog && Object.keys(selectedComponents).length >= 6) {
      // Ne montrer le dialog qu'une seule fois quand la config est vraiment terminée
      setShowCompletionDialog(true)
      setHasShownCompletionDialog(true)
      toast({
        title: "🎉 Configuration terminée !",
        description: "Tous les composants requis sont sélectionnés.",
      })
    }
    // Reset le dialog si la configuration n'est plus complète
    if (!isConfigurationComplete() && showCompletionDialog) {
      setShowCompletionDialog(false)
    }
  }, [selectedComponents, isConfigurationComplete, showCompletionDialog, hasShownCompletionDialog])

  const addToCart = () => {
    const requiredComponents = componentCategories.filter((cat) => cat.required)
    const missingRequired = requiredComponents.filter((cat) => !selectedComponents[cat.id])

    if (missingRequired.length > 0) {
      toast({
        title: "Composants manquants",
        description: `Composants requis manquants: ${missingRequired.map((c) => c.name).join(", ")}`,
        variant: "destructive",
      })
      return
    }

    if (compatibilityIssues.length > 0) {
      toast({
        title: "Problèmes de compatibilité",
        description: "Veuillez résoudre les problèmes de compatibilité avant d'ajouter au panier",
        variant: "destructive",
      })
      return
    }

    addConfiguration(selectedComponents)
    toast({
      title: "Configuration ajoutée !",
      description: `Configuration ajoutée au panier ! (${Object.keys(selectedComponents).length} composants - ${getTotalConfigPrice()}€)`,
    })
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
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* En-tête moderne avec fonctionnalités */}
      <div className="bg-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Configurateur PC</h1>
              <p className="text-blue-100 text-lg">Créez votre configuration PC personnalisée étape par étape</p>
              
              {/* Barre de progression */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Progression</span>
                    <span>{getCompletionPercentage()}%</span>
                  </div>
                  <Progress value={getCompletionPercentage()} className="h-2 bg-white/20" />
                </div>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {Object.keys(selectedComponents).length}/{componentCategories.filter(c => c.required).length} requis
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={saveConfiguration}
                disabled={Object.keys(selectedComponents).length === 0}
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Charger
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configurations sauvegardées</DialogTitle>
                    <DialogDescription>
                      Sélectionnez une configuration à charger
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {savedConfigurations.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Aucune configuration sauvegardée</p>
                    ) : (
                      savedConfigurations.map((config) => (
                        <div key={config.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{config.name}</div>
                            <div className="text-sm text-gray-500">
                              {config.components ? Object.keys(typeof config.components === 'string' ? JSON.parse(config.components) : config.components).length : 0} composants - {config.totalPrice}€
                            </div>
                            <div className="text-xs text-gray-400">
                              Sauvegardé le {new Date(config.createdAt).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => loadConfiguration(config)}>
                              Charger
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => deleteConfiguration(config.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="secondary"
                size="sm"
                onClick={shareConfiguration}
                disabled={Object.keys(selectedComponents).length === 0}
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={resetConfiguration}
                disabled={Object.keys(selectedComponents).length === 0}
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </div>

          {/* Navigation rapide */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={navigateToPrevious}
                disabled={componentCategories.findIndex(cat => cat.id === activeTab) === 0}
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={navigateToNext}
                disabled={componentCategories.findIndex(cat => cat.id === activeTab) === componentCategories.length - 1}
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <label className="text-sm">Navigation auto</label>
                <input
                  type="checkbox"
                  checked={isAutoNavigate}
                  onChange={(e) => setIsAutoNavigate(e.target.checked)}
                  className="ml-2"
                />
              </div>
              
              <div className="text-right">
                <div className="text-sm opacity-90">Total actuel</div>
                <div className="text-2xl font-bold">{getTotalConfigPrice()}€</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Configuration principale */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 mb-6 bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-lg border gap-1">
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
                      relative flex flex-col items-center justify-center p-2 sm:p-3 min-h-[80px] sm:min-h-[100px]
                      ${
                        isActive
                          ? "bg-blue-600 text-white shadow-xl"
                          : isCompleted
                            ? "bg-green-600 text-white shadow-lg"
                            : isNext
                              ? "bg-orange-500 text-white shadow-lg"
                              : isDisabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                                : "bg-white hover:bg-blue-50 border border-slate-200"
                      }
                      rounded-xl border-0
                    `}
                    disabled={isDisabled}
                  >
                    <div className="relative mb-1 sm:mb-2">
                      <Icon
                        className="h-5 w-5 sm:h-7 sm:w-7"
                      />

                      {/* Status indicators */}
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        </div>
                      )}

                      {isNext && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        </div>
                      )}

                      {category.required && !isSelected && !isActive && !isDisabled && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </div>

                    <span
                      className={`
                        text-[10px] sm:text-xs font-medium text-center leading-tight mb-1
                        ${isActive || isCompleted ? "font-bold" : ""}
                      `}
                    >
                      {category.name}
                    </span>

                    {category.required && (
                      <div
                        className={`
                          text-[8px] sm:text-[10px] px-1 sm:px-2 py-0.5 rounded-full
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
                        absolute bottom-0 left-0 right-0 h-1 rounded-b-xl
                        ${
                          isCompleted
                            ? "bg-green-400"
                            : isActive
                              ? "bg-blue-400"
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
                    {componentsData[category.id]?.length > 0 && (
                      <p className="text-gray-600">
                        {componentsData[category.id].length} {category.name.toLowerCase()}{componentsData[category.id].length > 1 ? 's' : ''} disponible{componentsData[category.id].length > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loading ? (
                    <div className="col-span-full">
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                          <RefreshCw className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Chargement des composants...
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Récupération des derniers produits depuis la base de données
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <Card key={index} className="overflow-hidden">
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <div className="flex-1 space-y-2">
                                  <Skeleton className="h-6 w-3/4" />
                                  <Skeleton className="h-4 w-full" />
                                </div>
                                <div className="text-right space-y-2">
                                  <Skeleton className="h-6 w-16" />
                                  <Skeleton className="h-4 w-12" />
                                </div>
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-20" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <Skeleton className="w-full h-32 rounded-lg mb-3" />
                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="flex justify-between">
                                      <Skeleton className="h-4 w-16" />
                                      <Skeleton className="h-4 w-20" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <Skeleton className="h-8 flex-1" />
                                <Skeleton className="h-8 w-24" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : error ? (
                    <div className="col-span-full text-center py-12">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button
                          onClick={() => {
                            setLoading(true)
                            apiClient.get<Record<string, Component[]>>("components")
                              .then(setComponentsData)
                              .catch((err) => setError(err.message || "Erreur de chargement"))
                              .finally(() => setLoading(false))
                          }}
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Réessayer
                        </Button>
                      </div>
                    </div>
                  ) : (
                    componentsData[category.id]?.map((component: Component) => (
                      <Card
                        key={component.id}
                        className={`cursor-pointer ${
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
                            {component.badges.map((badge: string) => (
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
                                        {component.pros?.map((pro: string, index: number) => (
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
                                        {component.cons?.map((con: string, index: number) => (
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
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Résumé de configuration amélioré */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 overflow-hidden">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuration actuelle
              </CardTitle>
              <CardDescription>
                {Object.keys(selectedComponents).length} composant(s) sélectionné(s)
                {isConfigurationComplete() && (
                  <span className="block text-green-600 font-medium mt-1">
                    ✅ Configuration complète !
                  </span>
                )}
              </CardDescription>
              
              {/* Nom de configuration éditable */}
              <div className="mt-3">
                <Label htmlFor="config-name" className="text-xs">Nom de la configuration</Label>
                <input
                  id="config-name"
                  type="text"
                  value={configurationName}
                  onChange={(e) => setConfigurationName(e.target.value)}
                  className="w-full mt-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ma Configuration"
                />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3 p-4">
              {componentCategories.map((category) => {
                const component = selectedComponents[category.id]
                const Icon = category.icon

                return (
                  <div 
                    key={category.id} 
                    className={`
                      relative flex items-center gap-3 p-3 rounded-lg border-2
                      ${component 
                        ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                        : category.required 
                          ? 'border-red-200 bg-red-50 hover:bg-red-100' 
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 ${
                      component 
                        ? "text-green-600" 
                        : category.required 
                          ? "text-red-500" 
                          : "text-gray-400"
                    }`} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm flex items-center gap-2">
                        {category.name}
                        {category.required && !component && (
                          <Badge variant="destructive" className="text-xs px-1 py-0">Requis</Badge>
                        )}
                        {component && (
                          <Badge variant="default" className="text-xs px-1 py-0 bg-green-100 text-green-700">✓</Badge>
                        )}
                      </div>
                      {component ? (
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="truncate font-medium">{component.name}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-green-600 font-bold">{component.price}€</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{component.rating}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">
                          {category.required ? "Sélection requise" : "Optionnel"}
                        </div>
                      )}
                    </div>
                    
                    {component && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeComponent(category.id)}
                        className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                        title="Retirer ce composant"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}

                    {/* Indicateur de progression */}
                    {component && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-400 rounded-b-lg"></div>
                    )}
                  </div>
                )
              })}

              {/* Section de compatibilité améliorée avec suggestions */}
              {compatibilityIssues.length > 0 ? (
                <div className="space-y-3">
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-800">Problèmes de compatibilité</span>
                    </div>
                    <ul className="space-y-2 text-sm text-red-700">
                      {compatibilityIssues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Suggestions de correction */}
                  {compatibilitySuggestions.length > 0 && (
                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Settings className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Suggestions de correction</span>
                      </div>
                      <div className="space-y-2">
                        {compatibilitySuggestions.map((suggestion, index) => {
                          const categoryIcon = componentCategories.find(c => c.id === suggestion.type)?.icon || Settings
                          const CategoryIcon = categoryIcon
                          
                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                              <div className="flex items-center gap-3">
                                <CategoryIcon className="h-4 w-4 text-blue-600" />
                                <span className="text-sm text-blue-800">{suggestion.message}</span>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => {
                                  suggestion.action()
                                  toast({
                                    title: "Composant remplacé",
                                    description: "Composant automatiquement remplacé pour résoudre l'incompatibilité",
                                  })
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Appliquer
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                      
                      {/* Bouton pour appliquer toutes les suggestions */}
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <Button
                          onClick={() => {
                            compatibilitySuggestions.forEach(suggestion => suggestion.action())
                            toast({
                              title: "Corrections appliquées",
                              description: `${compatibilitySuggestions.length} suggestion(s) appliquée(s) automatiquement`,
                            })
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Appliquer toutes les suggestions ({compatibilitySuggestions.length})
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : Object.keys(selectedComponents).length > 1 && (
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Compatibilité vérifiée</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Tous les composants sélectionnés sont compatibles entre eux.
                  </p>
                </div>
              )}

              {/* Section prix et statistiques */}
              <div className="border-t pt-4 space-y-3">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-blue-900">Résumé des coûts</span>
                    <span className="text-2xl font-bold text-blue-600">{getTotalConfigPrice()}€</span>
                  </div>
                  
                  {/* Détail des prix par catégorie */}
                  <div className="space-y-1 text-sm">
                    {Object.entries(selectedComponents).map(([categoryId, component]) => {
                      const category = componentCategories.find(c => c.id === categoryId)
                      return (
                        <div key={categoryId} className="flex justify-between text-blue-700">
                          <span>{category?.name}</span>
                          <span>{component.price}€</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="space-y-2">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    onClick={addToCart}
                    disabled={Object.keys(selectedComponents).length === 0 || compatibilityIssues.length > 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Ajouter au panier
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={saveConfiguration}
                      disabled={Object.keys(selectedComponents).length === 0}
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Sauvegarder
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={shareConfiguration}
                      disabled={Object.keys(selectedComponents).length === 0}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Partager
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de félicitations pour configuration complète */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">🎉 Félicitations !</DialogTitle>
            <DialogDescription className="text-center">
              Votre configuration PC est maintenant complète !
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-bold text-green-800 mb-2">Configuration terminée</h3>
                <p className="text-sm text-green-700">
                  Tous les composants requis ont été sélectionnés et sont compatibles.
                </p>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-600">{getTotalConfigPrice()}€</div>
              <div className="text-sm text-gray-600">
                {Object.keys(selectedComponents).length} composants sélectionnés
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => {
                  addToCart()
                  setShowCompletionDialog(false)
                }}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Ajouter au panier et continuer
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    saveConfiguration()
                    setShowCompletionDialog(false)
                  }}
                >
                  <Save className="w-4 h-4 mr-1" />
                  Sauvegarder
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    shareConfiguration()
                    setShowCompletionDialog(false)
                  }}
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Partager
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                onClick={() => setShowCompletionDialog(false)}
                className="text-gray-500"
              >
                Continuer la configuration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
