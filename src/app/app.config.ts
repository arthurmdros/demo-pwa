import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

import { DbOfflineService } from './services/offline-db.service';
import { AddUserUseCase } from './user/application/use-cases/add-user.usecase';
import { DeleteUserUseCase } from './user/application/use-cases/delete-user.usecase';
import { FetchUsersUseCase } from './user/application/use-cases/fetch-users.usecase';
import { GetCachedUsersUseCase } from './user/application/use-cases/get-cached-users.usecase';
import { UpdateUserUseCase } from './user/application/use-cases/update-user.usecase';
import { UserRepositoryImpl } from './user/infrastructure/repositories/user-repository-impl';
import { USER_REPOSITORY } from './user/injection-tokens';

import { UserRepositoryImpl as UserRepositoryImplLocator } from './user-locator/data/repositories/user-repository-impl';
import { DbOfflineService as DbOfflineServiceLocator } from './user-locator/domain/datasources/offline-db.service';
import { USER_REPOSITORY as USER_REPOSITORY_LOCATOR } from './user-locator/injection-tokens';
import { AddUserUseCase as AddUserUseCaseLocator } from './user-locator/ui/services/add-user.usecase';
import { DeleteUserUseCase as DeleteUserUseCaseLocator } from './user-locator/ui/services/delete-user.usecase';
import { FetchUsersUseCase as FetchUsersUseCaseLocator } from './user-locator/ui/services/fetch-users.usecase';
import { GetCachedUsersUseCase as GetCachedUsersUseCaseLocator } from './user-locator/ui/services/get-cached-users.usecase';
import { GetUserByIdUseCase } from './user-locator/ui/services/get-user-by-id.usecase';
import { UpdateUserUseCase as UpdateUserUseCaseLocator } from './user-locator/ui/services/update-user.usecase';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),

    // 🔹 Repositório
    { provide: USER_REPOSITORY, useClass: UserRepositoryImpl },
    DbOfflineService, // necessário pro UserRepositoryImpl

    // 🔹 Use-cases
    FetchUsersUseCase,
    GetCachedUsersUseCase,
    DeleteUserUseCase,
    AddUserUseCase,
    UpdateUserUseCase,

    // 🔹 Repositório - locator
    { provide: USER_REPOSITORY_LOCATOR, useClass: UserRepositoryImplLocator },
    DbOfflineServiceLocator, // necessário pro UserRepositoryImpl

    // 🔹 Use-cases - locator

    AddUserUseCaseLocator,
    DeleteUserUseCaseLocator,
    FetchUsersUseCaseLocator,
    GetCachedUsersUseCaseLocator,
    GetUserByIdUseCase,
    UpdateUserUseCaseLocator,
  ],
};
