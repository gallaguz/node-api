const Component = (id: number) => {
    console.log('init component');
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (target: Function) => {
        console.log('run component');
        target.prototype.id = id;
    };
};

const Logger = () => {
    console.log('init logger');
    return () => {
        console.log('run logger');
    };
};

const Method = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor
) => {
    console.log(propertyKey);
    const oldVal = propertyDescriptor.value;
    propertyDescriptor.value = (...args: any[]) => {
        return args[0] * 10;
    };
};

// eslint-disable-next-line @typescript-eslint/ban-types
const Prop = (target: Object, propertyKey: String) => {
    let val: number;

    const getter = () => {
        console.log('Get!');
        return val;
    };

    const setter = (newVal: number) => {
        console.log('Set!');
        val = newVal;
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Object.defineProperty(target, propertyKey, {
        get: getter,
        set: setter,
    });
};

// eslint-disable-next-line @typescript-eslint/ban-types
const Param = (target: Object, propertyKey: string, index: number) => {
    console.log(propertyKey, index);
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
@Logger()
@Component(11)
export class User {
    @Prop id: number;

    @Method
    updateId(@Param newId: number) {
        this.id = newId;
        return this.id;
    }
}

console.log(new User().id);
console.log(new User().updateId(2));
