import type { FileSystemFunction } from "./i-file-system-types.js";

interface IFileSystem {
  //File Operations
  //Read Operations
  fileRead: FileSystemFunction<string>;
  fileReadBuffer: FileSystemFunction<Buffer>;

  // Write Operations
  fileWrite: FileSystemFunction<void>;
  fileAppend: FileSystemFunction<void>;
  fileWriteBuffer: FileSystemFunction<void>;

  // Delete Operations
  fileDelete: FileSystemFunction<void>;

  // Utility Operations
  fileExists: FileSystemFunction<boolean>;
  fileCopy: FileSystemFunction<void>;
  fileMove: FileSystemFunction<void>;
  fileRename: FileSystemFunction<void>;

  // Directory Operations
  dirCreate: FileSystemFunction<void>;
  dirDelete: FileSystemFunction<void>;
  dirExists: FileSystemFunction<boolean>;
  dirRead: FileSystemFunction<string[]>;
  dirCopy: FileSystemFunction<void>;

  // Metadata Operations
  fileStat: FileSystemFunction<{
    size: number;
    createdAt: Date;
    modifiedAt: Date;
  }>;
  fileSize: FileSystemFunction<number>;
  fileCreatedAt: FileSystemFunction<Date>;
  fileModifiedAt: FileSystemFunction<Date>;
  filePermissions: FileSystemFunction<string>;

  // Permission Operations
  chageFilePermissions: FileSystemFunction<void>;
  changeDirPermissions: FileSystemFunction<void>;
  checkFilePermissions: FileSystemFunction<boolean>;
  checkDirPermissions: FileSystemFunction<boolean>;
}

export type { IFileSystem };
