import fs from "node:fs";
import type { IFileSystem } from "../meta/i-file-system.js";
import { addUser, getUsers, removeUser, addGroup, removeGroup, initData } from "../../utils/data.js";
import { PermissionsEnum } from "../meta/enums/permissions.js";
import { config } from "node:process";


class VirtualSystem {
    private activeUser: string;

    constructor() {
        initData();
        try {
            const data = fs.readFileSync('../data/data.json', 'utf8');
            const parsedData = JSON.parse(data);
            this.activeUser = parsedData.activeUser ?? '';
        } catch (error) {
            console.warn('No active user found, set an active user in order to use the system')
            this.activeUser = '';
        }
    }

    getActiveUser() {
        return this.activeUser;
    }

    activateUser(username: string) {
        this.activeUser = username;
    }

    addUser = (username: string, permissions: PermissionsEnum[]) => {
        if (!!getUsers()[username]) console.warn("User already exists");
        addUser(username, permissions);
    }
    removeUser = (username: string) => {
        removeUser(username);
    }
    addGroup = (groupName: string, permissions: PermissionsEnum[], users: string[]) => {
        addGroup(groupName, permissions, users);
    }
    removeGroup = (groupName: string) => {
        removeGroup(groupName);
    }
}

export { VirtualSystem };