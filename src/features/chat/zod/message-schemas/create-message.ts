import {z} from "zod";

const CreateMessageSchema = z.object({
  userId: z.string(),
  initialMessage: z.string().min(1).max(1000),
});

export { CreateMessageSchema };