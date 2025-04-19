// Demo Data for Industry Admin Dashboard

// 1. Industry Collection
export const industries = [
    {
    _id: "6075e2d4a12d2a3f98765432",
      name: "Healthcare",
      description: "Medical supplies and equipment management",
      industry_code: "HLTH",
      created_at: new Date("2024-03-10T08:00:00Z"),
      updated_at: new Date("2024-03-10T08:00:00Z")
    },
    {
    _id: "6075e2e4a12d2a3f98765433",
      name: "Electronics",
      description: "Consumer and industrial electronics inventory",
      industry_code: "ELEC",
      created_at: new Date("2024-03-12T10:15:00Z"),
      updated_at: new Date("2024-03-15T14:30:00Z")
    },
    {
    _id: "6075e2f4a12d2a3f98765434",
      name: "Pharmaceuticals",
      description: "Pharmaceutical products and medicinal supplies",
      industry_code: "PHRM",
      created_at: new Date("2024-03-14T09:20:00Z"),
      updated_at: new Date("2024-03-14T09:20:00Z")
    }
  ];
  
  // 2. Users Collection
export const users = [
    // Healthcare Industry Users
    {
    _id: "6075e304a12d2a3f98765435",
      name: "Rachit Sharma",
      email: "rachit.sharma@healthcare.com",
      role: "admin",
      password: "hashed_password_123",
    industry_id: "6075e2d4a12d2a3f98765432", // Healthcare
      created_at: new Date("2024-03-10T09:30:00Z"),
      updated_at: new Date("2024-03-10T09:30:00Z")
    },
    {
    _id: "6075e314a12d2a3f98765436",
      name: "Priya Patel",
      email: "priya.patel@healthcare.com",
      role: "manager",
      password: "hashed_password_456",
    warehouse_id: "6075e334a12d2a3f98765441", // Delhi Central Warehouse
    industry_id: "6075e2d4a12d2a3f98765432", // Healthcare
      created_at: new Date("2024-03-10T10:15:00Z"),
      updated_at: new Date("2024-03-10T10:15:00Z")
    },
    {
    _id: "6075e324a12d2a3f98765437",
      name: "Amol Desai",
      email: "amol.desai@healthcare.com",
      role: "manager",
      password: "hashed_password_789",
    warehouse_id: "6075e344a12d2a3f98765442", // Mumbai Medical Warehouse
    industry_id: "6075e2d4a12d2a3f98765432", // Healthcare
      created_at: new Date("2024-03-11T08:45:00Z"),
      updated_at: new Date("2024-03-11T08:45:00Z")
    },
    {
    _id: "6075e334a12d2a3f98765438",
      name: "Sneha Reddy",
      email: "sneha.reddy@healthcare.com",
      role: "staff",
      password: "hashed_password_101",
    warehouse_id: "6075e334a12d2a3f98765441", // Delhi Central Warehouse
    industry_id: "6075e2d4a12d2a3f98765432", // Healthcare
      created_at: new Date("2024-03-12T11:30:00Z"),
      updated_at: new Date("2024-03-12T11:30:00Z")
    },
    
    // Electronics Industry Users
    {
    _id: "6075e344a12d2a3f98765439",
      name: "Vikram Malhotra",
      email: "vikram.malhotra@electronics.com",
      role: "admin",
      password: "hashed_password_202",
    industry_id: "6075e2e4a12d2a3f98765433", // Electronics
      created_at: new Date("2024-03-12T13:00:00Z"),
      updated_at: new Date("2024-03-12T13:00:00Z")
    },
    {
    _id: "6075e354a12d2a3f9876543a",
      name: "Neha Singh",
      email: "neha.singh@electronics.com",
      role: "manager",
      password: "hashed_password_303",
    warehouse_id: "6075e354a12d2a3f98765443", // Bangalore Tech Hub
    industry_id: "6075e2e4a12d2a3f98765433", // Electronics
      created_at: new Date("2024-03-13T09:15:00Z"),
      updated_at: new Date("2024-03-13T09:15:00Z")
    },
    
    // Pharmaceuticals Industry Users
    {
    _id: "6075e364a12d2a3f9876543b",
      name: "Arjun Kumar",
      email: "arjun.kumar@pharma.com",
      role: "admin",
      password: "hashed_password_404",
    industry_id: "6075e2f4a12d2a3f98765434", // Pharmaceuticals
      created_at: new Date("2024-03-14T10:00:00Z"),
      updated_at: new Date("2024-03-14T10:00:00Z")
    },
    {
    _id: "6075e374a12d2a3f9876543c",
      name: "Meera Joshi",
      email: "meera.joshi@pharma.com",
      role: "manager",
      password: "hashed_password_505",
    warehouse_id: "6075e374a12d2a3f98765445", // Hyderabad Pharma Center
    industry_id: "6075e2f4a12d2a3f98765434", // Pharmaceuticals
      created_at: new Date("2024-03-15T08:30:00Z"),
      updated_at: new Date("2024-03-15T08:30:00Z")
    },
    {
    _id: "6075e384a12d2a3f9876543d",
      name: "Karthik Nair",
      email: "karthik.nair@pharma.com",
      role: "staff",
      password: "hashed_password_606",
    warehouse_id: "6075e374a12d2a3f98765445", // Hyderabad Pharma Center
    industry_id: "6075e2f4a12d2a3f98765434", // Pharmaceuticals
      created_at: new Date("2024-03-16T14:45:00Z"),
      updated_at: new Date("2024-03-16T14:45:00Z")
    }
  ];
  
  // 3. Warehouses Collection
export const warehouses = [
    // Healthcare Warehouses
    {
    _id: "6075e334a12d2a3f98765441",
      name: "Delhi Central Medical Warehouse",
      location: "Delhi, India",
    manager_id: "6075e314a12d2a3f98765436", // Priya Patel
    industry_id: "6075e2d4a12d2a3f98765432", // Healthcare
      created_at: new Date("2024-03-10T11:00:00Z"),
      updated_at: new Date("2024-03-10T11:00:00Z")
    },
    {
    _id: "6075e344a12d2a3f98765442",
      name: "Mumbai Medical Supplies",
      location: "Mumbai, India",
    manager_id: "6075e324a12d2a3f98765437", // Amol Desai
    industry_id: "6075e2d4a12d2a3f98765432", // Healthcare
      created_at: new Date("2024-03-11T12:30:00Z"),
      updated_at: new Date("2024-03-11T12:30:00Z")
    },
    
    // Electronics Warehouses
    {
    _id: "6075e354a12d2a3f98765443",
      name: "Bangalore Tech Hub",
      location: "Bangalore, India",
    manager_id: "6075e354a12d2a3f9876543a", // Neha Singh
    industry_id: "6075e2e4a12d2a3f98765433", // Electronics
      created_at: new Date("2024-03-13T10:00:00Z"),
      updated_at: new Date("2024-03-13T10:00:00Z")
    },
    {
    _id: "6075e364a12d2a3f98765444",
      name: "Chennai Electronics Depot",
      location: "Chennai, India",
      manager_id: null, // No manager assigned yet
    industry_id: "6075e2e4a12d2a3f98765433", // Electronics
      created_at: new Date("2024-03-13T14:45:00Z"),
      updated_at: new Date("2024-03-13T14:45:00Z")
    },
    
    // Pharmaceuticals Warehouses
    {
    _id: "6075e374a12d2a3f98765445",
      name: "Hyderabad Pharma Center",
      location: "Hyderabad, India",
    manager_id: "6075e374a12d2a3f9876543c", // Meera Joshi
    industry_id: "6075e2f4a12d2a3f98765434", // Pharmaceuticals
      created_at: new Date("2024-03-15T09:15:00Z"),
      updated_at: new Date("2024-03-15T09:15:00Z")
    },
    {
    _id: "6075e384a12d2a3f98765446",
      name: "Pune Pharmaceutical Storage",
      location: "Pune, India",
      manager_id: null, // No manager assigned yet
    industry_id: "6075e2f4a12d2a3f98765434", // Pharmaceuticals
      created_at: new Date("2024-03-16T08:00:00Z"),
      updated_at: new Date("2024-03-16T08:00:00Z")
    }
  ];
  
  // 4. Products Collection
export const products = [
    // Healthcare Products
    {
    _id: "6075e394a12d2a3f98765447",
      name: "N95 Mask",
      sku: "HLTH-MASK-001",
      category: "Personal Protective Equipment",
      description: "N95 Respirator mask for medical professionals",
    industry_id: "6075e2d4a12d2a3f98765432", // Healthcare
      price: 250.00,
      created_at: new Date("2024-03-10T13:00:00Z"),
      updated_at: new Date("2024-03-10T13:00:00Z")
    },
    {
    _id: "6075e3a4a12d2a3f98765448",
      name: "Digital Thermometer",
      sku: "HLTH-THERM-002",
      category: "Diagnostic Tools",
      description: "No-contact infrared digital thermometer",
    industry_id: "6075e2d4a12d2a3f98765432", // Healthcare
      price: 1200.00,
      created_at: new Date("2024-03-10T13:15:00Z"),
      updated_at: new Date("2024-03-10T13:15:00Z")
    },
    {
    _id: "6075e3b4a12d2a3f98765449",
      name: "Surgical Gloves (Box)",
      sku: "HLTH-GLOVES-003",
      category: "Personal Protective Equipment",
      description: "Box of 100 disposable surgical gloves",
    industry_id: "6075e2d4a12d2a3f98765432", // Healthcare
      price: 450.00,
      created_at: new Date("2024-03-10T13:30:00Z"),
      updated_at: new Date("2024-03-10T13:30:00Z")
    },
    {
    _id: "6075e3c4a12d2a3f9876544a",
      name: "Pulse Oximeter",
      sku: "HLTH-OXI-004",
      category: "Diagnostic Tools",
      description: "Fingertip pulse oximeter for measuring SpO2",
    industry_id: "6075e2d4a12d2a3f98765432", // Healthcare
      price: 1500.00,
      created_at: new Date("2024-03-11T09:00:00Z"),
      updated_at: new Date("2024-03-11T09:00:00Z")
    },
    
    // Electronics Products
    {
    _id: "6075e3d4a12d2a3f9876544b",
      name: "Wireless Earbuds",
      sku: "ELEC-AUDIO-001",
      category: "Audio Devices",
      description: "Bluetooth wireless earbuds with charging case",
    industry_id: "6075e2e4a12d2a3f98765433", // Electronics
      price: 3500.00,
      created_at: new Date("2024-03-13T11:00:00Z"),
      updated_at: new Date("2024-03-13T11:00:00Z")
    },
    {
    _id: "6075e3e4a12d2a3f9876544c",
      name: "Smart Watch",
      sku: "ELEC-WEARABLE-002",
      category: "Wearable Technology",
      description: "Smart watch with health tracking features",
    industry_id: "6075e2e4a12d2a3f98765433", // Electronics
      price: 8000.00,
      created_at: new Date("2024-03-13T11:30:00Z"),
      updated_at: new Date("2024-03-13T11:30:00Z")
    },
    {
    _id: "6075e3f4a12d2a3f9876544d",
      name: "Power Bank 20000mAh",
      sku: "ELEC-POWER-003",
      category: "Power Accessories",
      description: "20000mAh power bank with fast charging",
    industry_id: "6075e2e4a12d2a3f98765433", // Electronics
      price: 2200.00,
      created_at: new Date("2024-03-13T12:00:00Z"),
      updated_at: new Date("2024-03-13T12:00:00Z")
    },
    
    // Pharmaceutical Products
    {
    _id: "6075e404a12d2a3f9876544e",
      name: "Paracetamol (Box)",
      sku: "PHRM-FEVER-001",
      category: "Pain Relief",
      description: "Box of 100 paracetamol tablets (500mg)",
    industry_id: "6075e2f4a12d2a3f98765434", // Pharmaceuticals
      price: 220.00,
      created_at: new Date("2024-03-15T10:00:00Z"),
      updated_at: new Date("2024-03-15T10:00:00Z")
    },
    {
    _id: "6075e414a12d2a3f9876544f",
      name: "Vitamin C (Bottle)",
      sku: "PHRM-VIT-002",
      category: "Vitamins & Supplements",
      description: "Bottle of 60 Vitamin C tablets (500mg)",
    industry_id: "6075e2f4a12d2a3f98765434", // Pharmaceuticals
      price: 350.00,
      created_at: new Date("2024-03-15T10:30:00Z"),
      updated_at: new Date("2024-03-15T10:30:00Z")
    },
    {
    _id: "6075e424a12d2a3f98765450",
      name: "Antiseptic Solution",
      sku: "PHRM-ANTI-003",
      category: "First Aid",
      description: "500ml bottle of antiseptic solution",
    industry_id: "6075e2f4a12d2a3f98765434", // Pharmaceuticals
      price: 180.00,
      created_at: new Date("2024-03-15T11:00:00Z"),
      updated_at: new Date("2024-03-15T11:00:00Z")
    }
  ];
  
  // 5. Inventory Collection
export const inventory = [
    // Healthcare Inventory - Delhi Warehouse
    {
    _id: "6075e434a12d2a3f98765451",
    product_id: "6075e394a12d2a3f98765447", // N95 Mask
    warehouse_id: "6075e334a12d2a3f98765441", // Delhi Central Medical Warehouse
      quantity: 5000,
      created_at: new Date("2024-03-10T14:00:00Z"),
      updated_at: new Date("2024-04-01T09:30:00Z")
    },
    {
    _id: "6075e444a12d2a3f98765452",
    product_id: "6075e3a4a12d2a3f98765448", // Digital Thermometer
    warehouse_id: "6075e334a12d2a3f98765441", // Delhi Central Medical Warehouse
      quantity: 250,
      created_at: new Date("2024-03-10T14:15:00Z"),
      updated_at: new Date("2024-03-25T11:45:00Z")
    },
    {
    _id: "6075e454a12d2a3f98765453",
    product_id: "6075e3b4a12d2a3f98765449", // Surgical Gloves (Box)
    warehouse_id: "6075e334a12d2a3f98765441", // Delhi Central Medical Warehouse
      quantity: 800,
      created_at: new Date("2024-03-10T14:30:00Z"),
      updated_at: new Date("2024-03-30T16:20:00Z")
    },
    {
    _id: "6075e464a12d2a3f98765454",
    product_id: "6075e3c4a12d2a3f9876544a", // Pulse Oximeter
    warehouse_id: "6075e334a12d2a3f98765441", // Delhi Central Medical Warehouse
      quantity: 150,
      created_at: new Date("2024-03-11T09:30:00Z"),
      updated_at: new Date("2024-03-28T10:10:00Z")
    },
    
    // Healthcare Inventory - Mumbai Warehouse
    {
    _id: "6075e474a12d2a3f98765455",
    product_id: "6075e394a12d2a3f98765447", // N95 Mask
    warehouse_id: "6075e344a12d2a3f98765442", // Mumbai Medical Supplies
      quantity: 3000,
      created_at: new Date("2024-03-11T13:00:00Z"),
      updated_at: new Date("2024-03-29T14:40:00Z")
    },
    {
    _id: "6075e484a12d2a3f98765456",
    product_id: "6075e3a4a12d2a3f98765448", // Digital Thermometer
    warehouse_id: "6075e344a12d2a3f98765442", // Mumbai Medical Supplies
      quantity: 180,
      created_at: new Date("2024-03-11T13:30:00Z"),
      updated_at: new Date("2024-03-27T09:15:00Z")
    },
    {
    _id: "6075e494a12d2a3f98765457",
    product_id: "6075e3b4a12d2a3f98765449", // Surgical Gloves (Box)
    warehouse_id: "6075e344a12d2a3f98765442", // Mumbai Medical Supplies
      quantity: 600,
      created_at: new Date("2024-03-11T14:00:00Z"),
      updated_at: new Date("2024-04-02T11:30:00Z")
    },
    
    // Electronics Inventory - Bangalore Warehouse
    {
    _id: "6075e4a4a12d2a3f98765458",
    product_id: "6075e3d4a12d2a3f9876544b", // Wireless Earbuds
    warehouse_id: "6075e354a12d2a3f98765443", // Bangalore Tech Hub
      quantity: 500,
      created_at: new Date("2024-03-13T13:00:00Z"),
      updated_at: new Date("2024-03-31T15:20:00Z")
    },
    {
    _id: "6075e4b4a12d2a3f98765459",
    product_id: "6075e3e4a12d2a3f9876544c", // Smart Watch
    warehouse_id: "6075e354a12d2a3f98765443", // Bangalore Tech Hub
      quantity: 250,
      created_at: new Date("2024-03-13T13:30:00Z"),
      updated_at: new Date("2024-04-03T12:45:00Z")
    },
    {
    _id: "6075e4c4a12d2a3f9876545a",
    product_id: "6075e3f4a12d2a3f9876544d", // Power Bank 20000mAh
    warehouse_id: "6075e354a12d2a3f98765443", // Bangalore Tech Hub
      quantity: 350,
      created_at: new Date("2024-03-13T14:00:00Z"),
      updated_at: new Date("2024-03-26T09:00:00Z")
    },
    
    // Electronics Inventory - Chennai Warehouse
    {
    _id: "6075e4d4a12d2a3f9876545b",
    product_id: "6075e3d4a12d2a3f9876544b", // Wireless Earbuds
    warehouse_id: "6075e364a12d2a3f98765444", // Chennai Electronics Depot
      quantity: 320,
      created_at: new Date("2024-03-14T09:00:00Z"),
      updated_at: new Date("2024-03-30T10:30:00Z")
    },
    {
    _id: "6075e4e4a12d2a3f9876545c",
    product_id: "6075e3e4a12d2a3f9876544c", // Smart Watch
    warehouse_id: "6075e364a12d2a3f98765444", // Chennai Electronics Depot
      quantity: 180,
      created_at: new Date("2024-03-14T09:30:00Z"),
      updated_at: new Date("2024-04-01T14:15:00Z")
    },
    
    // Pharmaceutical Inventory - Hyderabad Warehouse
    {
    _id: "6075e4f4a12d2a3f9876545d",
    product_id: "6075e404a12d2a3f9876544e", // Paracetamol (Box)
    warehouse_id: "6075e374a12d2a3f98765445", // Hyderabad Pharma Center
      quantity: 1200,
      created_at: new Date("2024-03-15T13:00:00Z"),
      updated_at: new Date("2024-04-02T14:30:00Z")
    },
    {
    _id: "6075e504a12d2a3f9876545e",
    product_id: "6075e414a12d2a3f9876544f", // Vitamin C (Bottle)
    warehouse_id: "6075e374a12d2a3f98765445", // Hyderabad Pharma Center
      quantity: 800,
      created_at: new Date("2024-03-15T13:30:00Z"),
      updated_at: new Date("2024-03-28T11:45:00Z")
    },
    {
    _id: "6075e514a12d2a3f9876545f",
    product_id: "6075e424a12d2a3f98765450", // Antiseptic Solution
    warehouse_id: "6075e374a12d2a3f98765445", // Hyderabad Pharma Center
      quantity: 650,
      created_at: new Date("2024-03-15T14:00:00Z"),
      updated_at: new Date("2024-04-03T09:20:00Z")
    }
  ];
  
  // 6. Stock Movements Collection
export const stock_movements = [
    // Healthcare Stock Movements - Delhi Warehouse
    {
    _id: "6075e524a12d2a3f98765460",
    product_id: "6075e394a12d2a3f98765447", // N95 Mask
    warehouse_id: "6075e334a12d2a3f98765441", // Delhi Central Medical Warehouse
      movement_type: "IN",
      quantity: 5000,
      date: new Date("2024-03-10T14:00:00Z"),
      created_at: new Date("2024-03-10T14:00:00Z"),
      updated_at: new Date("2024-03-10T14:00:00Z")
    },
    {
    _id: "6075e534a12d2a3f98765461",
    product_id: "6075e394a12d2a3f98765447", // N95 Mask
    warehouse_id: "6075e334a12d2a3f98765441", // Delhi Central Medical Warehouse
      movement_type: "OUT",
      quantity: 500,
      date: new Date("2024-03-20T11:30:00Z"),
      created_at: new Date("2024-03-20T11:30:00Z"),
      updated_at: new Date("2024-03-20T11:30:00Z")
    },
    {
    _id: "6075e544a12d2a3f98765462",
    product_id: "6075e394a12d2a3f98765447", // N95 Mask
    warehouse_id: "6075e334a12d2a3f98765441", // Delhi Central Medical Warehouse
      movement_type: "OUT",
      quantity: 200,
      date: new Date("2024-03-25T14:15:00Z"),
      created_at: new Date("2024-03-25T14:15:00Z"),
      updated_at: new Date("2024-03-25T14:15:00Z")
    },
    {
    _id: "6075e554a12d2a3f98765463",
    product_id: "6075e394a12d2a3f98765447", // N95 Mask
    warehouse_id: "6075e334a12d2a3f98765441", // Delhi Central Medical Warehouse
      movement_type: "TRANSFER",
      quantity: 1000,
      date: new Date("2024-04-01T09:30:00Z"),
      created_at: new Date("2024-04-01T09:30:00Z"),
      updated_at: new Date("2024-04-01T09:30:00Z")
    },
    {
    _id: "6075e564a12d2a3f98765464",
    product_id: "6075e3a4a12d2a3f98765448", // Digital Thermometer
    warehouse_id: "6075e334a12d2a3f98765441", // Delhi Central Medical Warehouse
      movement_type: "IN",
      quantity: 250,
      date: new Date("2024-03-10T14:15:00Z"),
      created_at: new Date("2024-03-10T14:15:00Z"),
      updated_at: new Date("2024-03-10T14:15:00Z")
    },
    {
    _id: "6075e574a12d2a3f98765465",
    product_id: "6075e3a4a12d2a3f98765448", // Digital Thermometer
    warehouse_id: "6075e334a12d2a3f98765441", // Delhi Central Medical Warehouse
      movement_type: "OUT",
      quantity: 50,
      date: new Date("2024-03-25T11:45:00Z"),
      created_at: new Date("2024-03-25T11:45:00Z"),
      updated_at: new Date("2024-03-25T11:45:00Z")
    },
    
    // Healthcare Stock Movements - Mumbai Warehouse
    {
    _id: "6075e584a12d2a3f98765466",
    product_id: "6075e394a12d2a3f98765447", // N95 Mask
    warehouse_id: "6075e344a12d2a3f98765442", // Mumbai Medical Supplies
      movement_type: "IN",
      quantity: 3000,
      date: new Date("2024-03-11T13:00:00Z"),
      created_at: new Date("2024-03-11T13:00:00Z"),
      updated_at: new Date("2024-03-11T13:00:00Z")
    },
    {
    _id: "6075e594a12d2a3f98765467",
    product_id: "6075e394a12d2a3f98765447", // N95 Mask
    warehouse_id: "6075e344a12d2a3f98765442", // Mumbai Medical Supplies
    movement_type: "OUT",
    quantity: 800,
    date: new Date("2024-03-18T10:15:00Z"),
    created_at: new Date("2024-03-18T10:15:00Z"),
    updated_at: new Date("2024-03-18T10:15:00Z")
  },
  {
    _id: "6075e5a4a12d2a3f98765468",
    product_id: "6075e394a12d2a3f98765447", // N95 Mask
    warehouse_id: "6075e344a12d2a3f98765442", // Mumbai Medical Supplies
    movement_type: "IN",
    quantity: 1000,
    date: new Date("2024-03-29T14:40:00Z"),
    created_at: new Date("2024-03-29T14:40:00Z"),
    updated_at: new Date("2024-03-29T14:40:00Z")
  },
  {
    _id: "6075e5b4a12d2a3f98765469",
    product_id: "6075e3a4a12d2a3f98765448", // Digital Thermometer
    warehouse_id: "6075e344a12d2a3f98765442", // Mumbai Medical Supplies
    movement_type: "IN",
    quantity: 180,
    date: new Date("2024-03-11T13:30:00Z"),
    created_at: new Date("2024-03-11T13:30:00Z"),
    updated_at: new Date("2024-03-11T13:30:00Z")
  },
  {
    _id: "6075e5c4a12d2a3f9876546a",
    product_id: "6075e3a4a12d2a3f98765448", // Digital Thermometer
    warehouse_id: "6075e344a12d2a3f98765442", // Mumbai Medical Supplies
    movement_type: "OUT",
    quantity: 45,
    date: new Date("2024-03-27T09:15:00Z"),
    created_at: new Date("2024-03-27T09:15:00Z"),
    updated_at: new Date("2024-03-27T09:15:00Z")
  },
  
  // Electronics Stock Movements - Bangalore Warehouse
  {
    _id: "6075e5d4a12d2a3f9876546b",
    product_id: "6075e3d4a12d2a3f9876544b", // Wireless Earbuds
    warehouse_id: "6075e354a12d2a3f98765443", // Bangalore Tech Hub
    movement_type: "IN",
    quantity: 500,
    date: new Date("2024-03-13T13:00:00Z"),
    created_at: new Date("2024-03-13T13:00:00Z"),
    updated_at: new Date("2024-03-13T13:00:00Z")
  },
  {
    _id: "6075e5e4a12d2a3f9876546c",
    product_id: "6075e3d4a12d2a3f9876544b", // Wireless Earbuds
    warehouse_id: "6075e354a12d2a3f98765443", // Bangalore Tech Hub
    movement_type: "OUT",
    quantity: 120,
    date: new Date("2024-03-22T15:30:00Z"),
    created_at: new Date("2024-03-22T15:30:00Z"),
    updated_at: new Date("2024-03-22T15:30:00Z")
  },
  {
    _id: "6075e5f4a12d2a3f9876546d",
    product_id: "6075e3d4a12d2a3f9876544b", // Wireless Earbuds
    warehouse_id: "6075e354a12d2a3f98765443", // Bangalore Tech Hub
    movement_type: "TRANSFER",
    quantity: 80,
    date: new Date("2024-03-31T15:20:00Z"),
    created_at: new Date("2024-03-31T15:20:00Z"),
    updated_at: new Date("2024-03-31T15:20:00Z")
  },
  {
    _id: "6075e604a12d2a3f9876546e",
    product_id: "6075e3e4a12d2a3f9876544c", // Smart Watch
    warehouse_id: "6075e354a12d2a3f98765443", // Bangalore Tech Hub
    movement_type: "IN",
    quantity: 250,
    date: new Date("2024-03-13T13:30:00Z"),
    created_at: new Date("2024-03-13T13:30:00Z"),
    updated_at: new Date("2024-03-13T13:30:00Z")
  },
  {
    _id: "6075e614a12d2a3f9876546f",
    product_id: "6075e3e4a12d2a3f9876544c", // Smart Watch
    warehouse_id: "6075e354a12d2a3f98765443", // Bangalore Tech Hub
    movement_type: "OUT",
    quantity: 60,
    date: new Date("2024-03-24T10:45:00Z"),
    created_at: new Date("2024-03-24T10:45:00Z"),
    updated_at: new Date("2024-03-24T10:45:00Z")
  },
  {
    _id: "6075e624a12d2a3f98765470",
    product_id: "6075e3e4a12d2a3f9876544c", // Smart Watch
    warehouse_id: "6075e354a12d2a3f98765443", // Bangalore Tech Hub
    movement_type: "IN",
    quantity: 100,
    date: new Date("2024-04-03T12:45:00Z"),
    created_at: new Date("2024-04-03T12:45:00Z"),
    updated_at: new Date("2024-04-03T12:45:00Z")
  },
  
  // Electronics Stock Movements - Chennai Warehouse
  {
    _id: "6075e634a12d2a3f98765471",
    product_id: "6075e3d4a12d2a3f9876544b", // Wireless Earbuds
    warehouse_id: "6075e364a12d2a3f98765444", // Chennai Electronics Depot
    movement_type: "IN",
    quantity: 320,
    date: new Date("2024-03-14T09:00:00Z"),
    created_at: new Date("2024-03-14T09:00:00Z"),
    updated_at: new Date("2024-03-14T09:00:00Z")
  },
  {
    _id: "6075e644a12d2a3f98765472",
    product_id: "6075e3d4a12d2a3f9876544b", // Wireless Earbuds
    warehouse_id: "6075e364a12d2a3f98765444", // Chennai Electronics Depot
    movement_type: "OUT",
    quantity: 80,
    date: new Date("2024-03-30T10:30:00Z"),
    created_at: new Date("2024-03-30T10:30:00Z"),
    updated_at: new Date("2024-03-30T10:30:00Z")
  },
  {
    _id: "6075e654a12d2a3f98765473",
    product_id: "6075e3e4a12d2a3f9876544c", // Smart Watch
    warehouse_id: "6075e364a12d2a3f98765444", // Chennai Electronics Depot
    movement_type: "IN",
    quantity: 180,
    date: new Date("2024-03-14T09:30:00Z"),
    created_at: new Date("2024-03-14T09:30:00Z"),
    updated_at: new Date("2024-03-14T09:30:00Z")
  },
  {
    _id: "6075e664a12d2a3f98765474",
    product_id: "6075e3e4a12d2a3f9876544c", // Smart Watch
    warehouse_id: "6075e364a12d2a3f98765444", // Chennai Electronics Depot
    movement_type: "OUT",
    quantity: 35,
    date: new Date("2024-04-01T14:15:00Z"),
    created_at: new Date("2024-04-01T14:15:00Z"),
    updated_at: new Date("2024-04-01T14:15:00Z")
  },
  
  // Pharmaceutical Stock Movements - Hyderabad Warehouse
  {
    _id: "6075e674a12d2a3f98765475",
    product_id: "6075e404a12d2a3f9876544e", // Paracetamol (Box)
    warehouse_id: "6075e374a12d2a3f98765445", // Hyderabad Pharma Center
    movement_type: "IN",
    quantity: 1200,
    date: new Date("2024-03-15T13:00:00Z"),
    created_at: new Date("2024-03-15T13:00:00Z"),
    updated_at: new Date("2024-03-15T13:00:00Z")
  },
  {
    _id: "6075e684a12d2a3f98765476",
    product_id: "6075e404a12d2a3f9876544e", // Paracetamol (Box)
    warehouse_id: "6075e374a12d2a3f98765445", // Hyderabad Pharma Center
    movement_type: "OUT",
    quantity: 300,
    date: new Date("2024-03-25T09:45:00Z"),
    created_at: new Date("2024-03-25T09:45:00Z"),
    updated_at: new Date("2024-03-25T09:45:00Z")
  },
  {
    _id: "6075e694a12d2a3f98765477",
    product_id: "6075e404a12d2a3f9876544e", // Paracetamol (Box)
    warehouse_id: "6075e374a12d2a3f98765445", // Hyderabad Pharma Center
    movement_type: "OUT",
    quantity: 150,
    date: new Date("2024-04-02T14:30:00Z"),
    created_at: new Date("2024-04-02T14:30:00Z"),
    updated_at: new Date("2024-04-02T14:30:00Z")
  },
  {
    _id: "6075e6a4a12d2a3f98765478",
    product_id: "6075e414a12d2a3f9876544f", // Vitamin C (Bottle)
    warehouse_id: "6075e374a12d2a3f98765445", // Hyderabad Pharma Center
    movement_type: "IN",
    quantity: 800,
    date: new Date("2024-03-15T13:30:00Z"),
    created_at: new Date("2024-03-15T13:30:00Z"),
    updated_at: new Date("2024-03-15T13:30:00Z")
  },
  {
    _id: "6075e6b4a12d2a3f98765479",
    product_id: "6075e414a12d2a3f9876544f", // Vitamin C (Bottle)
    warehouse_id: "6075e374a12d2a3f98765445", // Hyderabad Pharma Center
    movement_type: "OUT",
    quantity: 200,
    date: new Date("2024-03-28T11:45:00Z"),
    created_at: new Date("2024-03-28T11:45:00Z"),
    updated_at: new Date("2024-03-28T11:45:00Z")
  },
  {
    _id: "6075e6c4a12d2a3f9876547a",
    product_id: "6075e424a12d2a3f98765450", // Antiseptic Solution
    warehouse_id: "6075e374a12d2a3f98765445", // Hyderabad Pharma Center
    movement_type: "IN",
    quantity: 650,
    date: new Date("2024-03-15T14:00:00Z"),
    created_at: new Date("2024-03-15T14:00:00Z"),
    updated_at: new Date("2024-03-15T14:00:00Z")
  },
  {
    _id: "6075e6d4a12d2a3f9876547b",
    product_id: "6075e424a12d2a3f98765450", // Antiseptic Solution
    warehouse_id: "6075e374a12d2a3f98765445", // Hyderabad Pharma Center
    movement_type: "OUT",
    quantity: 120,
    date: new Date("2024-04-03T09:20:00Z"),
    created_at: new Date("2024-04-03T09:20:00Z"),
    updated_at: new Date("2024-04-03T09:20:00Z")
  },
  
  // Adding inter-warehouse transfers
  {
    _id: "6075e6e4a12d2a3f9876547c",
    product_id: "6075e394a12d2a3f98765447", // N95 Mask
    warehouse_id: "6075e334a12d2a3f98765441", // Delhi Central Medical Warehouse
    movement_type: "TRANSFER",
    quantity: 1000,
    date: new Date("2024-04-01T09:30:00Z"),
    created_at: new Date("2024-04-01T09:30:00Z"),
    updated_at: new Date("2024-04-01T09:30:00Z")
  },
  {
    _id: "6075e6f4a12d2a3f9876547d",
    product_id: "6075e394a12d2a3f98765447", // N95 Mask
    warehouse_id: "6075e344a12d2a3f98765442", // Mumbai Medical Supplies
    movement_type: "TRANSFER",
    quantity: 1000,
    date: new Date("2024-04-01T10:30:00Z"),
    created_at: new Date("2024-04-01T10:30:00Z"),
    updated_at: new Date("2024-04-01T10:30:00Z")
  },
  {
    _id: "6075e704a12d2a3f9876547e",
    product_id: "6075e3d4a12d2a3f9876544b", // Wireless Earbuds
    warehouse_id: "6075e354a12d2a3f98765443", // Bangalore Tech Hub
    movement_type: "TRANSFER",
    quantity: 80,
    date: new Date("2024-03-31T15:20:00Z"),
    created_at: new Date("2024-03-31T15:20:00Z"),
    updated_at: new Date("2024-03-31T15:20:00Z")
  },
  {
    _id: "6075e714a12d2a3f9876547f",
    product_id: "6075e3d4a12d2a3f9876544b", // Wireless Earbuds
    warehouse_id: "6075e364a12d2a3f98765444", // Chennai Electronics Depot
    movement_type: "TRANSFER",
    quantity: 80,
    date: new Date("2024-03-31T16:30:00Z"),
    created_at: new Date("2024-03-31T16:30:00Z"),
    updated_at: new Date("2024-03-31T16:30:00Z")
  }
];

// Additional data for the dashboard

// 7. Alerts Collection (for low stock, expiring items, etc.)
export const alerts = [
  {
    _id: "6075e724a12d2a3f98765480",
    alert_type: "LOW_STOCK",
    product_id: "6075e3a4a12d2a3f98765448", // Digital Thermometer
    warehouse_id: "6075e334a12d2a3f98765441", // Delhi Central Medical Warehouse
    threshold: 100,
    current_quantity: 50,
    status: "ACTIVE",
    created_at: new Date("2024-03-26T09:00:00Z"),
    updated_at: new Date("2024-03-26T09:00:00Z")
  },
  {
    _id: "6075e734a12d2a3f98765481",
    alert_type: "EXPIRY",
    product_id: "6075e404a12d2a3f9876544e", // Paracetamol (Box)
    warehouse_id: "6075e374a12d2a3f98765445", // Hyderabad Pharma Center
    expiry_date: new Date("2024-06-15T00:00:00Z"),
    quantity: 250,
    status: "ACTIVE",
    created_at: new Date("2024-03-28T10:00:00Z"),
    updated_at: new Date("2024-03-28T10:00:00Z")
  },
  {
    _id: "6075e744a12d2a3f98765482",
    alert_type: "ANOMALY",
    product_id: "6075e3e4a12d2a3f9876544c", // Smart Watch
    warehouse_id: "6075e354a12d2a3f98765443", // Bangalore Tech Hub
    description: "Unexpected spike in outgoing inventory",
    status: "RESOLVED",
    created_at: new Date("2024-03-24T11:00:00Z"),
    updated_at: new Date("2024-03-25T13:00:00Z")
  },
  {
    _id: "6075e754a12d2a3f98765483",
    alert_type: "LOW_STOCK",
    product_id: "6075e3f4a12d2a3f9876544d", // Power Bank 20000mAh
    warehouse_id: "6075e354a12d2a3f98765443", // Bangalore Tech Hub
    threshold: 100,
    current_quantity: 75,
    status: "ACTIVE",
    created_at: new Date("2024-03-30T14:00:00Z"),
    updated_at: new Date("2024-03-30T14:00:00Z")
  }
];

// 8. Company Settings Collection
export const company_settings = [
  {
    _id: "6075e764a12d2a3f98765484",
    industry_id: "6075e2d4a12d2a3f98765432", // Healthcare
    company_name: "MedCorp Supplies",
    logo_url: "https://example.com/medcorp_logo.png",
    email_domain: "healthcare.com",
    valuation_method: "FIFO",
    low_stock_threshold_percent: 15,
    expiry_alert_days: 90,
    notifications: {
      low_stock: true,
      expiry: true,
      transfers: true,
      anomalies: true
    },
    created_at: new Date("2024-03-10T08:30:00Z"),
    updated_at: new Date("2024-03-22T15:00:00Z")
  },
  {
    _id: "6075e774a12d2a3f98765485",
    industry_id: "6075e2e4a12d2a3f98765433", // Electronics
    company_name: "TechHub Distribution",
    logo_url: "https://example.com/techhub_logo.png",
    email_domain: "electronics.com",
    valuation_method: "WEIGHTED_AVERAGE",
    low_stock_threshold_percent: 20,
    expiry_alert_days: 30,
    notifications: {
      low_stock: true,
      expiry: false,
      transfers: true,
      anomalies: true
    },
    created_at: new Date("2024-03-12T11:00:00Z"),
    updated_at: new Date("2024-03-20T14:30:00Z")
  },
  {
    _id: "6075e784a12d2a3f98765486",
    industry_id: "6075e2f4a12d2a3f98765434", // Pharmaceuticals
    company_name: "MedRx Pharmaceuticals",
    logo_url: "https://example.com/medrx_logo.png",
    email_domain: "pharma.com",
    valuation_method: "LIFO",
    low_stock_threshold_percent: 25,
    expiry_alert_days: 120,
    notifications: {
      low_stock: true,
      expiry: true,
      transfers: true,
      anomalies: true
    },
    created_at: new Date("2024-03-14T09:45:00Z"),
    updated_at: new Date("2024-03-25T11:30:00Z")
  }
];

// 9. Activity Logs Collection
export const activity_logs = [
  {
    _id: "6075e794a12d2a3f98765487",
    industry_id: "6075e2d4a12d2a3f98765432", // Healthcare
    user_id: "6075e304a12d2a3f98765435", // Rachit Sharma
    action: "USER_CREATED",
    details: "Created user Priya Patel",
    ip_address: "192.168.1.100",
    created_at: new Date("2024-03-10T10:15:00Z")
  },
  {
    _id: "6075e7a4a12d2a3f98765488",
    industry_id: "6075e2d4a12d2a3f98765432", // Healthcare
    user_id: "6075e304a12d2a3f98765435", // Rachit Sharma
    action: "WAREHOUSE_CREATED",
    details: "Created Delhi Central Medical Warehouse",
    ip_address: "192.168.1.100",
    created_at: new Date("2024-03-10T11:00:00Z")
  },
  {
    _id: "6075e7b4a12d2a3f98765489",
    industry_id: "6075e2d4a12d2a3f98765432", // Healthcare
    user_id: "6075e314a12d2a3f98765436", // Priya Patel
    action: "PRODUCT_RECEIVED",
    details: "Received 5000 units of N95 Mask",
    ip_address: "192.168.1.150",
    created_at: new Date("2024-03-10T14:00:00Z")
  },
  {
    _id: "6075e7c4a12d2a3f9876548a",
    industry_id: "6075e2d4a12d2a3f98765432", // Healthcare
    user_id: "6075e314a12d2a3f98765436", // Priya Patel
    action: "PRODUCT_SHIPPED",
    details: "Shipped 500 units of N95 Mask",
    ip_address: "192.168.1.150",
    created_at: new Date("2024-03-20T11:30:00Z")
  },
  {
    _id: "6075e7d4a12d2a3f9876548b",
    industry_id: "6075e2e4a12d2a3f98765433", // Electronics
    user_id: "6075e344a12d2a3f98765439", // Vikram Malhotra
    action: "SETTINGS_UPDATED",
    details: "Updated low stock threshold to 20%",
    ip_address: "192.168.2.200",
    created_at: new Date("2024-03-20T14:30:00Z")
  },
  {
    _id: "6075e7e4a12d2a3f9876548c",
    industry_id: "6075e2f4a12d2a3f98765434", // Pharmaceuticals
    user_id: "6075e374a12d2a3f9876543c", // Meera Joshi
    action: "TRANSFER_INITIATED",
    details: "Initiated transfer of 100 boxes of Paracetamol to Pune",
    ip_address: "192.168.3.150",
    created_at: new Date("2024-03-30T10:00:00Z")
  },
  {
    _id: "6075e7f4a12d2a3f9876548d",
    industry_id: "6075e2d4a12d2a3f98765432", // Healthcare
    user_id: "6075e304a12d2a3f98765435", // Rachit Sharma
    action: "REPORT_GENERATED",
    details: "Generated Monthly Inventory Report",
    ip_address: "192.168.1.100",
    created_at: new Date("2024-04-01T08:30:00Z")
  }
];

// 10. Reports Collection
export const reports = [
  {
    _id: "6075e804a12d2a3f9876548e",
    industry_id: "6075e2d4a12d2a3f98765432", // Healthcare
    name: "March 2024 Inventory Summary",
    report_type: "INVENTORY_SUMMARY",
    created_by: "6075e304a12d2a3f98765435", // Rachit Sharma
    parameters: {
      start_date: new Date("2024-03-01T00:00:00Z"),
      end_date: new Date("2024-03-31T23:59:59Z"),
      warehouses: ["ALL"],
      products: ["ALL"]
    },
    url: "https://example.com/reports/march2024_inventory.pdf",
    created_at: new Date("2024-04-01T08:30:00Z")
  },
  {
    _id: "6075e814a12d2a3f9876548f",
    industry_id: "6075e2e4a12d2a3f98765433", // Electronics
    name: "Q1 2024 Sales Analysis",
    report_type: "SALES_ANALYSIS",
    created_by: "6075e344a12d2a3f98765439", // Vikram Malhotra
    parameters: {
      start_date: new Date("2024-01-01T00:00:00Z"),
      end_date: new Date("2024-03-31T23:59:59Z"),
      warehouses: ["ALL"],
      products: ["ALL"]
    },
    url: "https://example.com/reports/q1_2024_sales.pdf",
    created_at: new Date("2024-04-02T10:15:00Z")
  },
  {
    _id: "6075e824a12d2a3f98765490",
    industry_id: "6075e2f4a12d2a3f98765434", // Pharmaceuticals
    name: "Expired Products Q1 2024",
    report_type: "EXPIRY_REPORT",
    created_by: "6075e364a12d2a3f9876543b", // Arjun Kumar
    parameters: {
      start_date: new Date("2024-01-01T00:00:00Z"),
      end_date: new Date("2024-03-31T23:59:59Z"),
      warehouses: ["ALL"],
      status: "EXPIRED"
    },
    url: "https://example.com/reports/q1_2024_expired.pdf",
    created_at: new Date("2024-04-03T09:45:00Z")
  }
];

// 11. Subscriptions Collection
export const subscriptions = [
  {
    _id: "6075e834a12d2a3f98765491",
    industry_id: "6075e2d4a12d2a3f98765432", // Healthcare
    plan: "ENTERPRISE",
    start_date: new Date("2024-03-01T00:00:00Z"),
    end_date: new Date("2025-02-28T23:59:59Z"),
    status: "ACTIVE",
    features: {
      warehouses: "UNLIMITED",
      users: "UNLIMITED",
      advanced_analytics: true,
      api_access: true,
      priority_support: true
    },
    billing: {
      amount: 999.00,
      currency: "USD",
      cycle: "MONTHLY",
      payment_method: "CREDIT_CARD"
    },
    created_at: new Date("2024-03-01T00:00:00Z"),
    updated_at: new Date("2024-03-01T00:00:00Z")
  },
]