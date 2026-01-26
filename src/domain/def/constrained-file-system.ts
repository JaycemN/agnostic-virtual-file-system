import fs from "node:fs/promises";
import type { IFileSystem } from "../meta/i-file-system.js";

class ConstrainedFS implements IFileSystem {
  private directoryPath: string;

  constructor(directoryPath: string) {
    if (directoryPath.includes("..")) {
      throw new Error(
        "Directory path cannot contain parent directory references",
      );
    }
    this.directoryPath = directoryPath;
  }

  fileRead = async (path: string) => {
    try {
      const fileData = await fs.readFile(
        `${this.directoryPath}/${path}`,
        "utf8",
      );
      return fileData;
    } catch (error) {
      return "Could not read file";
    }
  };

  fileWrite = async (path: string, content: string) => {
    try {
      await fs.writeFile(`${this.directoryPath}/${path}`, content);
    } catch (error) {
      console.error("Couldn't write file:", error);
    }
  };
}

export { ConstrainedFS };
