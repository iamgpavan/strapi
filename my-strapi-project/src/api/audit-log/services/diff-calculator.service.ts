/**
 * Diff Calculator Service
 * Single Responsibility: Calculates differences between two data objects
 */

import { IDiffCalculator, IDiffResult } from '../interfaces';

export class DiffCalculatorService implements IDiffCalculator {
  private readonly EXCLUDED_FIELDS = ['updatedAt', 'createdAt', 'publishedAt'];

  public calculate(oldData: any, newData: any): IDiffResult {
    if (!oldData || !newData) {
      return {
        changedFields: [],
        beforeData: {},
        afterData: {},
      };
    }

    const changedFields: string[] = [];
    const beforeData: any = {};
    const afterData: any = {};

    const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);

    for (const key of allKeys) {
      if (this.shouldExcludeField(key)) {
        continue;
      }

      const oldValue = oldData[key];
      const newValue = newData[key];

      if (this.hasChanged(oldValue, newValue)) {
        changedFields.push(key);
        beforeData[key] = oldValue;
        afterData[key] = newValue;
      }
    }

    return { changedFields, beforeData, afterData };
  }

  private shouldExcludeField(fieldName: string): boolean {
    return this.EXCLUDED_FIELDS.includes(fieldName);
  }

  private hasChanged(oldValue: any, newValue: any): boolean {
    return JSON.stringify(oldValue) !== JSON.stringify(newValue);
  }
}
