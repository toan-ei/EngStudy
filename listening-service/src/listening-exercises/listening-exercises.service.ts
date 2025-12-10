import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListeningExercise } from './listening-exercises.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ListeningExerciseService {
  constructor(
    @InjectRepository(ListeningExercise)
    private repo: Repository<ListeningExercise>,
  ) {}

  async paginate(page = 1, limit = 10): Promise<{
    items: ListeningExercise[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [items, total] = await this.repo.findAndCount({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<ListeningExercise> {
    const exercise = await this.repo.findOne({ where: { exerciseId: id, isDeleted: false } });
    if (!exercise) throw new NotFoundException(`Exercise ${id} not found`);
    return exercise;
  }

  async create(dto: CreateExerciseDto): Promise<ListeningExercise> {
    const exercise = this.repo.create(dto);
    return this.repo.save(exercise);
  }

  async update(id: number, dto: UpdateExerciseDto): Promise<ListeningExercise> {
    const exercise = await this.findOne(id);
    Object.assign(exercise, dto);
    return this.repo.save(exercise);
  }

  async softDelete(id: number): Promise<ListeningExercise> {
    const exercise = await this.findOne(id);
    exercise.isDeleted = true;
    return this.repo.save(exercise);
  }
}
