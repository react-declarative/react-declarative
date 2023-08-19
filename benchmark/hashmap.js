const obj = {
    [Symbol.for("foo1")]: () => 1,
    [Symbol.for("foo2")]: () => 2,
    [Symbol.for("foo3")]: () => 3,
    [Symbol.for("foo4")]: () => 4,
    [Symbol.for("foo5")]: () => 5,
    [Symbol.for("foo6")]: () => 6,
    [Symbol.for("foo7")]: () => 7,
    [Symbol.for("foo8")]: () => 8,
    [Symbol.for("foo9")]: () => 9,
    [Symbol.for("foo10")]: () => 10,
    [Symbol.for("foo11")]: () => 11,
    [Symbol.for("foo12")]: () => 12,
    [Symbol.for("foo13")]: () => 13,
    [Symbol.for("foo14")]: () => 14,
    [Symbol.for("foo15")]: () => 15,
    [Symbol.for("foo16")]: () => 16,
    [Symbol.for("foo17")]: () => 17,
    [Symbol.for("foo18")]: () => 18,
    [Symbol.for("foo19")]: () => 19,
    [Symbol.for("foo20")]: () => 20,
    [Symbol.for("foo21")]: () => 21,
};

const obj1 = Object.create(null)
Object.assign(obj1, obj);

const map = new Map(Object.entries(obj))

const keys = Object.keys(obj);

for (let i = 0; i !== 1000; i++) {
    console.time('Map')
    keys.forEach((k) => map.get(k)())
    console.timeEnd('Map')
    
    console.time('Obj')
    keys.forEach((k) => obj[k]())
    console.timeEnd('Obj')

    console.time('Obj1')
    keys.forEach((k) => obj1[k]())
    console.timeEnd('Obj1')
}
