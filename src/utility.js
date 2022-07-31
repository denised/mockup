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

// Static class exposes statistical methods
// h/t to https://gist.github.com/Daniel-Hug/7273430

// Note! some of these functions use sort, which modifies arrays in place.
// If that is not acceptable, copy the data first.

export class Stats {

    static median(array) {
        if (!array.length) return null;
        array.sort((a, b)=>a-b);
		const mid = array.length / 2;
		return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
    }

    static quartiles(array) {
        if(array.length < 4) return null;
        array.sort((a,b)=>a-b);
        const a = array;
        const n = a.length;
        const mp = (i) => (array[i] + array[i+1])/2;

        // There are several ways to do quartiles; this one excludes the midpoint from the 25% and 75% measures
        // in the case of an odd number of datapoints.
        if ( n%2 == 0 ) {
            const mi = n/2;
            return [ Stats.median(a.slice(0,mi)), mp(mi), Stats.median(a.slice(mi))];
        }
        else {
            const mi = Math.floor(n/2);
            return [ Stats.median(a.slice(0,mi)), a[mi], Stats.median(a.slice(mi+1))];
        }
    }
}

