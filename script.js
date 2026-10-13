
"use strict";

// 1. DATA INITIALIZATION: Array of product objects
const demoInventory = [
  { name: "Laptop", price: 800 },
  { name: "Mouse", price: 25 },
  { name: "Monitor", price: 150 }
];

let inventory = demoInventory.map(item => ({ ...item }));

const consoleOutput = document.getElementById("consoleOutput");

// Display output in the dashboard and browser console
function log(message = "") {
  console.log(message);
  consoleOutput.textContent += message + "\n";
}

// 2. CONTROL FLOW: if...else
function getCategory(price) {
  if (price < 50) {
    return "Budget";
  } else if (price < 200) {
    return "Standard";
  } else {
    return "Premium";
  }
}

// switch: Assign category styling
function getBadgeClass(category) {
  switch (category) {
    case "Budget":
      return "budget";
    case "Standard":
      return "standard";
    case "Premium":
      return "premium";
    default:
      return "";
  }
}

// 3. LOOPS: for, continue, and break
function findProduct(name) {
  for (let i = 0; i < inventory.length; i++) {
    const item = inventory[i];

    if (!item) {
      continue;
    }

    if (item.name.toLowerCase() === name.toLowerCase()) {
      return item; // Stop searching when found
    }
  }

  return null;
}

// 4. FUNCTIONS AND SCOPE
function calculateTotal(items) {
  let total = 0;

  items.forEach(function (item) {
    total += item.price;
  });

  return total;
}

// Arrow functions with custom tax and discount rates
const calculateTax = (amount, rate = 0.10) => amount * rate;
const calculateDiscount = (amount, rate = 0.05) => amount * rate;
const formatMoney = amount => "$" + amount.toFixed(2);

// 5. INPUT: prompt(), Number(), and validation
function addProduct() {
  const inputName = prompt("Enter product name:");

  if (inputName === null) {
    log("Product entry cancelled.");
    return;
  }

  const name = inputName.trim();

  if (name === "") {
    alert("Product name cannot be empty.");
    log("Validation failed: empty product name.");
    return;
  }

  const inputPrice = prompt("Enter product price in dollars:");

  if (inputPrice === null) {
    log("Product entry cancelled.");
    return;
  }

  const price = Number(inputPrice);

  if (
    inputPrice.trim() === "" ||
    !Number.isFinite(price) ||
    price <= 0
  ) {
    alert("Enter a valid price greater than zero.");
    log("Validation failed: invalid product price.");
    return;
  }

  // Prevent duplicate product names
  if (findProduct(name)) {
    alert("This product already exists.");
    log("Validation failed: duplicate product name.");
    return;
  }

  inventory.push({ name, price });

  log(
    `[Prompt executed: User adds "${name}" at ${formatMoney(price)}]`
  );

  renderDashboard();
}

// 6. ARRAY METHODS: forEach(), filter(), and map()
function runAnalytics() {
  consoleOutput.textContent = "";

  log("--- Initializing Inventory System ---");
  log("");
  log("--- Processing Inventory Roster (forEach) ---");

  inventory.forEach(function (item) {
    const category = getCategory(item.price);

    log(
      `* Item: ${item.name} (${formatMoney(item.price)})` +
      ` -> Category: ${category}`
    );
  });

  // filter(): Find products priced under $200
  const affordableItems = inventory.filter(
    item => item.price < 200
  );

  // map(): Generate the formatted report
  const report = inventory.map(
    item => `${item.name.toUpperCase()}: ${formatMoney(item.price)}`
  );

  // Calculate financial statistics
  const total = calculateTotal(inventory);

  const average = inventory.length > 0
    ? total / inventory.length
    : 0;

  const tax = calculateTax(total, 0.10);
  const discount = calculateDiscount(total, 0.05);

  log("");
  log("--- Financial Analytics ---");
  log(`Total Inventory Value: ${formatMoney(total)}`);

  log(
    "Filtered Affordable Items (Under $200): " +
    JSON.stringify(affordableItems.map(item => item.name))
  );

  log(`Formatted Report List: ${JSON.stringify(report)}`);
  log(`Estimated Tax (10%): ${formatMoney(tax)}`);
  log(`Potential Discount (5%): ${formatMoney(discount)}`);

  // Update summary cards
  document.getElementById("count").textContent = inventory.length;
  document.getElementById("totalValue").textContent = formatMoney(total);
  document.getElementById("averagePrice").textContent = formatMoney(average);
  document.getElementById("taxValue").textContent = formatMoney(tax);

  document.getElementById("productCountPill").textContent =
    `${inventory.length} ${
      inventory.length === 1 ? "product" : "products"
    }`;

  renderAffordableItems(affordableItems);
  renderReport(report);
}

// Display affordable products
function renderAffordableItems(items) {
  const container = document.getElementById("affordableList");
  container.replaceChildren();

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No products priced under $200.";
    container.appendChild(empty);
    return;
  }

  items.forEach(item => {
    const row = document.createElement("div");
    row.className = "product-item";

    const name = document.createElement("span");
    name.className = "product-name";
    name.textContent = item.name;

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = formatMoney(item.price);

    row.append(name, price);
    container.appendChild(row);
  });
}

// Display formatted report
function renderReport(lines) {
  const container = document.getElementById("reportList");
  container.replaceChildren();

  lines.forEach(line => {
    const row = document.createElement("div");
    row.className = "report-row";

    const separator = line.lastIndexOf(": ");

    const name = document.createElement("span");
    name.className = "report-name";
    name.textContent =
      separator >= 0 ? line.slice(0, separator) : line;

    const price = document.createElement("span");
    price.className = "report-price";
    price.textContent =
      separator >= 0 ? line.slice(separator + 2) : "";

    row.append(name, price);
    container.appendChild(row);
  });
}

// Render inventory table
function renderDashboard() {
  const tbody = document.getElementById("inventoryBody");
  tbody.replaceChildren();

  inventory.forEach(item => {
    const category = getCategory(item.price);
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = item.name;

    const priceCell = document.createElement("td");
    priceCell.textContent = formatMoney(item.price);

    const categoryCell = document.createElement("td");
    const badge = document.createElement("span");

    badge.className =
      `category-badge ${getBadgeClass(category)}`;
    badge.textContent = category;

    categoryCell.appendChild(badge);
    row.append(nameCell, priceCell, categoryCell);
    tbody.appendChild(row);
  });

  runAnalytics();
}

// Reset the original demo data
function resetInventory() {
  inventory = demoInventory.map(item => ({ ...item }));
  renderDashboard();
}

// Button event listeners
document.getElementById("addBtn")
  .addEventListener("click", addProduct);

document.getElementById("resetBtn")
  .addEventListener("click", resetInventory);

// Initialize the dashboard
renderDashboard();
