import { z } from 'zod';
import { TEST_LIMITS } from '../constants/test.constants';

//Zod schema for the Create Test form.

const preprocessNumber = (val: unknown) => {
  if (val === '' || val === null || val === undefined || (typeof val === 'number' && isNaN(val))) {
    return undefined;
  }
  return Number(val);
};

export const createTestSchema = z.object({
  testType: z.enum(['chapterwise', 'pyq', 'mock-test'], {
    error: 'Please select a test type',
  }),

  subject: z.string().min(1, 'Subject is required'),

  title: z.string().min(1, 'Name of Test is required'),

  topics: z.array(z.string()).min(1, 'At least one topic is required'),

  subTopics: z.array(z.string()).optional(),

  duration: z.preprocess(
    preprocessNumber,
    z
      .number({ required_error: 'Duration is required', invalid_type_error: 'Duration is required' })
      .int('Duration must be a whole number')
      .min(TEST_LIMITS.MIN_DURATION, `Minimum duration is ${TEST_LIMITS.MIN_DURATION} minute(s)`)
      .max(TEST_LIMITS.MAX_DURATION, `Maximum duration is ${TEST_LIMITS.MAX_DURATION} minutes`),
  ),

  difficultyLevel: z.enum(['easy', 'medium', 'difficult'], {
    error: 'Please select a difficulty level',
  }),

  markingScheme: z.object({
    wrongAnswer: z.preprocess(
      preprocessNumber,
      z.number({ required_error: 'Wrong answer marks are required', invalid_type_error: 'Wrong answer marks are required' }),
    ),
    unattempted: z.preprocess(
      preprocessNumber,
      z.number({ required_error: 'Unattempted marks are required', invalid_type_error: 'Unattempted marks are required' }),
    ),
    correctAnswer: z.preprocess(
      preprocessNumber,
      z
        .number({ required_error: 'Correct answer marks are required', invalid_type_error: 'Correct answer marks are required' })
        .positive('Correct answer marks must be positive'),
    ),
  }),

  totalQuestions: z.preprocess(
    preprocessNumber,
    z
      .number({ required_error: 'Number of questions is required', invalid_type_error: 'Number of questions is required' })
      .int('Must be a whole number')
      .min(TEST_LIMITS.MIN_QUESTIONS, `Minimum ${TEST_LIMITS.MIN_QUESTIONS} question(s)`)
      .max(TEST_LIMITS.MAX_QUESTIONS, `Maximum ${TEST_LIMITS.MAX_QUESTIONS} questions`),
  ),
});

/** Inferred type for the Create Test form values. */
export type CreateTestFormValues = z.infer<typeof createTestSchema>;
