import { PartialType } from '@nestjs/mapped-types';
import { CreateListeningQuestionDto } from './create-question.dto';

export class UpdateListeningQuestionDto extends PartialType(CreateListeningQuestionDto) {}
