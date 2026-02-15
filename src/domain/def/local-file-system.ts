import fs from "node:fs/promises";
import type { IFileSystem } from "../meta/i-file-system.js";
import { VirtualSystem } from "./virtual-system.js";
import { PermissionsEnum } from "../meta/enums/permissions.js";
import { getActiveUser, getUsers } from "../../utils/data.js";
class LocalFS extends VirtualSystem implements IFileSystem {

  constructor() {
    super();
  }
  fileRead = async (path: string) => {
    try {
      if (!getActiveUser()) throw new Error("No active user found, set an active user in order to use the system");
      if (getUsers()[getActiveUser()].includes(PermissionsEnum.Read)) {
        return await fs.readFile(path, "utf8");
      }
      throw new Error("No read permission");
    } catch (error) {
      console.error(error);
      return "Could not read file";
    }
  };
  fileWrite = async (path: string, content: string) => {
    try {
      if (!getActiveUser()) throw new Error("No active user found, set an active user in order to use the system");
      if (getUsers()[getActiveUser()].includes(PermissionsEnum.Write)) {
        await fs.writeFile(path, content, "utf8");
        return;
      }
      throw new Error("No write permission");
    } catch (error) {
      console.error(error);
    }
  };
}

export { LocalFS };
