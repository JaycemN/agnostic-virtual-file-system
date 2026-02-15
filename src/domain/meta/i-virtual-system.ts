import type { IFileSystem } from "./i-file-system.js";

interface IVirtualSystem {
 activeUser: string;
 system: IFileSystem;
 activateUser: (username: string) => void;
}

export type { IVirtualSystem };