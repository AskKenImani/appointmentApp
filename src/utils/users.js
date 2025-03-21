export const USERS = [
    {
      uid: "user123",
      email: "user@example.com",
      role: "admin", 
      createdAt: "2025-03-17T10:00:00Z",
    },
  ];
  
  export const ROLES = {
    ADMIN: "admin",
    MANAGER: "manager",
    RECEPTIONIST: "receptionist",
    USER: "user",
  };
  
  
  export const ROLE_LIMITS = {
    admin: 2,
    manager: 2,
    receptionist: 3,
    user: "unlimited",
  };
  
  export const checkRoleAvailability = (role, currentUsers) => {
    if (ROLE_LIMITS[role] === "unlimited") return true;
    const roleCount = currentUsers.filter(user => user.role === role).length;
    return roleCount < ROLE_LIMITS[role];
  };
  