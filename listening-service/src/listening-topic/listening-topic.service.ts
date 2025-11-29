import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListeningTopic } from './listening-topic.entity';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class ListeningTopicService {
  constructor(
    @InjectRepository(ListeningTopic)
    private repo: Repository<ListeningTopic>,
  ) {}

  async findAll() {
    return this.repo.find({ where: { isDeleted: false }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const topic = await this.repo.findOne({ where: { topicId: id, isDeleted: false } });
    if (!topic) throw new NotFoundException(`Topic ${id} not found`);
    return topic;
  }

  async create(dto: CreateTopicDto) {
    const topic = this.repo.create(dto);
    return this.repo.save(topic);
  }

  async update(id: number, dto: UpdateTopicDto) {
    const topic = await this.findOne(id);
    Object.assign(topic, dto);
    return this.repo.save(topic);
  }

  async softDelete(id: number) {
    const topic = await this.findOne(id);
    topic.isDeleted = true;
    return this.repo.save(topic);
  }
}
