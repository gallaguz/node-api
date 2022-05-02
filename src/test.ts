const a = 5;
const b = '6';

const c: number = a + Number(b);

const names: string[] = ['name1', 'name2'];
const ages: number[] = [1, 5];

const tuple: [number, string] = [87, 'ghj'];
// tuple: 2 element array

const greet = (name: string): string => `Name: ${name}`;
names.map((x: string) => x);

type coord = { lat: number; long?: number };

interface ICord {
  lat: number;
  lon: number;
}

const coordinate = (obj: ICord) => {
  Object.entries(obj).map((x) => console.log(x));
};

coordinate({ lat: 123, lon: 456 });

type Animal = {
  name: string;
};

type Dog = Animal & {
  // & объединение типов
  tail?: boolean;
};

interface Cat extends Animal {
  paws: number;
}

const dog: Dog = {
  name: 'Sharik',
};

const cat: Cat = {
  name: 'Jessica',
  paws: 4,
};

let union: number | string = 5;
union = 'lol';

const fn = (id: number | string) => {
  if (typeof id === 'string') {
    console.log(id.toUpperCase());
  } else {
    console.log(id);
  }
};

const fn2 = (user: string | string[]) => {
  if (Array.isArray(user)) {
    console.log(user.join(', ' + 'Hi!'));
  } else {
    console.log(user + 'hi');
  }
};

const x: 'hi' = 'hi';
type direction = 'left' | 'right';
const move = (d: direction) => {
  //
};

move('left');

const connection = {
  host: 'localhost',
  protocol: 'https' as const,
};

const connect = (host: string, protocol: 'http' | 'https') => {
  //
};

connect(connection.host, connection.protocol);
