import { ConstrainedFS } from "./domain/def/constrained-file-system.js";
import { MemoryFS } from "./domain/def/memory-file-system.js";
import { VirtualSystem } from "./domain/def/virtual-system.js";

async function main() {
  const memoryFS = new MemoryFS();
}

await main();
