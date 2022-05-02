type Coord = {
  lat: number;
  lon: number;
};

type P = keyof Coord;

const a: P = 'lon';
console.log(a);

const b = 'Hi';

if (typeof a === 'string') {
  console.log('ok');
}

const c: typeof b = 'Hi';
console.log(c);

const log = (a: string | null): string | undefined => {
  return a?.toLowerCase();
};

console.log(log('LLOOLL'));

const s1 = Symbol('lol');
const s2 = Symbol('lol');

console.log(typeof s1, typeof s2);
