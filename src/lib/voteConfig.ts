export const VOTE_RANGES = [
  { key: 'under1.5', label: '1.5배 미만' },
  { key: '1.5to2',   label: '1.5~2배'   },
  { key: '2to3',     label: '2~3배'     },
  { key: '3to5',     label: '3~5배'     },
  { key: 'over5',    label: '5배 이상'  },
] as const;

export type VoteRangeKey = typeof VOTE_RANGES[number]['key'];
export const VALID_VOTE_KEYS = VOTE_RANGES.map(r => r.key);
