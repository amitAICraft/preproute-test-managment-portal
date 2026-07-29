import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TestDetailsCard } from '../TestDetailsCard';
import { EditTestDialog } from '../edit-test/EditTestDialog';
import { Tabs } from '@/components/ui/tabs';
import { usePublishTest } from '../../hooks/usePublishTest';
import { PUBLISH_TEST_MESSAGES, PUBLISH_DURATIONS } from '../../constants/publish.constants';
import type { Test } from '../../types/test.types';
import { cn } from '@/lib/utils';
import { DatePickerField, TimePickerField } from './DateTimePickerField';

const PUBLISH_TABS = [
  { label: PUBLISH_TEST_MESSAGES.PUBLISH_NOW, value: 'publish_now' },
  { label: PUBLISH_TEST_MESSAGES.SCHEDULE_PUBLISH, value: 'schedule_publish' },
] as const;

// Reorder durations so 2 columns map visually:
// Col 1: Always Available (0), 1 Week (1), 2 Weeks (2)
// Col 2: 3 Weeks (3), 1 Month (4), Custom Duration (5)
const GRID_ORDERED_DURATIONS = [
  PUBLISH_DURATIONS[0], // Always Available
  PUBLISH_DURATIONS[3], // 3 Weeks
  PUBLISH_DURATIONS[1], // 1 Week
  PUBLISH_DURATIONS[4], // 1 Month
  PUBLISH_DURATIONS[2], // 2 Weeks
  PUBLISH_DURATIONS[5], // Custom Duration
];

interface PublishSettingsMainProps {
  testId?: string;
  test?: Test;
}

export function PublishSettingsMain({ testId, test }: PublishSettingsMainProps) {
  const { form, onSubmit, onCancel, isLoading } = usePublishTest(testId);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const publishType = watch('publishType');
  const duration = watch('duration');

  return (
    <div className="flex w-full flex-col space-y-6">
      {/* Test Details Card */}
      <TestDetailsCard onEdit={() => setEditDialogOpen(true)} test={test} />
      <EditTestDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} existingTest={test} />

      {/* Form Area */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Publish Type Tabs */}
        <div className="w-fit">
          <Controller
            name="publishType"
            control={control}
            render={({ field }) => (
              <Tabs options={PUBLISH_TABS} value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        {/* Schedule Publish Date & Time Pickers */}
        {publishType === 'schedule_publish' && (
          <div className="space-y-4 pt-2">
            <h2 className="text-base font-semibold text-slate-800">
              {PUBLISH_TEST_MESSAGES.SELECT_DATE_AND_TIME}
            </h2>
            <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Schedule Date — shared DatePickerField */}
              <Controller
                name="scheduleDate"
                control={control}
                render={({ field }) => (
                  <DatePickerField
                    id="scheduleDate"
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder={PUBLISH_TEST_MESSAGES.SELECT_DATE}
                    error={!!errors.scheduleDate}
                    errorMessage={errors.scheduleDate?.message}
                  />
                )}
              />

              {/* Schedule Time — shared TimePickerField */}
              <Controller
                name="scheduleTime"
                control={control}
                render={({ field }) => (
                  <TimePickerField
                    id="scheduleTime"
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder={PUBLISH_TEST_MESSAGES.SELECT_TIME}
                    error={!!errors.scheduleTime}
                    errorMessage={errors.scheduleTime?.message}
                  />
                )}
              />
            </div>
          </div>
        )}

        {/* Live Until Section */}
        <div className="space-y-4 pt-2">
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              {PUBLISH_TEST_MESSAGES.LIVE_UNTIL}
            </h2>
            <p className="mt-1 text-xs text-slate-500">{PUBLISH_TEST_MESSAGES.LIVE_UNTIL_DESC}</p>
          </div>

          {/* Fix 4: Live Until Radio Group with 2-Column Grid Layout matching Figma */}
          <Controller
            name="duration"
            control={control}
            render={({ field }) => (
              <div className="grid w-full max-w-2xl grid-cols-1 gap-x-16 gap-y-5 pt-2 sm:grid-cols-2">
                {GRID_ORDERED_DURATIONS.map((option) => {
                  const isSelected = field.value === option.value;
                  return (
                    <label
                      key={option.value}
                      className="group flex cursor-pointer items-center gap-3 py-0.5"
                    >
                      <div
                        className={cn(
                          'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                          isSelected
                            ? 'border-[#7489FF] bg-white'
                            : 'border-slate-300 group-hover:border-slate-400',
                        )}
                      >
                        {isSelected && <div className="size-2.5 rounded-full bg-[#7489FF]" />}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{option.label}</span>
                      <input
                        type="radio"
                        name={field.name}
                        value={option.value}
                        checked={isSelected}
                        onChange={() => field.onChange(option.value)}
                        className="sr-only"
                      />
                    </label>
                  );
                })}
              </div>
            )}
          />
          {errors.duration?.message && (
            <p className="text-xs text-red-500">{errors.duration.message}</p>
          )}

          {/* Fix 5: Custom Duration Date & Time Pickers */}
          {duration === 'custom' && (
            <div className="grid w-full max-w-2xl grid-cols-1 gap-6 pt-4 sm:grid-cols-2">
              {/* End Date — shared DatePickerField */}
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DatePickerField
                    id="endDate"
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder={PUBLISH_TEST_MESSAGES.SELECT_END_DATE}
                    error={!!errors.endDate}
                    errorMessage={errors.endDate?.message}
                  />
                )}
              />

              {/* End Time — shared TimePickerField */}
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <TimePickerField
                    id="endTime"
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder={PUBLISH_TEST_MESSAGES.SELECT_END_TIME}
                    error={!!errors.endTime}
                    errorMessage={errors.endTime?.message}
                  />
                )}
              />
            </div>
          )}
        </div>

        {/* Fix 6: Footer Buttons */}
        <div className="flex items-center justify-end gap-4 border-t border-slate-100 pt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="h-11 rounded-lg bg-[#F4F6FF] px-8 font-medium text-[#7489FF] hover:bg-[#EBEEFF] hover:text-[#5B73E8]"
          >
            {PUBLISH_TEST_MESSAGES.CANCEL}
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 rounded-lg bg-[#7489FF] px-10 font-medium text-white shadow-xs hover:bg-[#5B73E8]"
          >
            {PUBLISH_TEST_MESSAGES.CONFIRM}
          </Button>
        </div>
      </form>
    </div>
  );
}
