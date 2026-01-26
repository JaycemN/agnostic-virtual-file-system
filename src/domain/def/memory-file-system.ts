import type { IFileSystem } from "../meta/i-file-system.js";

class MemoryFS implements IFileSystem {
  private storage: Map<string, string>;

  constructor() {
    this.storage = new Map<string, string>();
  }
  fileRead = (path: string) => {
    try {
      const file = this.storage.get(path);
      if (!file) throw new Error("File does not exist");
      return file;
    } catch (error) {
      console.error("Error reading file:", error);
      return error as string;
    }
  };

  fileWrite = (path: string, content: string) => {
    this.storage.set(path, content);
  };
}

export { MemoryFS };
