/**
 * Local product catalog mirror.
 * ----------------------------------------------------------------------------
 * The canonical record lives in Supabase (`products` table). This file mirrors
 * that record for static use (router/SSR, cart math) and shares the same SKUs
 * and numeric IDs so the two stay aligned. Update both together.
 */

export interface Product {
  id: number;
  sku: string;
  slug: string;
  name: string;
  price: number;
  shortDescription: string;
  metaDescription: string;
  description: string;
  category: "supplies" | "bundle" | "pens" | "cold-storage" | "vial-storage";
  imageAlt: string;
  images?: { src: string; alt: string }[];
  addOnly?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 39900,
    sku: "PH399.001",
    slug: "bac-water-1pack-10ml",
    name: "10ml Bacteriostatic Water",
    price: 9.75,
    shortDescription: "Single sterile 10ml multi-dose vial. Lab-grade.",
    metaDescription: "Buy 10ml bacteriostatic water — sterile, multi-dose vial with 0.9% benzyl alcohol. cGMP sourced, COA available. Free US shipping, same-day dispatch.",
    description:
      "One 10ml sterile bacteriostatic water vial. Manufactured under cGMP conditions and intended strictly for in vitro research use only. Tamper-evident seal, individually inspected.",
    category: "supplies",
    imageAlt: "Single 10ml bacteriostatic water vial",
  },
  {
    id: 39901,
    sku: "PH399.003",
    slug: "bac-water-3pack-10ml",
    name: "3-Pack 10ml Bacteriostatic Water",
    price: 17.99,
    shortDescription: "Three sterile 10ml multi-dose vials. Lab-grade.",
    metaDescription: "3-Pack bacteriostatic water (10ml each) — sterile, multi-dose vials with 0.9% benzyl alcohol. Lab-tested, COA on file. Free shipping and same-day dispatch.",
    description:
      "Three 10ml sterile bacteriostatic water vials. Manufactured under cGMP conditions and intended strictly for in vitro research use only. Tamper-evident seal, individually inspected.",
    category: "supplies",
    imageAlt: "Three 10ml bacteriostatic water vials",
  },
  {
    id: 39902,
    sku: "PH399.006",
    slug: "bac-water-6pack-10ml",
    name: "6-Pack 10ml Bacteriostatic Water",
    price: 27.99,
    shortDescription: "Six sterile 10ml multi-dose vials. Lab-grade.",
    metaDescription: "6-Pack bacteriostatic water (10ml vials) — save more per vial. Sterile, tamper-sealed, cGMP manufactured. Certificate of Analysis on file. Free US shipping.",
    description:
      "Six 10ml sterile bacteriostatic water vials. Manufactured under cGMP conditions and intended strictly for in vitro research use only. Tamper-evident seal, individually inspected.",
    category: "supplies",
    imageAlt: "Six 10ml bacteriostatic water vials",
  },
  {
    id: 39903,
    sku: "PH399.010",
    slug: "bac-water-10pack-10ml",
    name: "10-Pack 10ml Bacteriostatic Water",
    price: 43.99,
    shortDescription: "Ten sterile 10ml multi-dose vials. Best value.",
    metaDescription: "Best value: 10-Pack bacteriostatic water (10ml vials) at $4.40/vial. Sterile, tamper-sealed, cGMP sourced with COA. Ships free same-day from the US.",
    description:
      "Ten 10ml sterile bacteriostatic water vials. Manufactured under cGMP conditions and intended strictly for in vitro research use only. Tamper-evident seal, individually inspected.",
    category: "supplies",
    imageAlt: "Ten 10ml bacteriostatic water vials",
  },
  {
    id: 39905,
    sku: "PH399.030",
    slug: "insulin-syringes-30g-100ct",
    name: "100 x 1mL 100U 30ga x 5/16\" Insulin Syringes",
    price: 19.99,
    shortDescription: "100 sterile 1mL 100U 30ga x 5/16\" insulin syringes.",
    metaDescription: "100-count 1mL insulin syringes — 30 gauge x 5/16\" needle, individually wrapped, sterile, latex-free. For lab and research use. Free shipping, ships same day.",
    description:
      "Pack of 100 individually wrapped 1mL / 100 unit, 30 gauge x 5/16 inch (8mm) insulin syringes. Sterile, single-use, latex-free. For laboratory and research applications only.",
    category: "supplies",
    imageAlt: "Box of 100 1mL 100U 30-gauge 5/16-inch insulin syringes",
  },
  {
    id: 39906,
    sku: "PH399.030.3",
    slug: "insulin-syringes-3pack-30g",
    name: "3-Pack 100ct 1mL 30ga x 5/16\" Insulin Syringes",
    price: 47.99,
    shortDescription:
      "Three boxes of 100 sterile 1mL 100U 30ga x 5/16\" insulin syringes (300 total).",
    metaDescription: "300 insulin syringes (3 boxes of 100) — 1mL, 30ga x 5/16\" needle, sterile and individually wrapped. Save vs single boxes. Free US shipping, same-day dispatch.",
    description:
      "Three boxes of 100 individually wrapped 1mL / 100 unit, 30 gauge x 5/16 inch (8mm) insulin syringes — 300 syringes total. Sterile, single-use, latex-free. For laboratory and research applications only.",
    category: "supplies",
    imageAlt:
      "Three boxes of 100 1mL 100U 30-gauge 5/16-inch insulin syringes",
  },
  {
    id: 39911,
    sku: "PH399.101",
    slug: "bundle-starter",
    name: "Starter Bundle",
    price: 34.99,
    shortDescription:
      "3 Vials 10ml BAC Water + 100 70% Alcohol Prep Pads + 100 1mL 30ga x 5/16\" Syringes.",
    metaDescription: "Starter research bundle: 3 bac water vials, 100 alcohol prep pads, and 100 insulin syringes (30ga x 5/16\"). Everything to begin. Free shipping, same-day dispatch.",
    description:
      "The perfect entry-level kit. Includes three Vials 10ml BAC Water, 100 sterile 70% alcohol prep pads, and 100 individually wrapped 1mL 100U 30ga x 5/16 inch (8mm) insulin syringes. Intended for in-vitro use only.",
    category: "bundle",
    imageAlt: "Starter bundle with bac water, prep pads, and syringes",
  },
  {
    id: 39912,
    sku: "PH399.102",
    slug: "bundle-value",
    name: "Value Bundle",
    price: 43.99,
    shortDescription:
      "6 Vials 10ml BAC Water + 100 70% Alcohol Prep Pads + 100 1mL 30ga x 5/16\" Syringes.",
    metaDescription: "Value research bundle: 6 bac water vials, 100 alcohol prep pads, and 100 insulin syringes (30ga x 5/16\"). Save over individual items. Free shipping, same-day dispatch.",
    description:
      "Stock up and save. Includes six Vials 10ml BAC Water, 100 sterile 70% alcohol prep pads, and 100 individually wrapped 1mL 100U 30ga x 5/16 inch (8mm) insulin syringes. Intended for in-vitro use only.",
    category: "bundle",
    imageAlt: "Value bundle with bac water, prep pads, and syringes",
  },
  {
    id: 39913,
    sku: "PH399.103",
    slug: "bundle-ultimate",
    name: "Ultimate Bundle",
    price: 54.99,
    shortDescription:
      "10 Vials 10ml BAC Water + 100 70% Alcohol Prep Pads + 100 1mL 30ga x 5/16\" Syringes.",
    metaDescription: "Best value: Ultimate bundle with 10 bac water vials, 100 prep pads, and 100 insulin syringes (30ga x 5/16\"). Over 30% off individual pricing. Free same-day shipping.",
    description:
      "Our best value for high-volume research workflows. Includes ten Vials 10ml BAC Water, 100 sterile 70% alcohol prep pads, and 100 individually wrapped 1mL 100U 30ga x 5/16 inch (8mm) insulin syringes. Intended for in-vitro use only.",
    category: "bundle",
    imageAlt: "Ultimate bundle with bac water, prep pads, and syringes",
  },
  {
    id: 39998,
    sku: "PH399.030.AO",
    slug: "insulin-syringes-addon",
    name: "100 x 1mL 30ga x 5/16\" Insulin Syringes (Add-on)",
    price: 18.99,
    shortDescription: "Sterile single-use 1mL 100U 30ga x 5/16\" syringes.",
    metaDescription: "Add-on: 100 insulin syringes (1mL, 30ga x 5/16\") at a discounted price when added to your order. Sterile, individually wrapped, latex-free. Free shipping.",
    description:
      "Discounted add-on: 100 individually wrapped 1mL 100U 30 gauge x 5/16 inch (8mm) insulin syringes. Sterile, single-use, latex-free.",
    category: "supplies",
    imageAlt: "Box of 100 1mL 100U 30-gauge 5/16-inch insulin syringes",
    addOnly: true,
  },
  {
    id: 39999,
    sku: "PH399.020.AO",
    slug: "alcohol-prep-pads-addon",
    name: "100 70% Alcohol Prep Pads (Add-on)",
    price: 3.99,
    shortDescription: "70% isopropyl prep pads, sterile, 100 ct.",
    metaDescription: "Add-on: 100 sterile 70% isopropyl alcohol prep pads, individually foil-wrapped. Maintain sterility in your research workflow. Free shipping on every order.",
    description:
      "Add-on: 100 sterile 70% isopropyl alcohol prep pads. Individually foil-wrapped to maintain sterility.",
    category: "supplies",
    imageAlt: "Pack of 100 70% alcohol prep pads",
    addOnly: true,
  },
  {
    id: 2660,
    sku: "PH399.040",
    slug: "pen-injector-gansulin",
    name: "Pen Injector \u2013 Gansulin",
    price: 59.99,
    shortDescription: "Aluminum reusable dial-dose pen injector in matte green with protective cap, clip, and zip carry case.",
    metaDescription: "Aluminum Gansulin dial-dose pen injector in matte green with zip carry case. Twist dial with dose window, protective cap with pocket clip. Free US shipping.",
    description: '<p>A reusable aluminum dial-dose pen injector in a matte green finish with a protective cap and pocket clip. Comes with a zip carry case for safe storage and transport.</p>\n<h4>Features</h4>\n<ul>\n<li>Durable aluminum body</li>\n<li>Twist dial with dose window for easy reading</li>\n<li>Protective cap with pocket clip</li>\n<li>Zip carry case included</li>\n<li>Reusable design</li>\n</ul>',
    category: "pens",
    imageAlt: "Gansulin pen injector",
    images: [
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/gansulin-pen-injector.jpg", alt: "Gansulin pen injector" },
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/gansulin-pen-injector-case.jpg", alt: "Gansulin pen injector in zip carry case" },
    ],
  },
  {
    id: 2661,
    sku: "PH399.041",
    slug: "pen-injector-d5",
    name: "Pen Injector \u2013 D5",
    price: 24.99,
    shortDescription: "Lightweight white reusable pen injector with twist dial and large dose window.",
    metaDescription: "Pen Injector D5 \u2014 lightweight white reusable pen with twist dial and large dose window. Free US shipping.",
    description: '<p>A clean, lightweight reusable pen injector in white with a large dose window and twist dial.</p>\n<h4>Features</h4>\n<ul>\n<li>Twist dial with large, easy-read dose window</li>\n<li>Slim, lightweight white body</li>\n<li>Reusable design</li>\n</ul>',
    category: "pens",
    imageAlt: "Pen Injector D5",
    images: [
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/pen-injector-d5.jpg", alt: "Pen Injector D5" },
    ],
  },
  {
    id: 2662,
    sku: "PH399.042",
    slug: "pen-injector-v2",
    name: "Pen Injector \u2013 V2",
    price: 28.99,
    shortDescription: "Reusable pen injector with twist dial and dose window. Available in assorted colors.",
    metaDescription: "Pen Injector V2 \u2014 reusable pen injector with chrome accent band and twist dial. Arrives in an assorted color. Free US shipping.",
    description: '<p>A reusable pen injector with a metallic finish, chrome accent band and twist dial. Ships in an assorted color (red, blue, black, silver, or other available finish).</p>\n<h4>Features</h4>\n<ul>\n<li>Twist dial with dose window</li>\n<li>Metallic finish with chrome accent band</li>\n<li>Available in assorted colors</li>\n<li>Reusable design</li>\n</ul>',
    category: "pens",
    imageAlt: "Pen Injector V2",
    images: [
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/pen-injector-v2.jpg", alt: "Pen Injector V2" },
    ],
  },
  {
    id: 2663,
    sku: "PH399.050",
    slug: "pen-tips-100ct",
    name: "Pen Tips 100ct",
    price: 11.99,
    shortDescription: "100 sterile, individually capped 32G \u00d7 4mm pen tips.",
    metaDescription: "100 sterile 32G \u00d7 4mm pen tips, individually capped with outer and inner protective caps. Single use. Free US shipping.",
    description: '<p>Box of 100 individually capped, sterile pen tips.</p>\n<h4>Features</h4>\n<ul>\n<li>32G gauge, 4mm length</li>\n<li>Individually capped with outer and inner protective caps</li>\n<li>100 tips per box</li>\n<li>Single use only</li>\n</ul>',
    category: "pens",
    imageAlt: "Pen Tips 32G 4mm",
    images: [
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/pen-tips-32g.jpg", alt: "Pen Tips 32G 4mm" },
    ],
  },
  {
    id: 2664,
    sku: "PH399.060",
    slug: "3ml-cartridges-10-pack",
    name: "3mL Cartridges 10-Pack",
    price: 5.99,
    shortDescription: "10 individually pouched 3mL glass cartridges.",
    metaDescription: "10-pack 3mL glass cartridges, individually sealed in sterilization pouches with EO and steam indicator strips. Free US shipping.",
    description: '<p>Ten 3mL glass cartridges, each sealed in its own sterilization pouch.</p>\n<h4>Features</h4>\n<ul>\n<li>3mL clear glass cartridge with crimped metal cap and rubber plunger</li>\n<li>Individually sealed in a 57 \u00d7 130 mm sterilization pouch</li>\n<li>Pouch has EO and steam indicator strips</li>\n<li>10 cartridges per pack</li>\n</ul>',
    category: "pens",
    imageAlt: "3mL glass cartridges, 10-pack",
    images: [
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/3ml-cartridges-10-pack-hd.jpg", alt: "3mL glass cartridges, 10-pack" },
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/3ml-cartridge-sterile-pouch.jpg", alt: "3mL cartridge in individual sterile pouch" },
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/3ml-cartridge-pouch-label.jpg", alt: "Individual sterilization pouch, 57 x 130 mm" },
    ],
  },
  {
    id: 2666,
    sku: "PH399.070",
    slug: "digital-countertop-cooler-v1",
    name: "Digital Countertop Cooler V1",
    price: 86.99,
    shortDescription: "Compact digital countertop cooler with touch controls. Holds 25+ vials. Battery compatible (not included).",
    metaDescription: "Compact digital countertop cooler with touch controls. Cools 0\u201318 \u00b0C. Holds 25+ vials. Battery compatible (not included). US plug included. Free US shipping.",
    description: '<p>A compact countertop cooler with a digital display and touch controls on the lid, sized to hold a full set of vials. Runs from the included wall adapter, a car outlet or a USB power source.</p>\n<h4>Specifications</h4>\n<ul>\n<li><strong>Cooling range:</strong> 0\u201318 \u00b0C (32\u201364 \u00b0F)</li>\n<li><strong>Power draw:</strong> 11W</li>\n<li><strong>Power adapter:</strong> 5V 3.4A, US plug, included</li>\n<li><strong>Battery:</strong> Accepts a rechargeable lithium battery pack (not included)</li>\n<li><strong>Car / USB power:</strong> 5V</li>\n<li><strong>Package size:</strong> 27.5 \u00d7 22.5 \u00d7 17 cm (10.8 \u00d7 8.9 \u00d7 6.7 in)</li>\n</ul>\n<h4>Features</h4>\n<ul>\n<li>Digital display with touch power, mode and up/down temperature buttons</li>\n<li>Holds 25+ standard vials</li>\n<li>Stainless-look interior with sealed, gasketed lid</li>\n<li>Side ventilation for cooling</li>\n</ul>',
    category: "cold-storage",
    imageAlt: "Digital Countertop Cooler V1 with top control panel",
    images: [
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/digital-countertop-cooler-v1.jpg", alt: "Digital Countertop Cooler V1 with top control panel" },
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/digital-countertop-cooler-v1-open.jpg", alt: "Digital Countertop Cooler V1 open, holding vials" },
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/digital-countertop-cooler-v1-controls.jpg", alt: "Digital Countertop Cooler V1 touch control panel and display" },
    ],
  },
  {
    id: 2667,
    sku: "PH399.071",
    slug: "double-layer-mini-refrigerator",
    name: "Double-Layer Mini Refrigerator",
    price: 96.99,
    shortDescription: "Two-tier mini refrigerator with digital controls and removable rack.",
    metaDescription: "Two-tier mini refrigerator with digital controls and removable rack. Cools 0\u201318 \u00b0C. US plug included. Free US shipping.",
    description: '<p>A two-tier mini refrigerator with a digital control panel, removable rack and gasketed lid. Plugs into 5V DC power.</p>\n<h4>Specifications</h4>\n<ul>\n<li><strong>Cooling range:</strong> 0\u201318 \u00b0C (32\u201364 \u00b0F)</li>\n<li><strong>Power input:</strong> 5V DC</li>\n<li><strong>Power draw:</strong> 10W</li>\n<li><strong>Power cord:</strong> US plug, included</li>\n<li><strong>Battery:</strong> Accepts a rechargeable lithium battery pack (10,200 or 13,600 mAh, not included)</li>\n<li><strong>Cooling on battery:</strong> 4\u201318 \u00b0C (40\u201364 \u00b0F), 5W</li>\n</ul>\n<h4>Features</h4>\n<ul>\n<li>Digital display with touch power, mode and up/down temperature buttons</li>\n<li>Removable perforated rack creates two storage levels</li>\n<li>Gasketed lid for a tight seal</li>\n<li>Side ventilation for cooling</li>\n</ul>',
    category: "cold-storage",
    imageAlt: "Double-Layer Mini Refrigerator with digital control panel",
    images: [
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/double-layer-mini-fridge-open-rack.jpg", alt: "Double-Layer Mini Refrigerator open, with removable rack" },
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/double-layer-mini-fridge.jpg", alt: "Double-Layer Mini Refrigerator with digital control panel" },
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/double-layer-mini-fridge-open.jpg", alt: "Double-Layer Mini Refrigerator open, lower compartment" },
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/double-layer-mini-fridge-controls.jpg", alt: "Double-Layer Mini Refrigerator front control panel" },
    ],
  },
  {
    id: 2668,
    sku: "PH399.072",
    slug: "digital-countertop-cooler-v2",
    name: "Digital Countertop Cooler V2",
    price: 76.99,
    shortDescription: "Portable mini fridge with carry strap and touch controls. Cools 0\u201318 \u00b0C (32\u201364 \u00b0F) on 5V DC power.",
    metaDescription: "Portable mini fridge with carry strap and touch controls. Cools 0\u201318 \u00b0C on 5V DC. US plug included. Free US shipping.",
    description: '<p>A portable mini fridge with a carry strap and touch controls, built to keep vials cold at home, at work or while traveling. Plugs into 5V DC power.</p>\n<h4>Specifications</h4>\n<ul>\n<li><strong>Cooling range:</strong> 0\u201318 \u00b0C (32\u201364 \u00b0F)</li>\n<li><strong>Power input:</strong> 5V DC</li>\n<li><strong>Power draw:</strong> 10W</li>\n<li><strong>Controls:</strong> Touch ON/OFF and +/\u2212 temperature buttons</li>\n<li><strong>Power cord:</strong> US plug, included</li>\n<li><strong>Battery:</strong> Accepts a rechargeable lithium battery pack (10,200 or 13,600 mAh, not included)</li>\n<li><strong>Cooling on battery:</strong> 4\u201318 \u00b0C (40\u201364 \u00b0F), 5W</li>\n</ul>',
    category: "cold-storage",
    imageAlt: "Digital Countertop Cooler V2, front view",
    images: [
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/portable-mini-fridge-front.jpg", alt: "Digital Countertop Cooler V2, front view" },
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/portable-mini-fridge-angle.jpg", alt: "Digital Countertop Cooler V2 with carry strap, angled view" },
    ],
  },
  {
    id: 2669,
    sku: "PH399.073",
    slug: "portable-battery-cup-chiller",
    name: "Portable Battery Cup Chiller",
    price: 86.99,
    shortDescription: "Portable refrigeration cup with digital display. Cools 0\u201318 \u00b0C (32\u201364 \u00b0F) and runs about 4\u201310 hours on its built-in 10,600mAh battery.",
    metaDescription: "Portable refrigeration cup with digital display and built-in 10,600mAh battery. Cools 0\u201318 \u00b0C for 4\u201310 hours per charge. US plug included. Free US shipping.",
    description: '<p>A compact refrigeration cup that keeps vials and small containers chilled on your desk, in the car or on the go. Semiconductor (thermoelectric) cooling with a digital temperature display and one-touch controls. Runs on 5V power or its built-in rechargeable battery.</p>\n<h4>Specifications</h4>\n<ul>\n<li><strong>Type:</strong> Semiconductor refrigerator</li>\n<li><strong>Cooling range:</strong> 0\u201318 \u00b0C (32\u201364 \u00b0F)</li>\n<li><strong>Power input:</strong> 5V DC</li>\n<li><strong>Power draw:</strong> 10W on external power, 5W on battery</li>\n<li><strong>Built-in battery:</strong> Rechargeable lithium (18650 cells), 3.7V 10,600mAh</li>\n<li><strong>Battery run time:</strong> About 4\u201310 hours per charge (shorter in hotter conditions)</li>\n<li><strong>Controls:</strong> Power button and settings button with digital temperature readout</li>\n<li><strong>Standards:</strong> GB4706.1, GB4706.13</li>\n<li><strong>Power cord:</strong> US plug, included</li>\n</ul>',
    category: "cold-storage",
    imageAlt: "Portable Battery Cup Chiller, front view with digital display",
    images: [
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/portable-cup-chiller-front.jpg", alt: "Portable Battery Cup Chiller, front view with digital display" },
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/portable-cup-chiller-top.jpg", alt: "Portable Battery Cup Chiller, top view of chilling well" },
    ],
  },
  {
    id: 2670,
    sku: "PH399.080",
    slug: "100-vial-storage-case",
    name: "100-Vial Storage Case",
    price: 34.99,
    shortDescription: "Hard-shell case with 100 foam-lined vial slots and twin latches.",
    metaDescription: "Hard-shell storage case with 100 foam-lined vial slots in a 10\u00d710 grid. Twin latches, foam lid insert. Free US shipping.",
    description: '<p>A hard-shell storage case with foam-lined slots for 100 vials.</p>\n<h4>Features</h4>\n<ul>\n<li>100 individual slots in a 10 \u00d7 10 grid</li>\n<li>Foam-lined slots and foam lid insert to cushion vials</li>\n<li>Hinged lid with twin latches</li>\n</ul>',
    category: "vial-storage",
    imageAlt: "100-vial storage case holding vials",
    images: [
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/100-vial-storage-case-filled.jpg", alt: "100-vial storage case holding vials" },
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/100-vial-storage-case-open.jpg", alt: "100-vial storage case open, foam-lined slots" },
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/100-vial-storage-case-partial.jpg", alt: "100-vial storage case partially filled" },
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/100-vial-storage-case-closed.jpg", alt: "100-vial storage case closed" },
    ],
  },
  {
    id: 2671,
    sku: "PH399.081",
    slug: "10-vial-storage-case",
    name: "10-Vial Storage Case",
    price: 14.99,
    shortDescription: "Compact hard-shell case with 10 foam-lined vial slots.",
    metaDescription: "Compact hard-shell case with 10 foam-lined vial slots in a 2\u00d75 grid. Latch closure, small enough for a bag. Free US shipping.",
    description: '<p>A compact hard-shell case with foam-lined slots for 10 vials.</p>\n<h4>Features</h4>\n<ul>\n<li>10 individual slots in a 2 \u00d7 5 grid</li>\n<li>Foam-lined slots and foam lid insert to cushion vials</li>\n<li>Hinged lid with latch closure</li>\n<li>Small enough for a bag or glovebox</li>\n</ul>',
    category: "vial-storage",
    imageAlt: "10-vial storage case holding vials",
    images: [
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/10-vial-storage-case-filled.jpg", alt: "10-vial storage case holding vials" },
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/10-vial-storage-case-open.jpg", alt: "10-vial storage case open, foam-lined slots" },
      { src: "https://floorabovebrands.com/wp-content/uploads/2026/09/10-vial-storage-case-closed.jpg", alt: "10-vial storage case closed with latch" },
    ],
  },
];

export const CATEGORY_META: Record<string, { label: string; description: string }> = {
  supplies: { label: "Supplies", description: "Bacteriostatic water, syringes, prep pads, and research bundles." },
  pens: { label: "Pen Injectors & Cartridges", description: "Reusable pen injectors, replacement tips, and glass cartridges." },
  "cold-storage": { label: "Coolers & Mini Fridges", description: "Compact coolers and mini refrigerators for vial storage." },
  "vial-storage": { label: "Vial Storage", description: "Hard-shell cases with foam-lined slots for safe vial transport." },
  bundle: { label: "Bundles", description: "Pre-configured kits for common research workflows." },
};

export const PREP_PAD_ADDON_SKU = "PH399.020.AO";

export const PREP_PAD_TRIGGER_SKUS = new Set<string>([
  "PH399.001",
  "PH399.003",
  "PH399.006",
  "PH399.010",
  "PH399.030",
  "PH399.030.3",
]);

export const SYRINGE_ADDON_SKU = "PH399.030.AO";

export const SYRINGE_TRIGGER_SKUS = new Set<string>([
  "PH399.001",
  "PH399.003",
  "PH399.006",
  "PH399.010",
]);

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

interface PackInfo {
  singleSku: string;
  units: number;
}

const PACK_LOOKUP: Record<string, PackInfo> = {
  "PH399.003": { singleSku: "PH399.001", units: 3 },
  "PH399.006": { singleSku: "PH399.001", units: 6 },
  "PH399.010": { singleSku: "PH399.001", units: 10 },
  "PH399.030.3": { singleSku: "PH399.030", units: 3 },
};

interface BundleComponent {
  sku: string;
  qty: number;
}

const BUNDLE_COMPONENTS: Record<string, BundleComponent[]> = {
  "PH399.101": [
    { sku: "PH399.001", qty: 3 },
    { sku: "PH399.030", qty: 1 },
    { sku: "PH399.020.AO", qty: 1 },
  ],
  "PH399.102": [
    { sku: "PH399.001", qty: 6 },
    { sku: "PH399.030", qty: 1 },
    { sku: "PH399.020.AO", qty: 1 },
  ],
  "PH399.103": [
    { sku: "PH399.001", qty: 10 },
    { sku: "PH399.030", qty: 1 },
    { sku: "PH399.020.AO", qty: 1 },
  ],
};

export interface BundleSavings {
  individualTotal: number;
  savePercent: number;
}

function computeIndividualTotal(product: Product): number | null {
  const pack = PACK_LOOKUP[product.sku];
  if (pack) {
    const single = PRODUCTS.find((p) => p.sku === pack.singleSku);
    if (!single || single.price <= 0) return null;
    return pack.units * single.price;
  }
  const components = BUNDLE_COMPONENTS[product.sku];
  if (components) {
    let total = 0;
    for (const { sku, qty } of components) {
      const part = PRODUCTS.find((p) => p.sku === sku);
      if (!part || part.price <= 0) return null;
      total += qty * part.price;
    }
    return total;
  }
  return null;
}

export function getBundleSavings(product: Product): BundleSavings | null {
  const individualTotal = computeIndividualTotal(product);
  if (individualTotal === null) return null;
  if (individualTotal <= product.price) return null;
  const savePercent = Math.round(
    ((individualTotal - product.price) / individualTotal) * 100,
  );
  return { individualTotal, savePercent };
}
