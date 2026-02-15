import { VirtualSystem } from "./virtual-system.js";
import { PermissionsEnum } from "../meta/enums/permissions.js";
import type { IFileSystem } from "../meta/i-file-system.js";

class MemoryFS extends VirtualSystem implements IFileSystem {
  private storage: Map<string, string>;
  private users: Map<string, PermissionsEnum[]>;
  private groups: Map<string, { users: string[], permissions: PermissionsEnum[] }>;

  constructor() {
    super();
    this.storage = new Map<string, string>();
    this.users = new Map<string, PermissionsEnum[]>();
    this.groups = new Map<string, { users: string[], permissions: PermissionsEnum[] }>();
  }
  fileRead = (path: string) => {
    if (!this.getActiveUser()) throw new Error("No active user found, set an active user in order to use the system");
    if (this.users.get(this.getActiveUser())!.includes(PermissionsEnum.Read)) {
      if (this.storage.get(path)) {
        return this.storage.get(path)!;
      }
    }
    throw new Error("File does not exist");
  }

  fileWrite = (path: string, content: string): void => {
    if (!this.getActiveUser()) throw new Error("No active user found, set an active user in order to use the system");
    if (this.users.get(this.getActiveUser())!.includes(PermissionsEnum.Write)) {
      this.storage.set(path, content);
      return;
    }
    throw new Error("No write permission");
  };

  addUser = (username: string, permissions: PermissionsEnum[]) => {
    this.users.set(username, permissions);
  }
  removeUser = (username: string) => {
    this.users.delete(username);
  }
  addGroup = (groupName: string, permissions: PermissionsEnum[], users: string[]) => {
    this.groups.set(groupName, { users, permissions });
  }
  removeGroup = (groupName: string) => {
    this.groups.delete(groupName);
  }
}

export { MemoryFS };
