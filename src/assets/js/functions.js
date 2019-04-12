var objDeepCopy = function(source){
  var sourceCopy = {};
  for (var item in source) sourceCopy[item] = source[item];
  return sourceCopy;
}
export {objDeepCopy};