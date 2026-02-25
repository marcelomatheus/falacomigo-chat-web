# Quick Start Guide – Fala Comigo

## Testing the Application

### Option 1: Demo with Mocked Data (Recommended for UI Evaluation)

1. **Start the development server:**
   ```bash
   cd falacomigo-chat-web
   npm run dev
   ```

2. **Access the demo page:**
   ```
   http://localhost:3000/chat-demo
   ```

3. **Explore the features:**
   - Mobile: Use the bottom menu to navigate between Users, Conversations, and Profile
   - Desktop: View users and chat side by side
   - Search users by name
   - Use advanced filters (language, level, etc.)
   - Click on "View profile" to see user details
   - Click on "Start conversation" to begin a chat
   - Type and send messages in the chat

### Option 2: Backend Integration

1. **Start the backend server:**
   ```bash
   cd falacomigo-chat-server
   npm install
   npm run start:dev
   ```

2. **Configure environment variables** (create `.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=
   NEXTAUTH_URL=
   NEXTAUTH_SECRET=
   ```

3. **Start the frontend:**
   ```bash
   cd falacomigo-chat-web
   npm install
   npm run dev
   ```

4. **Access:**
   ```
   http://localhost:3001/chat
   ```

## File Structure Created

### Features
```
src/features/
├── users/
│   ├── api/
│   │   ├── user.api.ts
│   │   └── profile.api.ts
│   ├── hooks/
│   │   ├── useUser.ts
│   │   └── useProfile.ts
│   ├── interface/
│   │   ├── user.interface.ts
│   │   └── profile.interface.ts
│   ├── components/
│   │   ├── user-search-input.tsx
│   │   ├── user-search-filter.tsx
│   │   ├── user-list-item.tsx
│   │   ├── users-list.tsx
│   │   └── user-profile.tsx
│   ├── index.tsx
│   └── index-mock.tsx
│
└── chat/
    ├── api/
    │   ├── chat.api.ts
    │   └── message.api.ts
    ├── hooks/
    │   ├── useChat.ts
    │   └── useMessage.ts
    ├── interface/
    │   ├── chat.interface.ts
    │   └── message.interface.ts
    ├── components/
    │   ├── chat-header.tsx
    │   ├── message-bubble.tsx
    │   ├── chat-messages.tsx
    │   ├── chat-input-box.tsx
    │   └── chat-container.tsx
    ├── index.tsx
    └── index-mock.tsx
```

## Conclusion

The application is ready for UI evaluation and backend integration.
