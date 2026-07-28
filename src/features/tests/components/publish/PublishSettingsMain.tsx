import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestDetailsCard } from '../TestDetailsCard';
import { EditTestDialog } from '../edit-test/EditTestDialog';
import { Tabs } from '@/components/ui/tabs';
import { RadioGroupField } from '@/components/forms/RadioGroupField';
import { TextField } from '@/components/forms/TextField';
import { usePublishTest } from '../../hooks/usePublishTest';
import { PUBLISH_TEST_MESSAGES, PUBLISH_DURATIONS } from '../../constants/publish.constants';
import type { Test } from '../../types/test.types';

const PUBLISH_TABS = [
  { label: PUBLISH_TEST_MESSAGES.PUBLISH_NOW, value: 'publish_now' },
  { label: PUBLISH_TEST_MESSAGES.SCHEDULE_PUBLISH, value: 'schedule_publish' },
] as const;

interface PublishSettingsMainProps {
  testId?: string;
  test?: Test;
}

export function PublishSettingsMain({ testId, test }: PublishSettingsMainProps) {
  const { form, onSubmit, onCancel, isLoading } = usePublishTest(testId);
  const { control, handleSubmit, watch, register, formState: { errors } } = form;
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const publishType = watch('publishType');
  const duration = watch('duration');

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-slate-50/30">
      <div className="mx-auto w-full max-w-4xl p-6 space-y-8">
        
        {/* Test Details Card */}
        <TestDetailsCard onEdit={() => setEditDialogOpen(true)} test={test} />
        <EditTestDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          existingTest={undefined}
        />

        {/* Form Area */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="w-fit">
            <Controller
              name="publishType"
              control={control}
              render={({ field }) => (
                <Tabs
                  options={PUBLISH_TABS}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          {publishType === 'schedule_publish' && (
            <div className="space-y-6 pt-4">
              <h2 className="text-lg font-bold text-slate-800">{PUBLISH_TEST_MESSAGES.SELECT_DATE_AND_TIME}</h2>
              <div className="grid grid-cols-2 gap-6 max-w-2xl pt-2">
                <div className="relative">
                  <TextField
                    label=""
                    placeholder={PUBLISH_TEST_MESSAGES.SELECT_DATE}
                    {...register('scheduleDate')}
                    error={errors.scheduleDate?.message}
                  />
                  <div className="absolute right-3 top-3 text-slate-400 pointer-events-none">
                    <Calendar className="size-5" />
                  </div>
                </div>
                <div className="relative">
                  <TextField
                    label=""
                    placeholder={PUBLISH_TEST_MESSAGES.SELECT_TIME}
                    {...register('scheduleTime')}
                    error={errors.scheduleTime?.message}
                  />
                  <div className="absolute right-3 top-3 text-slate-400 pointer-events-none">
                    <ChevronDown className="size-5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6 pt-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">{PUBLISH_TEST_MESSAGES.LIVE_UNTIL}</h2>
              <p className="mt-1 text-sm text-slate-500">{PUBLISH_TEST_MESSAGES.LIVE_UNTIL_DESC}</p>
            </div>

            <Controller
              name="duration"
              control={control}
              render={({ field }) => (
                <RadioGroupField
                  label=""
                  name={field.name}
                  options={PUBLISH_DURATIONS}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.duration?.message}
                  className="grid grid-cols-2 gap-y-8 max-w-2xl" // Using grid for 2 columns
                />
              )}
            />

            {duration === 'custom' && (
              <div className="grid grid-cols-2 gap-6 max-w-2xl pt-2">
                <div className="relative">
                  <TextField
                    label=""
                    placeholder={PUBLISH_TEST_MESSAGES.SELECT_END_DATE}
                    {...register('endDate')}
                    error={errors.endDate?.message}
                  />
                  <div className="absolute right-3 top-3 text-slate-400 pointer-events-none">
                    <Calendar className="size-5" />
                  </div>
                </div>
                <div className="relative">
                  <TextField
                    label=""
                    placeholder={PUBLISH_TEST_MESSAGES.SELECT_END_TIME}
                    {...register('endTime')}
                    error={errors.endTime?.message}
                  />
                  <div className="absolute right-3 top-3 text-slate-400 pointer-events-none">
                    <ChevronDown className="size-5" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-12">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="px-8 bg-[#f4f6ff] text-blue-600 hover:bg-indigo-50 hover:text-blue-700 font-medium"
            >
              {PUBLISH_TEST_MESSAGES.CANCEL}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-12 bg-blue-500 hover:bg-blue-600 font-medium"
            >
              {PUBLISH_TEST_MESSAGES.CONFIRM}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
