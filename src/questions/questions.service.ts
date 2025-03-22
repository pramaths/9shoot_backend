import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/questions.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { OutcomeType } from '../common/enums/outcome-type.enum';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const question = this.questionRepository.create(createQuestionDto);
    return this.questionRepository.save(question);
  }

  async findAll(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  async findOne(id: string): Promise<Question> {
    return this.questionRepository.findOne({ where: { id } });
  }
  
  async findByContestId(contestId: string): Promise<Question[]> {
    return this.questionRepository.find({ where: { contestId } });
  }

  async getFeaturedByContest(contestId: string): Promise<Question[]> {
    return this.questionRepository.find({ where: { contestId } });
  }

  async setOutcome(questionId: string, outcome: OutcomeType): Promise<Question> {
    const question = await this.findOne(questionId);
    question.outcome = outcome;
    return this.questionRepository.save(question);
  }
}
