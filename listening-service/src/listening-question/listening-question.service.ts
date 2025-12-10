import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, In } from 'typeorm';
import { ListeningQuestion } from './listening-question.entity';
import { CreateListeningQuestionDto } from './dto/create-question.dto';
import { UpdateListeningQuestionDto } from './dto/update-question.dto';
import { ListeningExercise } from '../listening-exercises/listening-exercises.entity';
import { ExerciseGroupDto } from './dto/create-group.dto';


@Injectable()
export class ListeningQuestionService {
  constructor(
    @InjectRepository(ListeningQuestion)
    private readonly repo: Repository<ListeningQuestion>,
    @InjectRepository(ListeningExercise)
    private readonly exerciseRepo: Repository<ListeningExercise>,
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

  async paginate(exerciseId: number | undefined, page = 1, limit = 10) {
    const where: any = { isDeleted: false };
    if (exerciseId !== undefined) {
      where.exerciseId = exerciseId;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await this.repo.findAndCount({
      where,
      order: { orderIndex: 'ASC', createdAt: 'ASC' },
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

  async get10QuestionsByTopic(topicId: number) {
    // 1. Lấy exercise trong topic
    const exercises = await this.exerciseRepo.find({
      where: { topicId, isDeleted: false },
    });

    if (exercises.length === 0) return [];

    const exerciseIds = exercises.map(e => e.exerciseId);

    // 2. Lấy toàn bộ câu hỏi + kèm file
    const questions = await this.repo.find({
      where: {
        exerciseId: In(exerciseIds),
        isDeleted: false,
      },
      relations: ['exercise', 'file'],   // 👈 thêm quan hệ file
    });

    if (questions.length === 0) return [];

    // 3. Mỗi fileId chỉ 1 câu
    const map = new Map<number, any>();
    for (const q of questions) {
      if (!map.has(q.fileId)) {
        map.set(q.fileId, q);
      }
    }

    let uniqueQuestions = Array.from(map.values());

    // 4. Random câu hỏi
    uniqueQuestions = uniqueQuestions.sort(() => Math.random() - 0.5);

    // 5. Lấy đúng 10 câu
    const selected = uniqueQuestions.slice(0, 10);

    // 6. Gán orderIndex ảo 1 → 10
    return selected.map((q, index) => ({
      questionId: q.questionId,
      exerciseId: q.exerciseId,
      exerciseTitle: q.exercise.title,
      questionText: q.questionText,
      description: q.description || '',
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      fileId: q.fileId,
      score: q.score,
      orderIndex: index + 1,

      // 🔥 Lấy thông tin file từ relation "file"
      audioUrl: q.file?.audioUrl || null,
      imageUrl: q.file?.imageUrl || null,
    }));
  }

  async getGroupedQuestionsByTopic(topicId: number): Promise<ExerciseGroupDto[]> {

    if (topicId !== 3) {
      return []; // hoặc throw new BadRequestException(...)
    }
    const exercises = await this.exerciseRepo.find({
      where: { topicId, isDeleted: false },
      order: { exerciseId: 'ASC' },
      take: 5,
    });

    if (exercises.length === 0) return [];

    const exerciseIds = exercises.map(e => e.exerciseId);

    const questions = await this.repo.find({
      where: {
        exerciseId: In(exerciseIds),
        isDeleted: false,
      },
      relations: ['file'],
    });

    return exercises.map(ex => {
      const questionsForExercise = questions.filter(q => q.exerciseId === ex.exerciseId);
      const sampleFile = questionsForExercise[0]?.file;

      return {
        exerciseId: ex.exerciseId,
        exerciseTitle: ex.title,
        audioUrl: sampleFile?.audioUrl || null,
        imageUrl: sampleFile?.imageUrl || null,
        questions: questionsForExercise.map(q => ({
          questionId: q.questionId,
          questionText: q.questionText,
          description: q.description,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          score: q.score,
        })),
      };
    });
  }
}
