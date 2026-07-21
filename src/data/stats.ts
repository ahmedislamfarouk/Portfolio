/** A single statistic displayed as a metric card */
export interface StatItem {
  /** Numeric or short-text value (e.g. "43", "3rd") */
  value: string;
  /** Descriptive label shown below the value */
  label: string;
  /** Optional suffix appended to the value (e.g. "+") */
  suffix?: string;
  /** Optional prefix prepended to the value (e.g. "$") */
  prefix?: string;
}

/** Achievement-section statistics — awards and honors breakdown */
export const achievementStats: StatItem[] = [
  { value: '17', label: 'Gold Medals' },
  { value: '10', label: 'Silver Medals' },
  { value: '16', label: 'Bronze Medals' },
  { value: '3rd', label: 'Dan Black Belt' },
];
