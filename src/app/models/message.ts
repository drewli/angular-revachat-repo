import { Action } from './action';
import { User } from './user';

export class Message {
    id?: number;
    content?: string;
    sender?: number;
    channel?: number;
    timestamp?: Date;
    action?: Action;
    from?: User;
}
