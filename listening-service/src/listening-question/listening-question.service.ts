import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListeningQuestion } from './listening-question.entity';
import { CreateListeningQuestionDto } from './dto/create-question.dto';
import { UpdateListeningQuestionDto } from './dto/update-question.dto';

@Injectable()
export class ListeningQuestionService {
  constructor(
    @InjectRepository(ListeningQuestion)
    private repo: Repository<ListeningQuestion>,
  ) {}

  async findAll(): Promise<ListeningQuestion[]> {
    return this.repo.find({ where: { isDeleted: false }, order: { orderIndex: 'ASC' } });
  }

  async findOne(id: number): Promise<ListeningQuestion> {
    const question = await this.repo.findOne({ where: { questionId: id, isDeleted: false } });
    if (!question) throw new NotFoundException(`Question ${id} not found`);
    return question;
  }

  async create(dto: CreateListeningQuestionDto): Promise<ListeningQuestion> {
    const question = this.repo.create(dto);
    return this.repo.save(question);
  }

  async update(id: number, dto: UpdateListeningQuestionDto): Promise<ListeningQuestion> {
    const question = await this.findOne(id);
    Object.assign(question, dto);
    return this.repo.save(question);
  }

  async softDelete(id: number): Promise<ListeningQuestion> {
    const question = await this.findOne(id);
    question.isDeleted = true;
    return this.repo.save(question);
  }
}
