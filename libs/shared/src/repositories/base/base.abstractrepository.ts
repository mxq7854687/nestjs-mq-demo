import {
  DeepPartial,
  FindOneOptions,
  FindManyOptions,
  Repository,
} from 'typeorm';
import { BaseInterfaceRepository } from './base.interface.repository';

interface HasId {
  id: number;
}

export abstract class BaseAbstractRepository<T extends HasId>
  implements BaseInterfaceRepository<T>
{
  private entity: Repository<T>;
  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }
  create(data: DeepPartial<T>): T {
    throw new Error('Method not implemented.');
  }
  createMany(data: DeepPartial<T>[]): T[] {
    throw new Error('Method not implemented.');
  }
  async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data);
  }
  async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.entity.save(data);
  }
  async findOneById(id: any): Promise<T> {
    return await this.entity.findOneBy({ id: id });
  }
  async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return this.entity.findOne(filterCondition);
  }
  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.entity.find(options);
  }
  async remove(data: T): Promise<T> {
    return this.entity.remove(data);
  }
  async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return this.entity.find(relations);
  }
  async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.entity.preload(entityLike);
  }
}
