import fs from "node:fs/promises";
import { LocalFS } from "../src/domain/def/local-file-system.js";

const localFS = new LocalFS();
const testFilePath = "./test/fixtures/local-test.txt";

async function runTests() {
  console.log("=== LocalFS Tests ===\n");

  // Setup: create test file
  await fs.mkdir("./test/fixtures", { recursive: true });
  await fs.writeFile(testFilePath, "Initial content", { mode: 0o644 });

  console.log("Test 1: Read existing file");
  const content = await localFS.fileRead(testFilePath);
  console.log("Content:", content);
  console.log("Pass:", content === "Initial content");

  console.log("\nTest 2: Write to file");
  await localFS.fileWrite(testFilePath, "Updated content");
  const updatedContent = await localFS.fileRead(testFilePath);
  console.log("Updated content:", updatedContent);
  console.log("Pass:", updatedContent === "Updated content");

  console.log("\nTest 3: Read non-existent file");
  const notFound = await localFS.fileRead("./nonexistent.txt");
  console.log("Result:", notFound);

  console.log("\nTest 4: Change permission");
  await localFS.changePermission(testFilePath, 0o444);
  const stats = await fs.stat(testFilePath);
  console.log("New mode:", (stats.mode & 0o777).toString(8));

  // Cleanup
  await fs.chmod(testFilePath, 0o644);
  await fs.rm("./test/fixtures", { recursive: true });
  console.log("\nCleanup complete");
}

runTests().catch(console.error);
