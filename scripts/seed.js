const mysql = require('mysql2/promise');

async function seed() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ultimate_setup_ecommerce'
  });

  try {
    // Insérer les catégories
    await connection.execute(`
      INSERT IGNORE INTO Category (id, name, description) VALUES 
      (1, 'Processeurs', 'Processeurs AMD et Intel'),
      (2, 'Cartes graphiques', 'Cartes graphiques NVIDIA et AMD'),
      (3, 'Cartes mères', 'Cartes mères pour tous les sockets'),
      (4, 'Mémoire RAM', 'Modules de mémoire DDR4 et DDR5'),
      (5, 'Stockage', 'SSD et HDD pour le stockage'),
      (6, 'Alimentations', 'Blocs d\'alimentation modulaires et semi-modulaires'),
      (7, 'Boîtiers', 'Boîtiers ATX, Micro-ATX et Mini-ITX')
    `);

    // Insérer les produits
    await connection.execute(`
      INSERT IGNORE INTO Product (id, name, description, price, imageUrl, stock, categoryId, specs) VALUES 
      (1, 'AMD Ryzen 9 7950X', 'Processeur 16 cœurs, 32 threads, 4.5 GHz base, 5.7 GHz boost', 599.99, '/placeholder.jpg', 15, 1, '{"cores": 16, "threads": 32, "baseFreq": "4.5 GHz", "boostFreq": "5.7 GHz", "socket": "AM5"}'),
      (2, 'Intel Core i9-14900K', 'Processeur 24 cœurs (8P+16E), 32 threads, jusqu\'à 6.0 GHz', 549.99, '/placeholder.jpg', 12, 1, '{"cores": 24, "threads": 32, "baseFreq": "3.2 GHz", "boostFreq": "6.0 GHz", "socket": "LGA1700"}'),
      (3, 'NVIDIA RTX 4090', 'Carte graphique haut de gamme, 24GB GDDR6X', 1599.99, '/placeholder.jpg', 8, 2, '{"memory": "24GB GDDR6X", "coreClock": "2230 MHz", "boostClock": "2520 MHz", "interface": "PCIe 4.0 x16"}'),
      (4, 'ASUS ROG STRIX X670E-E', 'Carte mère ATX pour AMD AM5, WiFi 6E, PCIe 5.0', 449.99, '/placeholder.jpg', 20, 3, '{"chipset": "AMD X670E", "socket": "AM5", "memoryType": "DDR5", "maxMemory": "128GB"}'),
      (5, 'Corsair Vengeance DDR5-5600 32GB', 'Kit mémoire DDR5 32GB (2x16GB) 5600MHz CL36', 179.99, '/placeholder.jpg', 25, 4, '{"capacity": "32GB", "speed": "5600MHz", "latency": "CL36", "voltage": "1.25V"}'),
      (6, 'Samsung 980 PRO 2TB', 'SSD NVMe M.2 2280, PCIe 4.0, jusqu\'à 7000 MB/s', 199.99, '/placeholder.jpg', 30, 5, '{"capacity": "2TB", "interface": "M.2 NVMe PCIe 4.0", "readSpeed": "7000 MB/s", "writeSpeed": "6900 MB/s"}'),
      (7, 'AMD Ryzen 7 7700X', 'Processeur 8 cœurs, 16 threads, 4.5 GHz base, 5.4 GHz boost', 349.99, '/placeholder.jpg', 18, 1, '{"cores": 8, "threads": 16, "baseFreq": "4.5 GHz", "boostFreq": "5.4 GHz", "socket": "AM5"}'),
      (8, 'NVIDIA RTX 4070 Ti', 'Carte graphique milieu de gamme, 12GB GDDR6X', 799.99, '/placeholder.jpg', 15, 2, '{"memory": "12GB GDDR6X", "coreClock": "2310 MHz", "boostClock": "2610 MHz", "interface": "PCIe 4.0 x16"}'),
      (9, 'MSI MAG B650 TOMAHAWK', 'Carte mère ATX pour AMD AM5, WiFi 6, PCIe 4.0', 189.99, '/placeholder.jpg', 35, 3, '{"chipset": "AMD B650", "socket": "AM5", "memoryType": "DDR5", "maxMemory": "128GB"}'),
      (10, 'G.Skill Trident Z5 DDR5-6000 16GB', 'Kit mémoire DDR5 16GB (2x8GB) 6000MHz CL30', 129.99, '/placeholder.jpg', 40, 4, '{"capacity": "16GB", "speed": "6000MHz", "latency": "CL30", "voltage": "1.35V"}')
    `);

    console.log('Données insérées avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données:', error);
  } finally {
    await connection.end();
  }
}

seed();
