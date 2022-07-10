/* Utility functions */
const bignum = new Intl.NumberFormat('en-US', { notation: 'compact' });
const smallnum = new Intl.NumberFormat('en-US', {
  notation: 'engineering',
  maximumSignificantDigits: 3,
});

export function prettyprint(n) {
  // Pick a representation for number that is most compact.
  return n > 0.01 ? bignum.format(n) : smallnum.format(n).replace('E', 'e');
}
