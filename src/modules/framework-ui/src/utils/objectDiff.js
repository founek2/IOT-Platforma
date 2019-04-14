import {compose, both, has, all, equals, apply, values, append, prepend, complement, curry, map, cond, ifElse, reject, useWith, mergeWith, merge, objOf, type} from 'ramda'

const isObject = compose(equals('Object'), type);
const allAreObjects = compose(all(isObject), values);
const hasLeft = has('left');
const hasRight = has('right');
const hasBoth = both(hasLeft, hasRight);
const isEqual = both(hasBoth, compose(apply(equals), values));

const markAdded = compose(append(undefined), values);
const markRemoved = compose(prepend(undefined), values);
const isAddition = both(hasLeft, complement(hasRight));
const isRemoval = both(complement(hasLeft), hasRight);

const objectDiff = curry(_diff);
function _diff(l, r) {
  return compose(
    map(cond([
      [isAddition, markAdded],
      [isRemoval, markRemoved],
      [hasBoth, ifElse(
        allAreObjects,
        compose(apply(objectDiff), values),
        values)
      ]
    ])),
    reject(isEqual),
    useWith(mergeWith(merge), [map(objOf('left')), map(objOf('right'))])
  )(l, r);
}

export default objectDiff;