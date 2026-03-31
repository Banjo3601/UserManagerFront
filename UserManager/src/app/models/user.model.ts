export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate?: string;
  birthCity?: string;
  description?: string;
  profileImageUrl?: string;
}