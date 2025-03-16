import { GuildMember, Interaction, Role } from "discord.js";
import { config } from "../db";

export async function verifyPincode(_pincode: string): Promise<boolean> {
    const permissionPincode = config.settings.permission.pincode || "";
    if (!permissionPincode) return false;
    return permissionPincode === _pincode
}

export async function verifyUserId(_userId: string): Promise<boolean> {
    const banned_ids = config.settings.permission.banned_ids || [];
    if (!banned_ids.length) return false;
    return !banned_ids.includes(_userId)
}

export async function verifyRole(interaction: Interaction): Promise<boolean> {
    const allowedRoles = config.settings.permission.allowed_roles || [];
    if (!allowedRoles.length) return true;

    const member = interaction.member as GuildMember;

    if (!member || !member.roles || !member.roles.cache) {
        return false;
    }
    const userRoles = member.roles.cache.map((role: Role) => role.name); //Get role list

    return allowedRoles.some((role) => userRoles.includes(role));

}