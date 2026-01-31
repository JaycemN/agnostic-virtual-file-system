import { DockerFS } from "../src/domain/def/docker-file-system.js";

// NOTE: This test requires a running Docker container
// Run: docker run -d --name test-container alpine sleep infinity
// Then update the containerId below

const containerId = "test-container"; // Update with your container ID

async function runTests() {
  console.log("=== DockerFS Tests ===\n");
  console.log(
    "NOTE: Requires a running Docker container named 'test-container'",
  );
  console.log(
    "Run: docker run -d --name test-container alpine sleep infinity\n",
  );

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

  console.log("\nTests complete!");
  console.log("Cleanup: docker rm -f test-container");
}

runTests().catch(console.error);
