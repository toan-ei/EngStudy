import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ListeningQuestion } from '../listening-question/listening-question.entity';
import { ListeningOption } from '../listening-option/listening-option.entity';
import { UserListeningResult } from '../listening-result/listening-result.entity';
import { UserListeningAnswer } from './listening-answer.entity';
import { SubmitListeningDto } from './dto/submit-listening.dto';

@Injectable()
export class ListeningSubmitService {
  constructor(
    @InjectRepository(ListeningQuestion)
    private questionRepo: Repository<ListeningQuestion>,

    @InjectRepository(ListeningOption)
    private optionRepo: Repository<ListeningOption>,

    @InjectRepository(UserListeningResult)
    private resultRepo: Repository<UserListeningResult>,

    @InjectRepository(UserListeningAnswer)
    private answerRepo: Repository<UserListeningAnswer>,
  ) {}

  async submit(dto: SubmitListeningDto) {
    const { exerciseId, userId, answers } = dto;

    // 1. Lấy toàn bộ câu hỏi của bài
    const questions = await this.questionRepo.find({
      where: { exercise: { exerciseId }, isDeleted: false },
    });

    if (!questions.length) {
      throw new NotFoundException(`Exercise ${exerciseId} not found`);
    }

    const questionIds = questions.map(q => q.questionId);

    // 2. Lấy đáp án đúng của tất cả câu hỏi
    const options = await this.optionRepo.find({
      where: { question: { questionId: In(questionIds) }, isCorrect: true },
    });

    const correctMap = new Map<number, number>();
    options.forEach(o => {
      correctMap.set(o.question.questionId, o.optionId);
    });

    // 3. Tạo kết quả tổng
    const result = this.resultRepo.create({
      userId,
      exercise: { exerciseId },
      totalScore: 0,
      maxScore: questions.length,
      percent: 0,
    });
    await this.resultRepo.save(result);

    // 4. Tạo entity từng câu trả lời
    let totalScore = 0;
    const answerEntities: UserListeningAnswer[] = [];

    for (const a of answers) {
      const correctOptionId = correctMap.get(a.questionId);
      const isCorrect = a.selectedOptionId === correctOptionId;
      if (isCorrect) totalScore += 1;

      const answerEntity = this.answerRepo.create({
        result,
        question: { questionId: a.questionId },
        selectedOptionId: a.selectedOptionId ?? undefined,
        isCorrect,
      });
      answerEntities.push(answerEntity);
    }

    await this.answerRepo.save(answerEntities);

    // 5. Update kết quả cuối
    result.totalScore = totalScore;
    result.percent = (totalScore / questions.length) * 100;
    await this.resultRepo.save(result);

    return {
      resultId: result.resultId,
      totalScore,
      maxScore: questions.length,
      percent: result.percent,
    };
  }
}
