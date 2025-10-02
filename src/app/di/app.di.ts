import { UserDI } from '../user/user.module.di';
export class InitilizerDI {
  constructor(private userDI: UserDI) {}

  setup() {
    this.userDI.setup();
  }
}
