import fs from "node:fs/promises";
import type { IFileSystem } from "../meta/i-file-system.js";
import { getActiveUser, getUsers } from "../../utils/data.js";
import { PermissionsEnum } from "../meta/enums/permissions.js";

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
      if (path.includes("..")) {
        throw new Error(
          "Directory path cannot contain parent directory references",
        );
      }
      if (!getActiveUser()) {
        throw new Error("No active user found, set an active user in order to use the system");
      }
      if (getUsers()[getActiveUser()].includes(PermissionsEnum.Read)) {
        const fileData = await fs.readFile(
          `${this.directoryPath}/${path}`,
          "utf8",
        );
        return fileData ?? "File not found";
      }
      throw new Error("No read permission");
    } catch (error) {
      return "Failed to read file: " + error;
    }
  };

  fileWrite = async (path: string, content: string) => {
    try {
      if (path.includes("..")) {
        throw new Error(
          "Directory path cannot contain parent directory references",
        );
      }
      if (!getActiveUser()) throw new Error("No active user found, set an active user in order to use the system");
      if (getUsers()[getActiveUser()].includes(PermissionsEnum.Write)) {
        await fs.writeFile(`${this.directoryPath}/${path}`, content);
        return;
      }
      throw new Error("No write permission");
    } catch (error) {
      console.error("Couldn't write file:", error);
    }
  };

}

export { ConstrainedFS };
