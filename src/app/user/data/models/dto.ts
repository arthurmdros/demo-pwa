export interface User {
  id: number;
  name: string;
  email: string;
  _update?: boolean;
  _delete?: boolean;
}
