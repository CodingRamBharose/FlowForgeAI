export enum UserRole {
    ADMIN = 'ADMIN',
    ENGINEER = 'ENGINEER',
    REVIEWER = 'REVIEWER',
    VIEWER = 'VIEWER',
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    createdAt?: string;
}

export const isAdmin = (role: UserRole): boolean => role === UserRole.ADMIN;
export const isEngineer = (role: UserRole): boolean => role === UserRole.ENGINEER;
export const isReviewer = (role: UserRole): boolean => role === UserRole.REVIEWER;
export const isViewer = (role: UserRole): boolean => role === UserRole.VIEWER;

export const canEdit = (role: UserRole): boolean =>
    role === UserRole.ADMIN || role === UserRole.ENGINEER;

export const canPublish = (role: UserRole): boolean => role === UserRole.ADMIN;

export const canApprove = (role: UserRole): boolean =>
    role === UserRole.ADMIN || role === UserRole.REVIEWER;

export const canRollback = (role: UserRole): boolean => role === UserRole.ADMIN;
