import { Message } from "@/features/chat/interface/message.interface";
import { Chat } from "@/features/chat/interface/chat.interface";

const DB_NAME = "falacomigo-chat";
const DB_VERSION = 1;
const MESSAGES_STORE = "messages";
const CHATS_STORE = "chats";
const SYNC_STORE = "sync";

interface SyncRecord {
  key: string;
  lastSyncDate: string;
}

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(MESSAGES_STORE)) {
          const messagesStore = db.createObjectStore(MESSAGES_STORE, {
            keyPath: "id",
          });
          messagesStore.createIndex("chatId", "chatId", { unique: false });
          messagesStore.createIndex("createdAt", "createdAt", {
            unique: false,
          });
          messagesStore.createIndex("chatId_createdAt", ["chatId", "createdAt"], {
            unique: false,
          });
        }

        if (!db.objectStoreNames.contains(CHATS_STORE)) {
          db.createObjectStore(CHATS_STORE, { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains(SYNC_STORE)) {
          db.createObjectStore(SYNC_STORE, { keyPath: "key" });
        }
      };
    });
  }

  async saveMessage(message: Message): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([MESSAGES_STORE], "readwrite");
      const store = transaction.objectStore(MESSAGES_STORE);
      const request = store.put(message);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async saveMessages(messages: Message[]): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([MESSAGES_STORE], "readwrite");
      const store = transaction.objectStore(MESSAGES_STORE);

      let completed = 0;
      let hasError = false;

      messages.forEach((message) => {
        const request = store.put(message);
        request.onsuccess = () => {
          completed++;
          if (completed === messages.length && !hasError) {
            resolve();
          }
        };
        request.onerror = () => {
          if (!hasError) {
            hasError = true;
            reject(request.error);
          }
        };
      });

      if (messages.length === 0) {
        resolve();
      }
    });
  }

  async deleteMessage(messageId: string): Promise<void> {
    if (!messageId) return;

    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([MESSAGES_STORE], "readwrite");
      const store = transaction.objectStore(MESSAGES_STORE);
      const request = store.delete(messageId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getMessagesByChatId(chatId: string): Promise<Message[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([MESSAGES_STORE], "readonly");
      const store = transaction.objectStore(MESSAGES_STORE);
      const index = store.index("chatId");
      const request = index.getAll(chatId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllMessages(): Promise<Message[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([MESSAGES_STORE], "readonly");
      const store = transaction.objectStore(MESSAGES_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveChat(chat: Chat): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CHATS_STORE], "readwrite");
      const store = transaction.objectStore(CHATS_STORE);
      const request = store.put(chat);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async saveChats(chats: Chat[]): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CHATS_STORE], "readwrite");
      const store = transaction.objectStore(CHATS_STORE);

      let completed = 0;
      let hasError = false;

      chats.forEach((chat) => {
        const request = store.put(chat);
        request.onsuccess = () => {
          completed++;
          if (completed === chats.length && !hasError) {
            resolve();
          }
        };
        request.onerror = () => {
          if (!hasError) {
            hasError = true;
            reject(request.error);
          }
        };
      });

      if (chats.length === 0) {
        resolve();
      }
    });
  }

  async getAllChats(): Promise<Chat[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CHATS_STORE], "readonly");
      const store = transaction.objectStore(CHATS_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getLastSyncDate(): Promise<Date | null> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SYNC_STORE], "readonly");
      const store = transaction.objectStore(SYNC_STORE);
      const request = store.get("lastSync");

      request.onsuccess = () => {
        const result = request.result as SyncRecord | undefined;
        resolve(result ? new Date(result.lastSyncDate) : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async setLastSyncDate(date: Date): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SYNC_STORE], "readwrite");
      const store = transaction.objectStore(SYNC_STORE);
      const request = store.put({
        key: "lastSync",
        lastSyncDate: date.toISOString(),
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearAll(): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        [MESSAGES_STORE, CHATS_STORE, SYNC_STORE],
        "readwrite"
      );

      const messagesStore = transaction.objectStore(MESSAGES_STORE);
      const chatsStore = transaction.objectStore(CHATS_STORE);
      const syncStore = transaction.objectStore(SYNC_STORE);

      messagesStore.clear();
      chatsStore.clear();
      syncStore.clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const indexedDBService = new IndexedDBService();
