import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { ListeningQuestion } from './listening-question.entity';
import { CreateListeningQuestionDto } from './dto/create-question.dto';
import { UpdateListeningQuestionDto } from './dto/update-question.dto';

@Injectable()
export class ListeningQuestionService {
  constructor(
    @InjectRepository(ListeningQuestion)
    private readonly repo: Repository<ListeningQuestion>,
  ) {}

  async create(dto: CreateListeningQuestionDto): Promise<ListeningQuestion> {
    // ensure score default
    const entity = this.repo.create({
      ...dto,
      score: dto.score ?? 1,
      orderIndex: dto.orderIndex ?? 0,
      isDeleted: false,
    });
    return this.repo.save(entity);
  }

  async findAll(exerciseId?: number, skip = 0, take = 50): Promise<ListeningQuestion[]> {
    const where: any = { isDeleted: false };
    if (exerciseId !== undefined) where.exerciseId = exerciseId;

    const options: FindManyOptions<ListeningQuestion> = {
      where,
      order: { orderIndex: 'ASC', createdAt: 'ASC' },
      skip,
      take,
    };
    return this.repo.find(options);
  }

  async findOne(id: number): Promise<ListeningQuestion> {
    const q = await this.repo.findOne({ where: { questionId: id, isDeleted: false } });
    if (!q) throw new NotFoundException(`Question ${id} not found`);
    return q;
  }

  async update(id: number, dto: UpdateListeningQuestionDto): Promise<ListeningQuestion> {
    const question = await this.findOne(id);
    Object.assign(question, dto);
    return this.repo.save(question);
  }

  async softDelete(id: number): Promise<void> {
    const q = await this.findOne(id);
    q.isDeleted = true;
    await this.repo.save(q);
  }
}
