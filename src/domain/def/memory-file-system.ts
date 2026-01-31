import { constants } from "fs";
import type { IFileSystem } from "../meta/i-file-system.js";

class MemoryFS implements IFileSystem {
  private storage: Map<string, string>;
  private permission: Map<string, number>;

  constructor() {
    this.storage = new Map<string, string>();
    this.permission = new Map<string, number>();
  }
  fileRead = (path: string) => {
    try {
      if ((this.permission.get(path)! & constants.R_OK) == constants.R_OK) {
        const file = this.storage.get(path);
        if (!file) throw new Error("File does not exist");
        return file;
      } else {
        throw new Error("No read permission for this file");
      }
    } catch (error) {
      console.error("Error reading file:", error);
      return error as string;
    }
  };

  fileWrite = (path: string, content: string) => {
    if (this.storage.get(path)) {
      if ((this.permission.get(path)! & constants.W_OK) == constants.W_OK)
        this.storage.set(path, content);
    } else {
      this.storage.set(path, content);
      this.permission.set(path, 0o06);
    }
  };

  changePermission = (path: string, mode: number) => {
    this.permission.set(path, mode);
  };
}

export { MemoryFS };
