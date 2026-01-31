import fs from "node:fs/promises";
import type { IFileSystem } from "../meta/i-file-system.js";

class LocalFS implements IFileSystem {
  fileRead = async (path: string) => {
    try {
      return await fs.readFile(path, "utf8");
    } catch (error) {
      console.error(error);
      return "Could not read file";
    }
  };
  fileWrite = async (path: string, content: string) => {
    try {
      await fs.writeFile(path, content, "utf8");
    } catch (error) {
      console.error(error);
    }
  };
  changePermission = async (path: string, mode: number) => {
    try {
      await fs.chmod(path, mode);
    } catch (error) {
      console.error(error);
    }
  };
}

export { LocalFS };
