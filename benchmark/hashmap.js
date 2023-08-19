const obj = {
    foo1: () => 1,
    foo2: () => 2,
    foo3: () => 3,
    foo4: () => 4,
    foo5: () => 5,
    foo6: () => 6,
    foo7: () => 7,
    foo8: () => 8,
    foo9: () => 9,
    foo10: () => 10,
    foo11: () => 11,
    foo12: () => 12,
    foo13: () => 13,
    foo14: () => 14,
    foo15: () => 15,
    foo16: () => 16,
    foo17: () => 17,
    foo18: () => 18,
    foo19: () => 19,
    foo20: () => 20,
    foo21: () => 21,
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
