import distinct from "./lib/distinct";
import group from "./lib/group";
import liveness from "./lib/liveness";
import pair from "./lib/pair";
import skip from "./lib/skip";
import strideTricks from "./lib/strideTricks";
import take from "./lib/take";

export class Operator {
  public static take = take;
  public static skip = skip;
  public static pair = pair;
  public static group = group;
  public static strideTricks = strideTricks;
  public static distinct = distinct;
  public static liveness = liveness;
};

export default Operator;

/*
const { Source, Operator } = require('.')

Source.fromInterval(1_000).operator(Operator.take(5)).connect(console.log)

Source.fromInterval(1_000).operator(Operator.pair()).connect(console.log)

Source.fromInterval(1_000).operator(Operator.group(3)).connect(console.log)

Source.fromInterval(1_000).operator(Operator.skip(3)).connect(console.log)

Source.fromValue([1,2,3,4,5,6,7,8,9,10,11,12,13]).operator(Operator.strideTricks(3, 3)).connect(console.log)

*/