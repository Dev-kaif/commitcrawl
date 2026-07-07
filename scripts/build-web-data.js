import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const ROOMS_DIR = path.join(process.cwd(), "rooms");
const OUT_FILE = path.join(process.cwd(), "web", "rooms.json");

function getAllYamlFiles(dir, fileList = []) {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllYamlFiles(fullPath, fileList);
    } else if (entry.endsWith(".yaml") && !entry.startsWith("_")) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function loadRooms() {
  const files = getAllYamlFiles(ROOMS_DIR);

  const rooms = {};
  for (const file of files) {
    const data = yaml.load(fs.readFileSync(file, "utf8"));
    if (data && data.id) rooms[data.id] = data;
  }
  return rooms;
}

const rooms = loadRooms();
fs.writeFileSync(OUT_FILE, JSON.stringify(rooms, null, 2));
console.log(`Built web/rooms.json with ${Object.keys(rooms).length} room(s).`);
