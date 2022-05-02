interface IHasLength {
  length: number;
}

const log = <T extends IHasLength, K>(obj: T, arr: K[]): K[] => {
  console.log(obj.length);
  console.log(obj);
  return arr;
};

log<string, number>('lol', [1]);

interface IUser {
  name: string;
  age?: number;
  bid: <T>(sum: T) => boolean;
}

const bid = <T>(sum: T): boolean => {
  return true;
};

const user = <IUser>{
  name: 'lol',
  age: 34,
  bid,
};

console.log(user);
