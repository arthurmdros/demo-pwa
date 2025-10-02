import 'reflect-metadata';

import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { InitilizerDI } from './app/di/app.di';
import { UserDI } from './app/user/user.module.di';

const initilizerDI = new InitilizerDI(new UserDI());

initilizerDI.setup();

platformBrowser()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
