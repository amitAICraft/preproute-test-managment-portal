import { z } from 'zod';

export const questionOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Option text is required'),
});

export const questionBuilderSchema = z.object({
  questionText: z.string().min(1, 'Question text is required'),
  options: z.array(questionOptionSchema).min(2, 'At least 2 options are required').max(4, 'Maximum 4 options allowed'),
  correctOptionId: z.string().min(1, 'Please select the correct option'),
  solutionText: z.string().optional(),
  difficulty: z.string().min(1, 'Difficulty is required'),
  topic: z.string().min(1, 'Topic is required'),
  subTopic: z.string().min(1, 'Sub-topic is required'),
});

export type QuestionBuilderFormValues = z.infer<typeof questionBuilderSchema>;
