import { bootstrapApplication } from '@angular/platform-browser';
import 'reflect-metadata';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import { container } from 'tsyringe';
import { UserRepository } from './app/user/domain/repositories/user-repository';
import { UserRepositoryImpl } from './app/user/infrastructure/repositories/user-repository-impl';

// Registrando repositórios no container
container.register<UserRepository>('UserRepository', { useClass: UserRepositoryImpl });


bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));

