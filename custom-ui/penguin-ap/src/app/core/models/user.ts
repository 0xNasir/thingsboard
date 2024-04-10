export interface User {
  sub: string;
  scopes: string[],
  userId: string,
  firstName: string;
  lastName: string;
  enabled: string;
  tenantId: string;
  customerId: string;
  iss: string;
  iat: number;
  exp: number
}
