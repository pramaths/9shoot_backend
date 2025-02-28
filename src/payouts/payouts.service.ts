import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payout } from './entities/payout.entity';
import { CreatePayoutDto } from './dto/create-payout.dto';
import { UpdatePayoutDto } from './dto/update-payout.dto';

@Injectable()
export class PayoutsService {
  constructor(
    @InjectRepository(Payout)
    private payoutRepository: Repository<Payout>,
  ) {}

  async create(createPayoutDto: CreatePayoutDto): Promise<Payout> {
    const payout = this.payoutRepository.create(createPayoutDto);
    return await this.payoutRepository.save(payout);
  }

  async findAll(): Promise<Payout[]> {
    return await this.payoutRepository.find({
      relations: ['user', 'contest', 'transaction'],
    });
  }

  async findOne(id: string): Promise<Payout> {
    const payout = await this.payoutRepository.findOne({
      where: { id },
      relations: ['user', 'contest', 'transaction'],
    });

    if (!payout) {
      throw new NotFoundException(`Payout with ID ${id} not found`);
    }

    return payout;
  }

  async findByUser(userId: string): Promise<Payout[]> {
    return await this.payoutRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'contest', 'transaction'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByContest(contestId: string): Promise<Payout[]> {
    return await this.payoutRepository.find({
      where: { contest: { id: contestId } },
      relations: ['user', 'contest', 'transaction'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async update(id: string, updatePayoutDto: UpdatePayoutDto): Promise<Payout> {
    const payout = await this.findOne(id);
    Object.assign(payout, updatePayoutDto);
    return await this.payoutRepository.save(payout);
  }

  async remove(id: string): Promise<void> {
    const payout = await this.findOne(id);
    await this.payoutRepository.remove(payout);
  }
}
