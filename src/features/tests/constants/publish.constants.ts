export const PUBLISH_TEST_MESSAGES = {
  TITLE: 'Test creation',
  TEST_CREATED: 'Test created',
  ALL_QUESTIONS_DONE: 'All 50 Questions done',
  PUBLISH_NOW: 'Publish Now',
  SCHEDULE_PUBLISH: 'Schedule Publish',
  LIVE_UNTIL: 'Live Until',
  LIVE_UNTIL_DESC: 'Choose how long this test should remain available on the platform.',
  CANCEL: 'Cancel',
  CONFIRM: 'Confirm',
  SELECT_DATE_AND_TIME: 'Select Date and Time',
  SELECT_DATE: 'Select Date',
  SELECT_TIME: 'Select Time',
  SELECT_END_DATE: 'Select End Date',
  SELECT_END_TIME: 'Select End Time',
} as const;

export const PUBLISH_DURATIONS = [
  { label: 'Always Available', value: 'always' },
  { label: '1 Week', value: '1_week' },
  { label: '2 Weeks', value: '2_weeks' },
  { label: '3 Weeks', value: '3_weeks' },
  { label: '1 Month', value: '1_month' },
  { label: 'Custom Duration', value: 'custom' },
] as const;
