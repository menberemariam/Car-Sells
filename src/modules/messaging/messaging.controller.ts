import { Controller, Post, Get, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { SendMessageDto, StartConversationDto } from './dtos/message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('messaging')
@Controller('messaging')
export class MessagingController {
  constructor(private messagingService: MessagingService) {}

  @Post('conversations/start')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start a new conversation' })
  async startConversation(@Body() startConversationDto: StartConversationDto, @Req() req: any) {
    return this.messagingService.startConversation(req.user.id, startConversationDto);
  }

  @Post('messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send a message' })
  async sendMessage(@Body() sendMessageDto: SendMessageDto, @Req() req: any) {
    return this.messagingService.sendMessage(req.user.id, sendMessageDto);
  }

  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user conversations' })
  async getConversations(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
    @Req() req: any,
  ) {
    return this.messagingService.getConversations(req.user.id, skip, take);
  }

  @Get('conversations/:conversationId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get conversation messages' })
  async getConversationMessages(
    @Param('conversationId') conversationId: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 50,
    @Req() req: any,
  ) {
    return this.messagingService.getConversationMessages(conversationId, req.user.id, skip, take);
  }

  @Post('conversations/:blockUserId/block')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Block a user' })
  async blockUser(@Param('blockUserId') blockUserId: string, @Req() req: any) {
    return this.messagingService.blockUser(req.user.id, blockUserId);
  }
}
