export const QUESTION_BUILDER_MESSAGES = {
  BREADCRUMBS: {
    TEST_CREATION: 'Test Creation',
    CREATE_TEST: 'Create Test',
    CHAPTER_WISE: 'Chapter Wise',
  },
  TITLE: 'Question creation',
  TOTAL_QUESTIONS: 'Total Questions',
  PUBLISH: 'Publish',
  CHAPTER_WISE: 'Chapter Wise',
  EASY: 'Easy',
  SUBJECT: 'Subject',
  TOPIC: 'Topic',
  SUB_TOPIC: 'Sub Topic',
  DELETE_ALL_EDITS: 'Delete All Edits',
  OPTIONS_HEADING: 'Type the options below',
  ADD_SOLUTION: 'Add Solution',
  QUESTION_SETTINGS: 'Question settings',
  LEVEL_OF_DIFFICULTY: 'Level of Difficulty',
  EXIT_TEST_CREATION: 'Exit Test Creation',
  NEXT: 'Next',
  PLACEHOLDERS: {
    EDITOR: 'Type here',
    OPTION: 'Type Option here',
    DROPDOWN: 'Select from Drop-down',
  },
} as const;

export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
] as const;

// Mock options for the other dropdowns
export const TOPIC_OPTIONS = [
  { value: 'grammar', label: 'Grammar' },
  { value: 'writing', label: 'Writing' },
] as const;

export const SUB_TOPIC_OPTIONS = [
  { value: 'application', label: 'Application' },
  { value: 'essay', label: 'Essay' },
] as const;
