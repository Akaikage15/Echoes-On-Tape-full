
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { SubscriptionTier } from '@rootTypes';

// Simplified in-memory "database" for users
interface User {
  id: string;
  email: string;
  password_hash: string;
  name?: string;
  avatar_url?: string;
  subscriptionTier: SubscriptionTier;
  subscriptionEndDate?: string;
  created_at: Date;
  updated_at: Date;
}

const users: User[] = [];

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  return users.find(user => user.email === email);
};

export const createUser = async (email: string, password_hash: string, name?: string): Promise<User> => {
  const newUser: User = {
    id: uuidv4(),
    email,
    password_hash,
    name,
    subscriptionTier: 'none',
    created_at: new Date(),
    updated_at: new Date(),
  };
  users.push(newUser);
  return newUser;
};

export const findUserById = async (id: string): Promise<User | undefined> => {
  return users.find(user => user.id === id);
};

// For demonstration/testing purposes:
export const clearUsers = () => {
  users.length = 0;
};
export const getAllUsers = () => users;
