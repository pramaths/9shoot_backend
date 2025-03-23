import { Controller, Get, Post, Body, Param, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { Match } from './entities/match.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { Contest } from 'src/contests/entities/contest.entity';

@ApiTags('matches')
@Controller('matches')
export class MatchesController {
    constructor(private readonly matchesService: MatchesService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new match' })
    @ApiCreatedResponse({ 
        description: 'The match has been successfully created.',
        type: Match
    })
    async create(@Body() createMatchDto: CreateMatchDto): Promise<Match> {
        return this.matchesService.createMatch(createMatchDto);
    }
    
    @Get(':id')
    @ApiOperation({ summary: 'Get a match by ID' })
    @ApiResponse({ 
        status: 200, 
        description: 'Return the match',
        type: Match
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Match not found' 
    })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Match> {
        const match = await this.matchesService.findOne(id);
        if (!match) {
            throw new NotFoundException(`Match with ID ${id} not found`);
        }
        return match;
    }

    @Get('live')
    @ApiOperation({ summary: 'Get all live matches' })
    @ApiResponse({ 
        status: 200, 
        description: 'Return all live matches',
        type: [Match]
    })
    async getAllLiveMatches(): Promise<Match[]> {
        return this.matchesService.getAllLiveMatches();
    }

    @Get()
    @ApiOperation({ summary: 'Get all matches' })
    @ApiResponse({ 
        status: 200, 
        description: 'Return all matches',
        type: [Match]
    })
    async getAllMatches(): Promise<Match[]> {
        return this.matchesService.getAllMatches();
    }

    @Get('event/:id')
    @ApiOperation({ summary: 'Get all matches by event ID' })
    @ApiResponse({ 
        status: 200, 
        description: 'Return all matches by event ID',
        type: [Match]
    })
    async getMatchesByEventId(@Param('id', ParseUUIDPipe) id: string): Promise<Match[]> {
        return this.matchesService.getMatchesByEventId(id);
    }

    @Get(':id/contests')
    @ApiOperation({ summary: 'Get all contests by match ID' })
    @ApiResponse({ 
        status: 200, 
        description: 'Return all contests by match ID',
        type: [Contest]
    })
    async getContestsByMatchId(@Param('id', ParseUUIDPipe) id: string): Promise<Contest[]> {
        return this.matchesService.getContestsByMatchId(id);
    }
    

}
