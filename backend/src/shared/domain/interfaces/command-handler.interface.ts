import { Command } from './command.interface';

export interface CommandHandler<TCommand extends Command<any, any>> {
  handle(command: TCommand): Promise<any>;
}
