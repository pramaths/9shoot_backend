import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeaturedVideo } from './entities/featured-video.entity';
import { VideoSubmission } from './entities/video-submission.entity';

@Injectable()
export class FeaturedService {
  constructor(
    @InjectRepository(FeaturedVideo)
    private readonly featuredVideoRepository: Repository<FeaturedVideo>,
    @InjectRepository(VideoSubmission)
    private readonly videoSubmissionRepository: Repository<VideoSubmission>,
  ) {}

  async featureVideo(submissionId: string): Promise<FeaturedVideo> {
    const featuredCount = await this.featuredVideoRepository.count({
      where: { isActive: true },
    });

    if (featuredCount >= 30) {
      throw new Error('Maximum limit of 30 featured videos reached');
    }

    const submission = await this.videoSubmissionRepository.findOne({
      where: { id: submissionId },
    });

    if (!submission) {
      throw new NotFoundException(
        `Video submission with ID ${submissionId} not found`,
      );
    }

    const featuredVideo = this.featuredVideoRepository.create({
      submissionId: submission.id,
      title: submission.title,
      description: submission.description,
      videoUrl: submission.videoUrl,
      thumbnailUrl: submission.thumbnailUrl,
      userId: submission.userId,
    });

    return this.featuredVideoRepository.save(featuredVideo);
  }

  async unfeaturedVideo(id: string): Promise<void> {
    const featuredVideo = await this.featuredVideoRepository.findOne({
      where: { id },
    });

    if (!featuredVideo) {
      throw new NotFoundException(`Featured video with ID ${id} not found`);
    }

    featuredVideo.isActive = false;
    await this.featuredVideoRepository.save(featuredVideo);
  }

  async getAllFeatured(): Promise<FeaturedVideo[]> {
    return this.featuredVideoRepository.find({
      where: { isActive: true },
    });
  }
}
