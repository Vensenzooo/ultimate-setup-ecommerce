import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateProductSpecs() {
  console.log('🔧 Mise à jour des spécifications techniques...')

  // CPU Specs
  const cpuUpdates = [
    {
      name: 'Intel Core i7-13700K',
      description: 'Processeur gaming haut de gamme avec 16 cœurs (8P+8E) et 24 threads',
      specs: {
        cores: '16 (8P+8E)',
        threads: '24',
        baseClock: '3.4 GHz',
        boostClock: '5.4 GHz',
        socket: 'LGA1700',
        tdp: '125W',
        cache: '30MB L3'
      }
    },
    {
      name: 'AMD Ryzen 7 7700X',
      description: 'Processeur gaming haute performance avec architecture Zen 4',
      specs: {
        cores: '8',
        threads: '16',
        baseClock: '4.5 GHz',
        boostClock: '5.4 GHz',
        socket: 'AM5',
        tdp: '105W',
        cache: '32MB L3'
      }
    },
    {
      name: 'Intel Core i9-13900K',
      description: 'Processeur flagship pour gaming et création de contenu',
      specs: {
        cores: '24 (8P+16E)',
        threads: '32',
        baseClock: '3.0 GHz',
        boostClock: '5.8 GHz',
        socket: 'LGA1700',
        tdp: '125W',
        cache: '36MB L3'
      }
    },
    {
      name: 'AMD Ryzen 5 7600X',
      description: 'Processeur gaming abordable avec excellent rapport performance/prix',
      specs: {
        cores: '6',
        threads: '12',
        baseClock: '4.7 GHz',
        boostClock: '5.3 GHz',
        socket: 'AM5',
        tdp: '105W',
        cache: '32MB L3'
      }
    }
  ]

  // GPU Specs
  const gpuUpdates = [
    {
      name: 'NVIDIA GeForce RTX 4070',
      description: 'Carte graphique gaming 1440p avec ray tracing et DLSS 3',
      specs: {
        vram: '12GB GDDR6X',
        baseClock: '1920 MHz',
        boostClock: '2475 MHz',
        memorySpeed: '21 Gbps',
        busWidth: '192-bit',
        tdp: '200W',
        rtCores: '46',
        ports: 'DisplayPort 1.4a, HDMI 2.1'
      }
    },
    {
      name: 'AMD Radeon RX 7700 XT',
      description: 'Carte graphique gaming 1440p avec technologie RDNA 3',
      specs: {
        vram: '12GB GDDR6',
        gameClock: '2171 MHz',
        boostClock: '2544 MHz',
        memorySpeed: '18 Gbps',
        busWidth: '192-bit',
        tdp: '245W',
        computeUnits: '54',
        ports: 'DisplayPort 2.1, HDMI 2.1'
      }
    },
    {
      name: 'NVIDIA GeForce RTX 4090',
      description: 'Carte graphique flagship pour gaming 4K et création de contenu',
      specs: {
        vram: '24GB GDDR6X',
        baseClock: '2230 MHz',
        boostClock: '2520 MHz',
        memorySpeed: '21 Gbps',
        busWidth: '384-bit',
        tdp: '450W',
        rtCores: '128',
        ports: 'DisplayPort 1.4a, HDMI 2.1'
      }
    }
  ]

  // RAM Specs
  const ramUpdates = [
    {
      name: 'Corsair Vengeance LPX 32GB (2x16GB) DDR4-3200',
      description: 'Mémoire DDR4 haute performance avec profil XMP',
      specs: {
        capacity: '32GB (2x16GB)',
        type: 'DDR4',
        speed: '3200 MHz',
        latency: 'CL16',
        voltage: '1.35V',
        profile: 'XMP 2.0',
        heatspreader: 'Aluminum'
      }
    },
    {
      name: 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5-6000',
      description: 'Mémoire DDR5 gaming avec éclairage RGB et hautes fréquences',
      specs: {
        capacity: '32GB (2x16GB)',
        type: 'DDR5',
        speed: '6000 MHz',
        latency: 'CL36',
        voltage: '1.35V',
        profile: 'XMP 3.0',
        rgb: 'Trident Z5 RGB'
      }
    }
  ]

  // Motherboard Specs
  const motherboardUpdates = [
    {
      name: 'ASUS ROG STRIX Z790-E',
      description: 'Carte mère gaming haut de gamme avec WiFi 6E et PCIe 5.0',
      specs: {
        socket: 'LGA1700',
        chipset: 'Intel Z790',
        formFactor: 'ATX',
        memorySlots: '4x DDR5',
        maxMemory: '128GB',
        pciSlots: '1x PCIe 5.0 x16, 2x PCIe 4.0 x16',
        storage: '4x M.2, 6x SATA',
        wifi: 'WiFi 6E',
        ethernet: '2.5Gb',
        usb: 'USB 3.2 Gen 2x2 Type-C'
      }
    },
    {
      name: 'MSI B650 TOMAHAWK',
      description: 'Carte mère gaming AMD B650 avec support DDR5 et PCIe 4.0',
      specs: {
        socket: 'AM5',
        chipset: 'AMD B650',
        formFactor: 'ATX',
        memorySlots: '4x DDR5',
        maxMemory: '128GB',
        pciSlots: '1x PCIe 4.0 x16, 2x PCIe 4.0 x16',
        storage: '2x M.2, 6x SATA',
        wifi: 'WiFi 6',
        ethernet: '2.5Gb',
        usb: 'USB 3.2 Gen 2 Type-C'
      }
    }
  ]

  // Mettre à jour les produits
  for (const cpu of cpuUpdates) {
    await prisma.product.updateMany({
      where: { name: cpu.name },
      data: {
        description: cpu.description,
        specs: cpu.specs
      }
    })
    console.log(`✅ Mise à jour: ${cpu.name}`)
  }

  for (const gpu of gpuUpdates) {
    await prisma.product.updateMany({
      where: { name: gpu.name },
      data: {
        description: gpu.description,
        specs: gpu.specs
      }
    })
    console.log(`✅ Mise à jour: ${gpu.name}`)
  }

  for (const ram of ramUpdates) {
    await prisma.product.updateMany({
      where: { name: ram.name },
      data: {
        description: ram.description,
        specs: ram.specs
      }
    })
    console.log(`✅ Mise à jour: ${ram.name}`)
  }

  for (const motherboard of motherboardUpdates) {
    await prisma.product.updateMany({
      where: { name: motherboard.name },
      data: {
        description: motherboard.description,
        specs: motherboard.specs
      }
    })
    console.log(`✅ Mise à jour: ${motherboard.name}`)
  }

  console.log('🎉 Toutes les spécifications ont été mises à jour!')
}

updateProductSpecs()
  .catch((e) => {
    console.error('❌ Erreur lors de la mise à jour:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
