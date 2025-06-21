import { dictionaries } from './config';

export function getDictionary(locale) {
  return dictionaries[locale];
}