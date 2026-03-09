import { UserRole } from './roles';

export enum Permission {
    WORKFLOW_CREATE = 'WORKFLOW_CREATE',
    WORKFLOW_EDIT = 'WORKFLOW_EDIT',
    WORKFLOW_DELETE = 'WORKFLOW_DELETE',
    WORKFLOW_PUBLISH = 'WORKFLOW_PUBLISH',
    WORKFLOW_APPROVE = 'WORKFLOW_APPROVE',
    WORKFLOW_ROLLBACK = 'WORKFLOW_ROLLBACK',
    WORKFLOW_VIEW = 'WORKFLOW_VIEW',
    AUDIT_VIEW = 'AUDIT_VIEW',
}

export const rolePermissions: Record<UserRole, Permission[]> = {
    [UserRole.ADMIN]: [
        Permission.WORKFLOW_CREATE,
        Permission.WORKFLOW_EDIT,
        Permission.WORKFLOW_DELETE,
        Permission.WORKFLOW_PUBLISH,
        Permission.WORKFLOW_APPROVE,
        Permission.WORKFLOW_ROLLBACK,
        Permission.WORKFLOW_VIEW,
        Permission.AUDIT_VIEW,
    ],
    [UserRole.ENGINEER]: [
        Permission.WORKFLOW_CREATE,
        Permission.WORKFLOW_EDIT,
        Permission.WORKFLOW_VIEW,
    ],
    [UserRole.REVIEWER]: [
        Permission.WORKFLOW_APPROVE,
        Permission.WORKFLOW_VIEW,
        Permission.AUDIT_VIEW,
    ],
    [UserRole.VIEWER]: [Permission.WORKFLOW_VIEW],
};

export const hasPermission = (role: UserRole, permission: Permission): boolean => {
    return rolePermissions[role].includes(permission);
};

export const hasAnyPermission = (role: UserRole, permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(role, permission));
};

export const hasAllPermissions = (role: UserRole, permissions: Permission[]): boolean => {
    return permissions.every((permission) => hasPermission(role, permission));
};
