import { IsString, IsUUID, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  conversationId: string;

  @IsString()
  content: string;

  @IsUUID()
  @IsOptional()
  listingId?: string;
}

export class StartConversationDto {
  @IsUUID()
  userId: string;

  @IsString()
  initialMessage: string;

  @IsUUID()
  @IsOptional()
  listingId?: string;
}

export class MessageResponseDto {
  id: string;
  content: string;
  read: boolean;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
}

export class ConversationResponseDto {
  id: string;
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  };
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
}
