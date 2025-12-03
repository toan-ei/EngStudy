import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserListeningResult } from './listening-result.entity';
import { CreateUserListeningResultDto } from './dto/create-user-result.dto';
import { ListeningExercise } from '../listening-exercises/listening-exercises.entity';

@Injectable()
export class UserListeningResultsService {
  constructor(
    @InjectRepository(UserListeningResult)
    private repo: Repository<UserListeningResult>,

    @InjectRepository(ListeningExercise)
    private exerciseRepo: Repository<ListeningExercise>,
  ) {}

  async findAll(): Promise<UserListeningResult[]> {
    return this.repo.find({
      where: { isDeleted: false },
      relations: ['exercise'],
      order: { dateSubmittedAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<UserListeningResult> {
    const result = await this.repo.findOne({
      where: { resultId: id, isDeleted: false },
      relations: ['exercise'],
    });

    if (!result) throw new NotFoundException('Result not found');
    return result;
  }

  async create(dto: CreateUserListeningResultDto): Promise<UserListeningResult> {
    const exercise = await this.exerciseRepo.findOne({
      where: { exerciseId: dto.exerciseId },
    });

    if (!exercise) throw new NotFoundException('Exercise not found');

    const percent = (dto.totalScore / dto.maxScore) * 100;

    const newResult = this.repo.create({
      userId: dto.userId,
      totalScore: dto.totalScore,
      maxScore: dto.maxScore,
      percent,
      exercise,
    });

    return this.repo.save(newResult);
  }

  async softDelete(id: number): Promise<UserListeningResult> {
    const result = await this.findOne(id);
    result.isDeleted = true;
    return this.repo.save(result);
  }
}
