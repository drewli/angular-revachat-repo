import { Action } from './action';
import { User } from './user';

export class Message {
    messageId?: number;
    messageContent?: string;
    messageSenderId?: number;
    messageChannelId?: number;
    messageTimestamp?: Date;
    action?: Action;
    from?: User;
}
