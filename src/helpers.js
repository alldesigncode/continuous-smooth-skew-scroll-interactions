const select = (elem) => document.querySelector(elem);
const selectAll = (elem) => Array.from(document.querySelectorAll(elem));
const create = (elem) => document.createElement(elem);

const getRandomNumber = (len) => {
  return Math.floor(Math.random() * len);
};

const getRandomNumberRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

class SmoothScrollConfig {
  // ease value to be used in interpolation
  static ease = 0.1;

  // linear interpolation
  static lerp(current, target) {
    const distanceBetween = target - current;

    const distanceToTravel = distanceBetween * this.ease;

    return current + distanceToTravel;
  }

  static getSkew(target, current) {
    const diff = target - current;

    const acceleration = diff / window.innerWidth;

    const velocity = +acceleration;

    return velocity * 7.5;
  }
}

export {
  select,
  selectAll,
  create,
  getRandomNumber,
  getRandomNumberRange,
  SmoothScrollConfig,
};
