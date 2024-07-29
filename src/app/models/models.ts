export interface IVocabulary {
  index: number;
  id?: string;
  word: string;
  definition: string;
  date?: Date;
  sentences?: string;
  sentencesMobile?: boolean
}
