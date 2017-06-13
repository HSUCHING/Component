export default function() {}
export function a() {}

var b = 'xxx';
export {b}; // 这是ES6的写法，实际上就是{b:b}
setTimeout(() => b = 'ooo', 1000);
export var c = 100;
// export default function() {}
