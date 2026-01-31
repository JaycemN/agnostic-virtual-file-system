import { constants } from "fs";
import { MemoryFS } from "../src/domain/def/memory-file-system.js";

const memoryFS = new MemoryFS();

// Test fileWrite and fileRead
console.log("=== MemoryFS Tests ===\n");

console.log("Test 1: Write and read a file");
memoryFS.fileWrite("/test.txt", "Hello, World!");
const content = memoryFS.fileRead("/test.txt");
console.log("Content:", content);
console.log("Pass:", content === "Hello, World!");

console.log("\nTest 2: Read non-existent file");
const notFound = memoryFS.fileRead("/nonexistent.txt");
console.log("Result:", notFound);

console.log("\nTest 3: Change permission and try to write");
memoryFS.changePermission("/test.txt", constants.W_OK);
memoryFS.fileWrite("/test.txt", "Updated content");
const updatedContent = memoryFS.fileRead("/test.txt");
console.log("Updated content:", updatedContent);
console.log("Pass:", updatedContent === "Updated content");

console.log("\nTest 4: Remove write permission and try to write");
memoryFS.changePermission("/test.txt", constants.R_OK);
memoryFS.fileWrite("/test.txt", "Should not update");
const unchangedContent = memoryFS.fileRead("/test.txt");
console.log("Content after failed write:", unchangedContent);
console.log("Pass:", unchangedContent === "Updated content");
