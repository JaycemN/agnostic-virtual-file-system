import fs from "node:fs";
import { PermissionsEnum } from "../domain/meta/enums/permissions.js";


const initData = () => {
    // Check if data directory exists
    if (fs.existsSync('./data/')) {
        // Check if data file exists
        if (fs.existsSync('./data/data.json')) {
            fs.readFileSync('./data/data.json', 'utf8');
        } else {
            fs.writeFileSync('./data/data.json', '{}');
        }
    } else {
        fs.mkdirSync('./data/');
        fs.writeFileSync('./data/data.json', '{}');
    }
}

const getUsers = () => {
    const data = fs.readFileSync('./data/data.json', 'utf8');
    const parsedData = JSON.parse(data);
    return parsedData.users;
}

const getGroups = () => {
    const data = fs.readFileSync('./data/data.json', 'utf8');
    const parsedData = JSON.parse(data);
    return parsedData.groups;
}

const addUser = (username: string, permissions: PermissionsEnum[]) => {
    const data = fs.readFileSync('./data/data.json', 'utf8');
    const parsedData = JSON.parse(data);
    parsedData.users[username] = permissions;
    fs.writeFileSync('./data/data.json', JSON.stringify(parsedData));
}

const removeUser = (username: string) => {
    const data = fs.readFileSync('./data/data.json', 'utf8');
    const parsedData = JSON.parse(data);
    delete parsedData.users[username];
    fs.writeFileSync('./data/data.json', JSON.stringify(parsedData));
}

const addGroup = (groupName: string, permissions: PermissionsEnum[], users: string[]) => {
    const data = fs.readFileSync('./data/data.json', 'utf8');
    const parsedData = JSON.parse(data);
    parsedData.groups[groupName] = { permissions, users };
    fs.writeFileSync('./data/data.json', JSON.stringify(parsedData));
}

const removeGroup = (groupName: string) => {
    const data = fs.readFileSync('./data/data.json', 'utf8');
    const parsedData = JSON.parse(data);
    delete parsedData.groups[groupName];
    fs.writeFileSync('./data/data.json', JSON.stringify(parsedData));
}

const getActiveUser = () => {
    const data = fs.readFileSync('./data/data.json', 'utf8');
    const parsedData = JSON.parse(data);
    return parsedData.activeUser;
}

const setActiveUser = (username: string) => {
    const data = fs.readFileSync('./data/data.json', 'utf8');
    const parsedData = JSON.parse(data);
    parsedData.activeUser = username;
    fs.writeFileSync('./data/data.json', JSON.stringify(parsedData));
}

export { initData, getUsers, getGroups, addUser, removeUser, addGroup, removeGroup, getActiveUser, setActiveUser };