import fs from "node:fs/promises";
import { ConstrainedFS } from "../src/domain/def/constrained-file-system.js";

const testDir = "./test/sandbox";

async function runTests() {
  console.log("=== ConstrainedFS Tests ===\n");

  // Setup: create test directory and file
  await fs.mkdir(testDir, { recursive: true });
  await fs.writeFile(`${testDir}/test.txt`, "Sandbox content", { mode: 0o644 });

  const constrainedFS = new ConstrainedFS(testDir);

  console.log("Test 1: Read file within constrained directory");
  const content = await constrainedFS.fileRead("test.txt");
  console.log("Content:", content);
  console.log("Pass:", content === "Sandbox content");

  console.log("\nTest 2: Write to file within constrained directory");
  await constrainedFS.fileWrite("test.txt", "Updated sandbox content");
  const updatedContent = await constrainedFS.fileRead("test.txt");
  console.log("Updated content:", updatedContent);
  console.log("Pass:", updatedContent === "Updated sandbox content");

  console.log("\nTest 3: Read non-existent file");
  const notFound = await constrainedFS.fileRead("nonexistent.txt");
  console.log("Result:", notFound);

  console.log(
    "\nTest 4: Attempt to create ConstrainedFS with parent reference",
  );
  try {
    new ConstrainedFS("../unsafe/path");
    console.log("Pass: false (should have thrown)");
  } catch (error) {
    console.log("Correctly threw error:", (error as Error).message);
    console.log("Pass: true");
  }

  console.log("\nTest 5: Change permission");
  await constrainedFS.changePermission("test.txt", 0o444);
  const stats = await fs.stat(`${testDir}/test.txt`);
  console.log("New mode:", (stats.mode & 0o777).toString(8));

  // Cleanup
  await fs.chmod(`${testDir}/test.txt`, 0o644);
  await fs.rm(testDir, { recursive: true });
  console.log("\nCleanup complete");
}

runTests().catch(console.error);
