interface IFileSystem {
  fileRead: (path: string) => string | Promise<string>;
  fileWrite: (path: string, content: string) => void;
  changePermission?: (path: string, mode: number) => void;
}

export type { IFileSystem };
