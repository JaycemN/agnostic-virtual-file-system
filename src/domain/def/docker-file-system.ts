import { exec } from "child_process";
import util from "util";
const execPromise = util.promisify(exec);

import type { IFileSystem } from "../meta/i-file-system.js";

class DockerFS implements IFileSystem {
  private containerId: string;
  constructor(containerId: string) {
    this.containerId = containerId;
  }

  fileRead = async (path: string) => {
    try {
      const { stdout, stderr } = await execPromise(
        "docker exec " + this.containerId + " cat " + path,
      );
      if (stderr) throw new Error(stderr);
      return stdout;
    } catch (error) {
      console.error("Error reading file from Docker container:", error);
      return "Could not read file";
    }
  };
  fileWrite = async (path: string, content: string) => {
    try {
      const { stderr } = await execPromise(
        `docker exec ${this.containerId} sh -c 'echo "${content}" >> ${path}'`,
      );

      if (stderr) throw new Error(stderr);
    } catch (error) {
      console.error("Error writing file to Docker container:", error);
    }
  };
}

export { DockerFS };
