import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { User } from '../users/entities/user.entity';
import { SendMessageDto, StartConversationDto } from './dtos/message.dto';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async startConversation(userId: string, startConversationDto: StartConversationDto) {
    const { userId: otherUserId, initialMessage, listingId } = startConversationDto;

    // Verify other user exists
    const otherUser = await this.usersRepository.findOne({ where: { id: otherUserId } });
    if (!otherUser) {
      throw new NotFoundException('User not found');
    }

    // Check if conversation already exists
    let conversation = await this.conversationsRepository.findOne({
      where: [
        { user1Id: userId, user2Id: otherUserId },
        { user1Id: otherUserId, user2Id: userId },
      ],
    });

    if (!conversation) {
      conversation = this.conversationsRepository.create({
        user1Id: userId,
        user2Id: otherUserId,
      });
      conversation = await this.conversationsRepository.save(conversation);
    }

    // Create initial message
    const message = this.messagesRepository.create({
      conversationId: conversation.id,
      senderId: userId,
      recipientId: otherUserId,
      content: initialMessage,
      listingId,
    });

    const savedMessage = await this.messagesRepository.save(message);

    // Update conversation
    conversation.lastMessage = initialMessage;
    conversation.lastMessageAt = new Date();
    await this.conversationsRepository.save(conversation);

    return { conversation, message: savedMessage };
  }

  async sendMessage(userId: string, sendMessageDto: SendMessageDto) {
    const { conversationId, content, listingId } = sendMessageDto;

    // Verify conversation exists and user is participant
    const conversation = await this.conversationsRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    // Determine recipient
    const recipientId = conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;

    // Create message
    const message = this.messagesRepository.create({
      conversationId,
      senderId: userId,
      recipientId,
      content,
      listingId,
    });

    const savedMessage = await this.messagesRepository.save(message);

    // Update conversation
    conversation.lastMessage = content;
    conversation.lastMessageAt = new Date();
    await this.conversationsRepository.save(conversation);

    return savedMessage;
  }

  async getConversations(userId: string, skip: number = 0, take: number = 20) {
    const [conversations, total] = await this.conversationsRepository.findAndCount({
      where: [
        { user1Id: userId },
        { user2Id: userId },
      ],
      skip,
      take,
      relations: ['user1', 'user2'],
      order: { lastMessageAt: 'DESC' },
    });

    return { conversations, total, skip, take };
  }

  async getConversationMessages(conversationId: string, userId: string, skip: number = 0, take: number = 50) {
    // Verify user is participant
    const conversation = await this.conversationsRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation || (conversation.user1Id !== userId && conversation.user2Id !== userId)) {
      throw new ForbiddenException('You do not have access to this conversation');
    }

    const [messages, total] = await this.messagesRepository.findAndCount({
      where: { conversationId },
      skip,
      take,
      relations: ['sender', 'recipient'],
      order: { createdAt: 'DESC' },
    });

    // Mark messages as read
    const unreadMessages = messages.filter((m) => m.recipientId === userId && !m.read);
    for (const message of unreadMessages) {
      message.read = true;
      message.readAt = new Date();
      await this.messagesRepository.save(message);
    }

    return { messages: messages.reverse(), total, skip, take };
  }

  async blockUser(userId: string, blockUserId: string) {
    const conversation = await this.conversationsRepository.findOne({
      where: [
        { user1Id: userId, user2Id: blockUserId },
        { user1Id: blockUserId, user2Id: userId },
      ],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.user1Id === userId) {
      conversation.user1Blocked = true;
    } else {
      conversation.user2Blocked = true;
    }

    return await this.conversationsRepository.save(conversation);
  }
}
