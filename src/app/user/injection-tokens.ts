import { InjectionToken } from 'tsyringe';
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


export const USER_API: InjectionToken<UserApi> = 'USER_API';
export const USER_REMOTE_DATA_SOURCE_IMPL: InjectionToken<UserRemoteDataSourceImpl> = 'USER_REMOTE_DATA_SOURCE_IMPL';
export const USER_REPOSITORY_IMPL: InjectionToken<UserRepositoryImpl> = 'USER_REPOSITORY_IMPL';

export const USER_VIEW_MODEL: InjectionToken<UserViewModel> = 'USER_VIEW_MODEL';

export const USER_FETCH_USER_CASE: InjectionToken<FetchUsersUseCase> = 'USER_FETCH_USER_CASE';
export const USER_ADD_USER_CASE: InjectionToken<AddUserUseCase> = 'USER_ADD_USER_CASE';
export const USER_UPDATE_USER_CASE: InjectionToken<UpdateUserUseCase> = 'USER_UPDATE_USER_CASE';
export const USER_DELETE_USER_CASE: InjectionToken<DeleteUserUseCase> = 'USER_DELETE_USER_CASE';
export const USER_GET_USER_BY_ID_USER_CASE: InjectionToken<GetUserByIdUseCase> = 'USER_GET_USER_BY_ID_USER_CASE';
export const USER_GET_USER_CACHED_USER_CASE: InjectionToken<GetCachedUsersUseCase> = 'USER_GET_USER_CACHED_USER_CASE';
