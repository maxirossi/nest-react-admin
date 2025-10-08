import { Query } from './query.interface';

export interface QueryHandler<TQuery extends Query<any, any>> {
  handle(query: TQuery): Promise<any>;
}
