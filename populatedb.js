#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();

  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(
  index,
  name,
  description,
  category,
  price,
  number_in_stock
) {
  const itemdetail = {
    name: name,
    description: description,
    category: category,
    price: price,
    number_in_stock: number_in_stock,
  };

  const item = new Item(itemdetail);

  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding Categories");
  await Promise.all([
    categoryCreate(0, "CPU", "central processing unit "),
    categoryCreate(
      1,
      "Video card",
      "a computer expansion card that generates a feed of graphics output to a display device such as a monitor"
    ),
    categoryCreate(
      2,
      "Power supply",
      "A power supply unit (PSU) converts mains AC to low-voltage regulated DC power for the internal components of a computer."
    ),
    categoryCreate(
      3,
      "Memory",
      "Random-access memory (RAM; /ræm/) is a form of computer memory that can be read and changed in any order, typically used to store working data and machine code."
    ),
    categoryCreate(
      4,
      "Storage",
      "Computer data storage is a technology consisting of computer components and recording media that are used to retain digital data. It is a core function and fundamental component of computers"
    ),
    categoryCreate(
      5,
      "Operating system ",
      "An operating system (OS) is system software that manages computer hardware and software resources, and provides common services for computer programs."
    ),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate(
      0,
      "AMD Ryzen 5 5600X 3.7 GHz 6-Core Processor",
      "Perfect budget-friendly processor for gaming at 4K. At least twice as powerful as PS4/XB1 processors, and roughly on-par with the processors 9th gen PS5/Series X consoles are now using, but with 2 fewer cores.",
      categories[0],
      162,
      15
    ),
    itemCreate(
      1,
      "AMD Ryzen 7 5800X 3.8 GHz 8-Core Processor",
      "The Elite Gaming Processor. 8 cores optimized for high-FPS gaming rigs.",
      categories[0],
      227,
      12
    ),
    itemCreate(
      10,
      "MSI GeForce RTX 3060 Ventus 2X 12G",
      " VENTUS brings a performance-focused design that maintains the essentials to accomplish any task at hand.",
      categories[1],
      290,
      5
    ),
    itemCreate(
      11,
      "Gigabyte WINDFORCE OC",
      "The WINDFORCE cooling system features three 80mm unique blade fans, alternate spinning, 3 composite copper heat pipes directly touches the GPU, 3D active fans and Screen cooling, which together provide high efficiency heat dissipation.",
      categories[1],
      600,
      18
    ),
    itemCreate(
      2,
      "Corsair RM750e (2023)",
      "CORSAIR RMe Series Fully Modular Low-Noise Power Supplies provide quiet, reliable power with 80 PLUS Gold efficiency to your PC",
      categories[2],
      100,
      10
    ),
    itemCreate(
      3,
      "Corsair RM850x (2021)",
      "CORSAIR RM850x Series fully modular power supplies with EPS12V connectors are built with the highest quality components to deliver 80 PLUS Gold efficient power to your PC,with virtually silent operation.",
      categories[2],
      130,
      35
    ),
    itemCreate(
      4,
      "Corsair Vengeance LPX 16 GB",
      "VENGEANCE LPX memory is designed for high-performance overclocking.",
      categories[3],
      38,
      2
    ),
    itemCreate(
      5,
      "Corsair Vengeance RGB Pro 32 GB",
      "CORSAIR VENGEANCE RGB PRO Series DDR4 memory lights up your PC with mesmerizing dynamic multi-zone RGB lighting, while delivering the best in DDR4 performance and stability.",
      categories[3],
      105,
      13
    ),
    itemCreate(
      6,
      "Samsung 970 Evo Plus",
      "The ultimate in performance, upgraded. Faster than the 970 EVO, the 970 EVO Plus is powered by the latest V-NAND technology and firmware optimization. It maximizes the potential of NVMe™ bandwidth for unbeatable computing. In capacities up to 2TB, with reliability of up to 1,200 TBW.",
      categories[4],
      55,
      19
    ),
    itemCreate(
      7,
      "Samsung 980 Pro",
      "Unleash the power of the Samsung PCIe® 4.0 NVMe™ SSD 980 PRO for your next-level computing. Leveraging the PCIe® 4.0 interface, the 980 PRO delivers double the data transfer rate of PCIe® 3.0 while being backward compatible for PCIe® 3.0 for added versatility.",
      categories[4],
      100,
      24
    ),
    itemCreate(
      8,
      "Microsoft Windows 11 Home (64-bit)",
      "Windows 11 is the latest major release of Microsoft's Windows NT operating system, released on October 5, 2021. It was a free upgrade to its predecessor, Windows 10 (2015), and is available for any Windows 10 devices that meet the new Windows 11 system requirements.",
      categories[5],
      100,
      11
    ),
  ]);
}
