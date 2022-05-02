class Coordinate {
  public lat: number;
  public lon: number;

  protected test(): boolean {
    return this.lon > this.lat;
  }

  compute(x: number, y: number): number {
    return x * y + 1;
  }

  constructor(lat: number, lon: number) {
    this.lat = lat;
    this.lon = lon;
  }
}

const coordinate = new Coordinate(0, 1);

console.log(coordinate);

class MapLocation extends Coordinate {
  private _name: string;
  private _test: boolean;

  get name() {
    return this._name;
  }

  set name(str: string) {
    this._name = str;
  }

  override compute(x: number, y: number): number {
    console.log(this._name);
    return x * y + 2;
  }

  constructor(lat: number, lon: number, name: string) {
    super(lat, lon);
    this._name = name;
    this._test = super.test();
  }
}

const loc = new MapLocation(1, 2, 'lol');
loc.name = 'new lol';
console.log(loc.name);

interface ILogService {
  log: (s: string) => void;
}

class Logger implements ILogService {
  public log(s: string) {
    console.log(s);
  }
}

abstract class Base {
  print(s: string): void {
    console.log(s);
  }
  abstract error(s: string): void;
}

class BaseExtended extends Base {
  error(s: string): void {
    console.log(s);
  }
}

new BaseExtended().print('lol');
