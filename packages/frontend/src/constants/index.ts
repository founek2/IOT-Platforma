import { Permission } from "common/src/models/interface/userInterface.js";

export const TokenPermissions = [{
    label: "čtení",
    value: Permission.read
}, {
    label: "zápis",
    value: Permission.write
}, {
    label: "ovládání",
    value: Permission.control
}]