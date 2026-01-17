import path from "path";

interface IFileSystem {
  fileRead: (path: string) => Promise<string>;
  fileWrite: (path: string, content: string) => Promise<void>;
}

export type { IFileSystem };
