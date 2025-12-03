import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListeningOption } from './listening-option.entity';
import { CreateListeningOptionDto } from './dto/create-listening-option.dto';
import { ListeningQuestion } from '../listening-question/listening-question.entity';

@Injectable()
export class ListeningOptionsService {
  constructor(
    @InjectRepository(ListeningOption)
    private optionRepo: Repository<ListeningOption>,

    @InjectRepository(ListeningQuestion)
    private questionRepo: Repository<ListeningQuestion>,
  ) {}

  async findAll(questionId?: number) {
    const where: any = {};
    if (questionId) where.question = { questionId };

    return this.optionRepo.find({
      where,
      relations: ['question'],
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ListeningOption> {
    const opt = await this.optionRepo.findOne({
      where: { optionId: id },
      relations: ['question'],
    });
    if (!opt) throw new NotFoundException(`Option ${id} not found`);
    return opt;
  }

  async create(dto: CreateListeningOptionDto): Promise<ListeningOption> {
    const question = await this.questionRepo.findOne({
      where: { questionId: dto.questionId },
    });

    if (!question) throw new NotFoundException('Question not found');

    const opt = this.optionRepo.create({
      label: dto.label,
      text: dto.text,
      isCorrect: dto.isCorrect,
      question,
    });

    return this.optionRepo.save(opt);
  }

  async delete(id: number): Promise<ListeningOption> {
    const opt = await this.findOne(id);
    return this.optionRepo.remove(opt);
  }
}
