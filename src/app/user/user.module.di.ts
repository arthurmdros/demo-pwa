// user/user.module.di.ts
import { HttpClient } from '@angular/common/http';
import { inject as ngInject } from '@angular/core';
import { container } from 'tsyringe';
import { DbOfflineService } from '../services/offline-db.service';

import {
  USER_ADD_USER_CASE,
  USER_API,
  USER_DELETE_USER_CASE,
  USER_FETCH_USER_CASE,
  USER_GET_USER_BY_ID_USER_CASE,
  USER_GET_USER_CACHED_USER_CASE,
  USER_REMOTE_DATA_SOURCE_IMPL,
  USER_REPOSITORY_IMPL,
  USER_UPDATE_USER_CASE,
  USER_VIEW_MODEL
} from './injection-tokens';

import { UserApi } from './data/remote/api';
import { UserRemoteDataSourceImpl } from './data/remote/remote_data_source_impl';
import { UserRepositoryImpl } from './data/repository-impl';
import { AddUserUseCase } from './domain/usecases/add-user.usecase';
import { DeleteUserUseCase } from './domain/usecases/delete-user.usecase';
import { FetchUsersUseCase } from './domain/usecases/fetch-users.usecase';
import { GetCachedUsersUseCase } from './domain/usecases/get-cached-users.usecase';
import { GetUserByIdUseCase } from './domain/usecases/get-user-by-id.usecase';
import { UpdateUserUseCase } from './domain/usecases/update-user.usecase';
import { UserViewModel } from './ui/user_view_model';

export class UserDI {
  constructor() {}

  setup() {
    // API
    container.register(USER_API, {
      useFactory: () => {
        const http = ngInject(HttpClient);
        const dbOffline = ngInject(DbOfflineService);
        return new UserApi(http, dbOffline);
      },
    });

    // DataSource / Repository
    container.register(USER_REMOTE_DATA_SOURCE_IMPL, { useClass: UserRemoteDataSourceImpl });
    container.register(USER_REPOSITORY_IMPL, { useClass: UserRepositoryImpl });

    // UseCases
    container.register(USER_FETCH_USER_CASE, { useClass: FetchUsersUseCase });
    container.register(USER_ADD_USER_CASE, { useClass: AddUserUseCase });
    container.register(USER_UPDATE_USER_CASE, { useClass: UpdateUserUseCase });
    container.register(USER_DELETE_USER_CASE, { useClass: DeleteUserUseCase });
    container.register(USER_GET_USER_BY_ID_USER_CASE, { useClass: GetUserByIdUseCase });
    container.register(USER_GET_USER_CACHED_USER_CASE, { useClass: GetCachedUsersUseCase });

    // ViewModel
    container.register(USER_VIEW_MODEL, { useClass: UserViewModel });
  }
}
