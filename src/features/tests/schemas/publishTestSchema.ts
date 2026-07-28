import { z } from 'zod';

export const publishTestSchema = z.object({
  publishType: z.enum(['publish_now', 'schedule_publish']),
  duration: z.string().min(1, 'Please select a duration'),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.duration === 'custom') {
    if (!data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date is required for custom duration',
        path: ['endDate'],
      });
    }
    if (!data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End time is required for custom duration',
        path: ['endTime'],
      });
    }
  }
});

export type PublishTestFormValues = z.infer<typeof publishTestSchema>;
