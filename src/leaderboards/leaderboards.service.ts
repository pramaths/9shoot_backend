import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leaderboard } from './entities/leaderboard.entity';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';

@Injectable()
export class LeaderboardsService {
  constructor(
    @InjectRepository(Leaderboard)
    private leaderboardRepository: Repository<Leaderboard>,
  ) {}

  async create(
    createLeaderboardDto: CreateLeaderboardDto,
  ): Promise<Leaderboard> {
    const leaderboard = this.leaderboardRepository.create(createLeaderboardDto);
    return await this.leaderboardRepository.save(leaderboard);
  }

  async findAllGroupedByContest(): Promise<{
    [contestId: string]: Leaderboard[];
  }> {
    const leaderboards = await this.leaderboardRepository.find({
      relations: ['user', 'contest'],
      order: {
        contestId: 'ASC',
        rank: 'ASC',
      },
    });

    // Group by contestId
    const groupedByContest: { [contestId: string]: Leaderboard[] } = {};
    leaderboards.forEach((leaderboard) => {
      if (!groupedByContest[leaderboard.contestId]) {
        groupedByContest[leaderboard.contestId] = [];
      }
      groupedByContest[leaderboard.contestId].push(leaderboard);
    });

    return groupedByContest;
  }

  async findOne(id: string): Promise<Leaderboard> {
    const leaderboard = await this.leaderboardRepository.findOne({
      where: { id },
      relations: ['user', 'contest'],
    });

    if (!leaderboard) {
      throw new NotFoundException(`Leaderboard with ID ${id} not found`);
    }

    return leaderboard;
  }

  async findByContest(contestId: string): Promise<Leaderboard[]> {
    const leaderboards = await this.leaderboardRepository.find({
      where: { contestId },
      relations: ['user', 'contest'],
      order: {
        rank: 'ASC',
      },
    });

    if (leaderboards.length === 0) {
      throw new NotFoundException(
        `No leaderboard entries found for contest ID ${contestId}`,
      );
    }

    return leaderboards;
  }

  async findByUser(userId: string): Promise<Leaderboard[]> {
    const leaderboards = await this.leaderboardRepository.find({
      where: { userId },
      relations: ['user', 'contest'],
      order: {
        contestId: 'ASC',
        rank: 'ASC',
      },
    });

    if (leaderboards.length === 0) {
      throw new NotFoundException(
        `No leaderboard entries found for user ID ${userId}`,
      );
    }

    return leaderboards;
  }

  async update(
    id: string,
    updateLeaderboardDto: UpdateLeaderboardDto,
  ): Promise<Leaderboard> {
    const leaderboard = await this.findOne(id);
    Object.assign(leaderboard, updateLeaderboardDto);
    return await this.leaderboardRepository.save(leaderboard);
  }

  async remove(id: string): Promise<void> {
    const leaderboard = await this.findOne(id);
    await this.leaderboardRepository.remove(leaderboard);
  }
}
