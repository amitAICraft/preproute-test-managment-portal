import { z } from 'zod';

export const questionOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Option text is required'),
});

export const questionBuilderSchema = z.object({
  questionText: z.string().min(1, 'Question text is required'),
  options: z
    .array(questionOptionSchema)
    .min(1, 'At least 1 option is required')
    .max(4, 'Maximum 4 options allowed'),
  correctOptionId: z.string().min(1, 'Please select the correct option'),
  solutionText: z.string().optional(),
  difficulty: z.string().optional(),
  topic: z.string().optional(),
  subTopic: z.string().optional(),
});

export type QuestionBuilderFormValues = z.infer<typeof questionBuilderSchema>;
