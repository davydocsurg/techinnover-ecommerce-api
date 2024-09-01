export function excludePassword(user: any): any {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
