import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Image,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
  Smile,
  Video,
} from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide/chat")({
  component: ChatPage,
});

// ============================================================================
// MOCK DATA
// ============================================================================

const mockUsers = {
  me: {
    id: "me",
    name: "You",
    avatar: "",
    initials: "ME",
  },
  sarah: {
    id: "sarah",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    initials: "SC",
    status: "online",
  },
  alex: {
    id: "alex",
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    initials: "AR",
    status: "away",
  },
  jordan: {
    id: "jordan",
    name: "Jordan Kim",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    initials: "JK",
    status: "offline",
  },
  taylor: {
    id: "taylor",
    name: "Taylor Morgan",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    initials: "TM",
    status: "online",
  },
};

const mockMessages = [
  {
    id: "1",
    sender: mockUsers.sarah,
    content: "Hey! Have you seen the latest design updates?",
    timestamp: "10:32 AM",
    status: "read",
  },
  {
    id: "2",
    sender: mockUsers.me,
    content: "Yes! I just reviewed them. The new dashboard looks amazing.",
    timestamp: "10:34 AM",
    status: "read",
  },
  {
    id: "3",
    sender: mockUsers.sarah,
    content:
      "Right? I especially love the data visualization components. The team really outdid themselves this time.",
    timestamp: "10:35 AM",
    status: "read",
    reactions: [{ emoji: "heart", count: 1 }],
  },
  {
    id: "4",
    sender: mockUsers.me,
    content: "Absolutely! Should we schedule a meeting to discuss the implementation timeline?",
    timestamp: "10:37 AM",
    status: "read",
  },
  {
    id: "5",
    sender: mockUsers.sarah,
    content: "Good idea. How about tomorrow at 2 PM?",
    timestamp: "10:38 AM",
    status: "read",
    reactions: [{ emoji: "thumbsup", count: 1 }],
  },
  {
    id: "6",
    sender: mockUsers.me,
    content: "Perfect, I'll send out the calendar invite!",
    timestamp: "10:40 AM",
    status: "delivered",
  },
];

const mockConversations = [
  {
    id: "1",
    user: mockUsers.sarah,
    lastMessage: "Good idea. How about tomorrow at 2 PM?",
    timestamp: "10:38 AM",
    unread: 0,
  },
  {
    id: "2",
    user: mockUsers.alex,
    lastMessage: "The pull request is ready for review",
    timestamp: "9:15 AM",
    unread: 2,
  },
  {
    id: "3",
    user: mockUsers.jordan,
    lastMessage: "Thanks for the help yesterday!",
    timestamp: "Yesterday",
    unread: 0,
  },
  {
    id: "4",
    user: mockUsers.taylor,
    lastMessage: "Let me check the documentation...",
    timestamp: "Yesterday",
    unread: 0,
  },
];

function getConversationStatusColor(status?: string) {
  if (status === "online") return "bg-success";
  if (status === "away") return "bg-warning";
  return "bg-muted-foreground/30";
}

// ============================================================================
// MESSAGE BUBBLES
// ============================================================================

function MessageBubblesExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Bubbles</CardTitle>
        <CardDescription>
          Sent and received message styles with proper alignment and visual distinction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Received Message */}
        <div className="flex items-end gap-2 max-w-[80%]">
          <Avatar className="h-8 w-8">
            <AvatarImage src={mockUsers.sarah.avatar} />
            <AvatarFallback>{mockUsers.sarah.initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="bg-surface-container rounded-2xl rounded-bl-md px-4 py-2.5">
              <p className="text-sm">Hey! How's the project coming along?</p>
            </div>
            <p className="text-xs text-on-surface-variant px-1">10:32 AM</p>
          </div>
        </div>

        {/* Sent Message */}
        <div className="flex items-end gap-2 max-w-[80%] ml-auto flex-row-reverse">
          <div className="space-y-1">
            <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5">
              <p className="text-sm">Going great! Just finishing up the final touches.</p>
            </div>
            <div className="flex items-center justify-end gap-1 px-1">
              <p className="text-xs text-on-surface-variant">10:34 AM</p>
              <CheckCheck className="h-3.5 w-3.5 text-primary" />
            </div>
          </div>
        </div>

        {/* Long Received Message */}
        <div className="flex items-end gap-2 max-w-[80%]">
          <Avatar className="h-8 w-8">
            <AvatarImage src={mockUsers.sarah.avatar} />
            <AvatarFallback>{mockUsers.sarah.initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="bg-surface-container rounded-2xl rounded-bl-md px-4 py-2.5">
              <p className="text-sm">
                That's awesome! I was thinking we could add some animations to make the transitions
                smoother. What do you think about using Framer Motion for the page transitions?
              </p>
            </div>
            <p className="text-xs text-on-surface-variant px-1">10:35 AM</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// CHAT THREAD
// ============================================================================

function ChatThreadExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat Thread</CardTitle>
        <CardDescription>
          Full conversation thread with multiple messages, timestamps, and read receipts
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarImage src={mockUsers.sarah.avatar} />
                <AvatarFallback>{mockUsers.sarah.initials}</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-background" />
            </div>
            <div>
              <p className="text-sm font-medium">{mockUsers.sarah.name}</p>
              <p className="text-xs text-on-surface-variant">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[350px]">
          <div className="p-4 space-y-4">
            {/* Date Divider */}
            <div className="flex items-center gap-4 my-4">
              <Separator className="flex-1" />
              <span className="text-xs text-on-surface-variant">Today</span>
              <Separator className="flex-1" />
            </div>

            {mockMessages.map((message) => {
              const isMe = message.sender.id === "me";
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end gap-2 max-w-[80%]",
                    isMe && "ml-auto flex-row-reverse",
                  )}
                >
                  {!isMe && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.sender.avatar} />
                      <AvatarFallback>{message.sender.initials}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="space-y-1">
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5",
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-surface-container rounded-bl-md",
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className={cn("flex items-center gap-1 px-1", isMe && "justify-end")}>
                      <p className="text-xs text-on-surface-variant">{message.timestamp}</p>
                      {isMe &&
                        (message.status === "read" ? (
                          <CheckCheck className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <Check className="h-3.5 w-3.5 text-on-surface-variant" />
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm">
              <Plus className="h-4 w-4" />
            </Button>
            <Input placeholder="Type a message..." className="flex-1" />
            <Button variant="ghost" size="icon-sm">
              <Smile className="h-4 w-4" />
            </Button>
            <Button size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// TYPING INDICATOR
// ============================================================================

function TypingIndicatorExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Typing Indicator</CardTitle>
        <CardDescription>
          Visual feedback showing when another user is composing a message
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Typing Indicator */}
        <div>
          <h3 className="text-xs text-on-surface-variant mb-3">Animated Dots</h3>
          <div className="flex items-end gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={mockUsers.sarah.avatar} />
              <AvatarFallback>{mockUsers.sarah.initials}</AvatarFallback>
            </Avatar>
            <div className="bg-surface-container rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* With Text Label */}
        <div>
          <h3 className="text-xs text-on-surface-variant mb-3">With Label</h3>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Avatar className="h-6 w-6">
              <AvatarImage src={mockUsers.alex.avatar} />
              <AvatarFallback>{mockUsers.alex.initials}</AvatarFallback>
            </Avatar>
            <span>{mockUsers.alex.name} is typing</span>
            <div className="flex items-center gap-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
            </div>
          </div>
        </div>

        {/* Multiple Users Typing */}
        <div>
          <h3 className="text-xs text-on-surface-variant mb-3">Multiple Users</h3>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <div className="flex -space-x-1">
              <Avatar className="h-5 w-5 border-2 border-background">
                <AvatarImage src={mockUsers.sarah.avatar} />
                <AvatarFallback>{mockUsers.sarah.initials}</AvatarFallback>
              </Avatar>
              <Avatar className="h-5 w-5 border-2 border-background">
                <AvatarImage src={mockUsers.alex.avatar} />
                <AvatarFallback>{mockUsers.alex.initials}</AvatarFallback>
              </Avatar>
            </div>
            <span>Sarah and Alex are typing</span>
            <div className="flex items-center gap-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// READ RECEIPTS
// ============================================================================

function ReadReceiptsExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Read Receipts</CardTitle>
        <CardDescription>Message delivery and read status indicators</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Different States */}
        <div className="space-y-4">
          {/* Sending */}
          <div className="flex items-center gap-3 p-3 rounded-md bg-surface-high">
            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
            <div>
              <p className="text-sm font-medium">Sending</p>
              <p className="text-xs text-on-surface-variant">Message is being sent</p>
            </div>
          </div>

          {/* Sent */}
          <div className="flex items-center gap-3 p-3 rounded-md bg-surface-high">
            <Check className="h-4 w-4 text-on-surface-variant" />
            <div>
              <p className="text-sm font-medium">Sent</p>
              <p className="text-xs text-on-surface-variant">Message reached the server</p>
            </div>
          </div>

          {/* Delivered */}
          <div className="flex items-center gap-3 p-3 rounded-md bg-surface-high">
            <CheckCheck className="h-4 w-4 text-on-surface-variant" />
            <div>
              <p className="text-sm font-medium">Delivered</p>
              <p className="text-xs text-on-surface-variant">Message delivered to recipient</p>
            </div>
          </div>

          {/* Read */}
          <div className="flex items-center gap-3 p-3 rounded-md bg-surface-high">
            <CheckCheck className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Read</p>
              <p className="text-xs text-on-surface-variant">Recipient has seen the message</p>
            </div>
          </div>
        </div>

        {/* In Context */}
        <div>
          <h3 className="text-xs text-on-surface-variant mb-3">In Message Context</h3>
          <div className="space-y-2">
            <div className="flex items-end gap-2 max-w-[60%] ml-auto flex-row-reverse">
              <div className="space-y-1">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5">
                  <p className="text-sm">Just sent this message</p>
                </div>
                <div className="flex items-center justify-end gap-1 px-1">
                  <p className="text-xs text-on-surface-variant">11:42 AM</p>
                  <Check className="h-3.5 w-3.5 text-on-surface-variant" />
                </div>
              </div>
            </div>
            <div className="flex items-end gap-2 max-w-[60%] ml-auto flex-row-reverse">
              <div className="space-y-1">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5">
                  <p className="text-sm">This one was delivered</p>
                </div>
                <div className="flex items-center justify-end gap-1 px-1">
                  <p className="text-xs text-on-surface-variant">11:43 AM</p>
                  <CheckCheck className="h-3.5 w-3.5 text-on-surface-variant" />
                </div>
              </div>
            </div>
            <div className="flex items-end gap-2 max-w-[60%] ml-auto flex-row-reverse">
              <div className="space-y-1">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5">
                  <p className="text-sm">And this one was read!</p>
                </div>
                <div className="flex items-center justify-end gap-1 px-1">
                  <p className="text-xs text-on-surface-variant">11:44 AM</p>
                  <CheckCheck className="h-3.5 w-3.5 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MESSAGE REACTIONS
// ============================================================================

function ReactionsExample() {
  const emojiIcons: Record<string, string> = {
    heart: "&#x2764;&#xFE0F;",
    thumbsup: "&#x1F44D;",
    fire: "&#x1F525;",
    laugh: "&#x1F602;",
    sad: "&#x1F622;",
    wow: "&#x1F62E;",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Reactions</CardTitle>
        <CardDescription>Emoji reactions that users can add to messages</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Single Reaction */}
        <div>
          <h3 className="text-xs text-on-surface-variant mb-3">Single Reaction</h3>
          <div className="flex items-end gap-2 max-w-[70%]">
            <Avatar className="h-8 w-8">
              <AvatarImage src={mockUsers.sarah.avatar} />
              <AvatarFallback>{mockUsers.sarah.initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 relative">
              <div className="bg-surface-container rounded-2xl rounded-bl-md px-4 py-2.5">
                <p className="text-sm">This is such a great idea!</p>
              </div>
              <div className="absolute -bottom-2 left-4 flex items-center gap-0.5">
                <span className="flex items-center gap-1 bg-surface-lowest border-outline-variant/15 rounded-full px-1.5 py-0.5 text-xs shadow-sm">
                  <span dangerouslySetInnerHTML={{ __html: emojiIcons.heart }} />
                  <span className="text-on-surface-variant">1</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Multiple Reactions */}
        <div className="pt-4">
          <h3 className="text-xs text-on-surface-variant mb-3">Multiple Reactions</h3>
          <div className="flex items-end gap-2 max-w-[70%]">
            <Avatar className="h-8 w-8">
              <AvatarImage src={mockUsers.alex.avatar} />
              <AvatarFallback>{mockUsers.alex.initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 relative">
              <div className="bg-surface-container rounded-2xl rounded-bl-md px-4 py-2.5">
                <p className="text-sm">
                  We just shipped the new feature! It's live in production now.
                </p>
              </div>
              <div className="absolute -bottom-2 left-4 flex items-center gap-0.5">
                <span className="flex items-center gap-1 bg-surface-lowest border-outline-variant/15 rounded-full px-1.5 py-0.5 text-xs shadow-sm">
                  <span dangerouslySetInnerHTML={{ __html: emojiIcons.thumbsup }} />
                  <span className="text-on-surface-variant">3</span>
                </span>
                <span className="flex items-center gap-1 bg-surface-lowest border-outline-variant/15 rounded-full px-1.5 py-0.5 text-xs shadow-sm">
                  <span dangerouslySetInnerHTML={{ __html: emojiIcons.fire }} />
                  <span className="text-on-surface-variant">2</span>
                </span>
                <span className="flex items-center gap-1 bg-surface-lowest border-outline-variant/15 rounded-full px-1.5 py-0.5 text-xs shadow-sm">
                  <span dangerouslySetInnerHTML={{ __html: emojiIcons.heart }} />
                  <span className="text-on-surface-variant">1</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reaction Picker */}
        <div className="pt-4">
          <h3 className="text-xs text-on-surface-variant mb-3">Reaction Picker</h3>
          <div className="inline-flex items-center gap-1 bg-surface-high rounded-full p-1.5 shadow-lg">
            {Object.entries(emojiIcons).map(([key, icon]) => (
              <button
                key={key}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-lg"
              >
                <span dangerouslySetInnerHTML={{ __html: icon }} />
              </button>
            ))}
            <Separator orientation="vertical" className="h-6 mx-1" />
            <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
              <Plus className="h-4 w-4 text-on-surface-variant" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MESSAGE INPUT WITH ATTACHMENTS
// ============================================================================

function MessageInputExample() {
  const [message, setMessage] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Input</CardTitle>
        <CardDescription>Rich message composer with attachment and emoji options</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Input */}
        <div>
          <h3 className="text-xs text-on-surface-variant mb-3">Basic Input</h3>
          <div className="flex items-center gap-2 p-2 rounded-md bg-surface-container">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button size="icon" disabled={!message}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* With Attachment Options */}
        <div>
          <h3 className="text-xs text-on-surface-variant mb-3">With Attachments</h3>
          <div className="rounded-md bg-surface-container">
            <div className="flex items-center gap-1 p-2">
              <Button variant="ghost" size="icon-sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm">
                <Image className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm">
                <Smile className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-5 mx-1" />
              <Button variant="ghost" size="icon-sm">
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 p-2">
              <Input
                placeholder="Type a message..."
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Expanded with Attached Files */}
        <div>
          <h3 className="text-xs text-on-surface-variant mb-3">With Attached Files</h3>
          <div className="rounded-md bg-surface-container">
            {/* Attached files preview */}
            <div className="p-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-surface-lowest rounded-md">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                    <Image className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">screenshot.png</p>
                    <p className="text-xs text-on-surface-variant">2.4 MB</p>
                  </div>
                  <Button variant="ghost" size="icon-sm" className="ml-2">
                    <span className="text-xs">&times;</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 p-2">
              <Button variant="ghost" size="icon-sm">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 p-2">
              <Input
                placeholder="Add a caption..."
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// CONVERSATION LIST
// ============================================================================

function ConversationListExample() {
  const [selectedId, setSelectedId] = useState("1");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversation List</CardTitle>
        <CardDescription>
          List of chat conversations with preview and status indicators
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* Search Header */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <Input placeholder="Search conversations..." className="pl-9" />
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="h-[320px]">
          <div className="space-y-2">
            {mockConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedId(conversation.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 text-left transition-colors hover:bg-surface-container",
                  selectedId === conversation.id && "bg-surface-container",
                )}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversation.user.avatar} />
                    <AvatarFallback>{conversation.user.initials}</AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                      getConversationStatusColor(conversation.user.status),
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">{conversation.user.name}</p>
                    <span className="text-xs text-on-surface-variant shrink-0">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-on-surface-variant truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread > 0 && (
                      <Badge
                        variant="default"
                        className="h-5 min-w-5 px-1.5 flex items-center justify-center"
                      >
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface-high/80 backdrop-blur-[20px] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/style-guide"
              className="flex items-center gap-2 text-on-surface-variant hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Style Guide</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight">Chat & Messaging</h1>
              <p className="text-on-surface-variant text-sm">
                Patterns for real-time communication interfaces
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto py-8 px-6 space-y-16">
        <MessageBubblesExample />
        <ChatThreadExample />
        <TypingIndicatorExample />
        <ReadReceiptsExample />
        <ReactionsExample />
        <MessageInputExample />
        <ConversationListExample />

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}
