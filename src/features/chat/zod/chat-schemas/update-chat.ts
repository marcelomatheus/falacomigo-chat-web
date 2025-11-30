import {z} from "zod";

const UpdateChatSchema = z.object({
  userId: z.string(),
  initialMessage: z.string().min(1).max(1000),
});

export { UpdateChatSchema };