import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/constants/routes';
import { useCreateTest } from '../hooks/useCreateTest';
import { 
  TEST_TYPES, 
  DIFFICULTY_LEVELS,
  SUBJECT_OPTIONS,
  TOPIC_OPTIONS,
  SUB_TOPIC_OPTIONS,
  CREATE_TEST_ACTIONS
} from '../constants/test.constants';
import { TextField } from '@/components/forms/TextField';
import { SelectField } from '@/components/forms/SelectField';
import { RadioGroupField } from '@/components/forms/RadioGroupField';
import { Tabs } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/common/LoadingButton';
import { SectionCard } from '@/components/layout/SectionCard';

// Mock options moved to constants

export function CreateTestForm() {
  const navigate = useNavigate();
  
  const { form, onSubmit, isLoading } = useCreateTest({
    onSuccess: () => {
      // Navigate to the next step, e.g., Question Builder
      // navigate(`/tests/${test.id}/questions`);
      navigate(ROUTES.DASHBOARD); // Fallback for now since Question Builder is not implemented
    },
  });

  const { register, control, handleSubmit, formState: { errors } } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      
      {/* Test Type Tabs */}
      <div>
        <Controller
          name="testType"
          control={control}
          render={({ field }) => (
            <Tabs
              options={TEST_TYPES}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.testType && (
          <p className="mt-2 text-sm text-destructive">{errors.testType.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        {/* Subject & Name */}
        <SelectField
          label="Subject"
          options={SUBJECT_OPTIONS}
          placeholder="Choose from Drop-down"
          error={errors.subject?.message}
          {...register('subject')}
        />
        <TextField
          label="Name of Test"
          placeholder="Enter name of Test"
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Topic & Sub Topic */}
        <SelectField
          label="Topic"
          options={TOPIC_OPTIONS}
          placeholder="Choose from Drop-down"
          error={errors.topic?.message}
          {...register('topic')}
        />
        <SelectField
          label="Sub Topic"
          options={SUB_TOPIC_OPTIONS}
          placeholder="Choose from Drop-down"
          error={errors.subTopic?.message}
          {...register('subTopic')}
        />

        {/* Duration & Difficulty */}
        <TextField
          label="Duration (Minutes)"
          placeholder="Enter the time"
          type="number"
          error={errors.duration?.message}
          {...register('duration', { valueAsNumber: true })}
        />
        <Controller
          name="difficultyLevel"
          control={control}
          render={({ field }) => (
            <RadioGroupField
              label="Test Difficulty Level"
              name={field.name}
              options={DIFFICULTY_LEVELS}
              value={field.value}
              onChange={field.onChange}
              error={errors.difficultyLevel?.message}
            />
          )}
        />
      </div>

      {/* Marking Scheme Section */}
      <div className="space-y-4">
        <h3 className="text-base font-medium text-foreground">Marking Scheme:</h3>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-3">
          <TextField
            label="Wrong Answer"
            type="number"
            placeholder="-1"
            error={errors.markingScheme?.wrongAnswer?.message}
            {...register('markingScheme.wrongAnswer', { valueAsNumber: true })}
          />
          <TextField
            label="Unattempted"
            type="number"
            placeholder="+0"
            error={errors.markingScheme?.unattempted?.message}
            {...register('markingScheme.unattempted', { valueAsNumber: true })}
          />
          <TextField
            label="Correct Answer"
            type="number"
            placeholder="+5"
            error={errors.markingScheme?.correctAnswer?.message}
            {...register('markingScheme.correctAnswer', { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Questions & Marks Section */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        <TextField
          label="No of Questions"
          type="number"
          placeholder="Ex:100"
          error={errors.totalQuestions?.message}
          {...register('totalQuestions', { valueAsNumber: true })}
        />
        <TextField
          label="Total Marks"
          type="text"
          placeholder="Ex:250 Marks"
          disabled
          className="bg-slate-50 cursor-not-allowed"
          // In a real app, Total Marks might be calculated automatically (e.g., totalQuestions * correctAnswer)
        />
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="px-8 bg-slate-50 text-blue-600 hover:bg-slate-100 hover:text-blue-700"
        >
          {CREATE_TEST_ACTIONS.CANCEL}
        </Button>
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText={CREATE_TEST_ACTIONS.SAVING}
          className="px-12 bg-blue-500 hover:bg-blue-600"
        >
          {CREATE_TEST_ACTIONS.NEXT}
        </LoadingButton>
      </div>

    </form>
  );
}
