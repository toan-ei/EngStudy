import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ListeningQuestion } from '../listening-question/listening-question.entity';
import { UserListeningResult } from '../listening-result/listening-result.entity';
import { UserListeningAnswer } from './listening-answers.entity';
import { SubmitListeningDto } from './dto/submit-listening.dto';

@Injectable()
export class ListeningSubmitService {
  constructor(
    @InjectRepository(ListeningQuestion)
    private questionRepo: Repository<ListeningQuestion>,

    @InjectRepository(UserListeningResult)
    private resultRepo: Repository<UserListeningResult>,

    @InjectRepository(UserListeningAnswer)
    private answerRepo: Repository<UserListeningAnswer>,
  ) {}


  async submit(dto: SubmitListeningDto) {
    const { userId, answers } = dto;

    // 1. Lấy danh sách questionId user đã làm
    const questionIds = answers.map(a => a.questionId);

    // 2. Lấy đúng các câu hỏi đó từ DB
    const questions = await this.questionRepo.find({
      where: {
        questionId: In(questionIds),
        isDeleted: false,
      },
    });

    if (!questions.length) {
      throw new NotFoundException('No questions found for submission');
    }

    // 3. Map đáp án đúng
    const correctMap = new Map<number, 'A' | 'B' | 'C' | 'D'>();
    questions.forEach(q => {
      correctMap.set(q.questionId, q.correctOption);
    });

    // 4. Tạo result (exerciseId giờ chỉ mang tính tham chiếu)
    const result = this.resultRepo.create({
      userId,
      totalScore: 0,
      maxScore: questions.length,
      percent: 0,
    });
    await this.resultRepo.save(result);

    // 5. Chấm điểm
    let totalScore = 0;
    const answerEntities: UserListeningAnswer[] = [];

    for (const a of answers) {
      const correctChar = correctMap.get(a.questionId);
      const isCorrect =
        a.selectedOption != null && a.selectedOption === correctChar;

      if (isCorrect) totalScore += 1;

      answerEntities.push(
        this.answerRepo.create({
          result,
          question: { questionId: a.questionId },
          selectedOption: a.selectedOption ?? null,
          isCorrect,
        }),
      );
    }

    await this.answerRepo.save(answerEntities);

    // 6. Update kết quả
    result.totalScore = totalScore;
    result.percent = (totalScore / questions.length) * 100;
    await this.resultRepo.save(result);

    return {
      resultId: result.resultId,
      totalScore,
      maxScore: questions.length,
      percent: result.percent,
      correctAnswers: Object.fromEntries(correctMap),
    };
  }


}
