interface IFileSystem {
  fileRead: (path: string) => string | Promise<string>;
  fileWrite: (path: string, content: string) => void;
}

export type { IFileSystem };
