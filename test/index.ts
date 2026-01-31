import { constants } from "fs";
import fs from "node:fs/promises";
import { MemoryFS } from "../src/domain/def/memory-file-system.js";
import { LocalFS } from "../src/domain/def/local-file-system.js";
import { ConstrainedFS } from "../src/domain/def/constrained-file-system.js";
import { DockerFS } from "../src/domain/def/docker-file-system.js";

async function testMemoryFS() {
  console.log("=== MemoryFS Tests ===\n");
  const memoryFS = new MemoryFS();

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
}

async function testLocalFS() {
  console.log("\n=== LocalFS Tests ===\n");
  const localFS = new LocalFS();
  const testFilePath = "./test/fixtures/local-test.txt";

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

  await fs.chmod(testFilePath, 0o644);
  await fs.rm("./test/fixtures", { recursive: true });
  console.log("Cleanup complete");
}

async function testConstrainedFS() {
  console.log("\n=== ConstrainedFS Tests ===\n");
  const testDir = "./test/sandbox";

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

  await fs.chmod(`${testDir}/test.txt`, 0o644);
  await fs.rm(testDir, { recursive: true });
  console.log("Cleanup complete");
}

async function testDockerFS() {
  console.log("\n=== DockerFS Tests ===\n");
  console.log(
    "NOTE: Requires a running Docker container named 'test-container'",
  );
  console.log(
    "Run: docker run -d --name test-container alpine sleep infinity\n",
  );

  const containerId =
    "5c054d41b261e3bf74e0f6131d4bdddcdf9e0d80981e1a1b31f64dcb4a6781f3";
  const dockerFS = new DockerFS(containerId);

  console.log("Test 1: Write a file to the container");
  await dockerFS.fileWrite("/tmp/test.txt", "Hello from Docker");
  console.log("File written to /tmp/test.txt");

  console.log("\nTest 2: Read the file from the container");
  const content = await dockerFS.fileRead("/tmp/test.txt");
  console.log("Content:", content.trim());

  console.log("\nTest 3: Read non-existent file");
  const notFound = await dockerFS.fileRead("/nonexistent.txt");
  console.log("Result:", notFound);

  console.log("\nTest 4: Change permission");
  await dockerFS.changePermission("/tmp/test.txt", 755);
  console.log("Permission changed to 755");

  console.log("\nCleanup: docker rm -f test-container");
}

async function runAllTests() {
  console.log("Running all file system tests...\n");

  await testMemoryFS();
  await testLocalFS();
  await testConstrainedFS();
  await testDockerFS();

  console.log("\n=== All tests complete! ===");
}

runAllTests().catch(console.error);
