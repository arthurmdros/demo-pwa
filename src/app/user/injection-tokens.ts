import { InjectionToken } from '@angular/core';
import { UserRepository } from './domain/repositories/user-repository';

export const USER_REPOSITORY = new InjectionToken<UserRepository>('UserRepository');
