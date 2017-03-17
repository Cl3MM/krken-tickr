import moment from 'moment'

export const isObject = (object) => {
  return Object.prototype.toString.call(object) === '[object Object]'
}

export const isArray = (object) => {
  return Object.prototype.toString.call(object) === '[object Array]'
}

export const stringify = (obj, replacer, indent) => {
  let printedObjects = []
  let printedObjectKeys = []

  const printOnceReplacer = (key, value) => {
    let printedObjIndex = false;
    printedObjects.forEach((obj, index) => {
      if(obj===value){
        printedObjIndex = index;
      }
    });

    if (value && printedObjIndex && typeof(value)=="object") {
      return "(see " + value.constructor.name.toLowerCase() + " with key " + printedObjectKeys[printedObjIndex] + ")";
    } else {
      var qualifiedKey = key || "(empty key)";
      if (value && moment.isMoment(value)) {
        value = moment.utc(value).toISOString()
      }
      printedObjects.push(value);
      printedObjectKeys.push(qualifiedKey);
      if(replacer){
        return replacer(key, value);
      }else{
        return value;
      }
    }
  }
  return JSON.stringify(obj, printOnceReplacer, indent);
}

export const error = (m) => log(m, '!')

export const log = (msg, type) => {
  type = type || '+'
  if (isObject(msg) || isArray(msg)) {
    console.log('[' + type + '] ' + moment.utc().toISOString()+ ' ' + stringify(msg, null, 4))//util.inspect(msg, false, null))
  } else {
    console.log('[' + type + '] ' + moment.utc().toISOString()+ ' ' + msg)
  }
}
