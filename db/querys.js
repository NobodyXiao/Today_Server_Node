const insert = (info, table) => {
  // infoArr = [{ key: value }]
  // table = String
  console.log('info.keys', Object.keys(info));
  let keys = '';
  let values = '';
  for (let key in info) { 
    keys += `${key},`;
    if (typeof info[key] === 'number') {
      values += `${info[key]},`;
    } else if (typeof info[key] === 'string') {
      values += `'${info[key]}',`;
    } else if (typeof info[key] == 'Date') {
      values += `'${info[key]}',`;
    } else {
      return null;
    }
  }
  values = values.substr(0, values.length - 1);
  keys = keys.substr(0, keys.length - 1);
  return `INSERT INTO ${table} ( ${keys} ) VALUES ( ${values} );`;
}

module.exports = {
  insert
};
