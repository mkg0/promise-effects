module.exports = function createWaiter(ms){
  return new Promise(resolve=> setTimeout(resolve, ms));
}