const insert = (info, table) => {
  let keys = '';
  let values = '';
  for (let key in info) {
    keys += `${key},`;
    if (typeof info[key] === 'number') {
      values += `${info[key]},`;
    } else if (typeof info[key] === 'string') {
      values += `'${info[key]}',`;
    } else {
      return null;
    }
  }
  values = values.substr(0, values.length - 1);
  keys = keys.substr(0, keys.length - 1);
  return `INSERT INTO ${table} ( ${keys} ) VALUES ( ${values} );`;
};

const findOne = (info, table) => {
  let keys = 'username, nickname, email';
  let values = `username='${info.username}' OR nickname='${info.nickname}' OR email='${info.email}';`;
  console.log(`SELECT ${keys} FROM ${table} WHERE ${values};`);
  return `SELECT ${keys} FROM ${table} WHERE ${values};`;
};

module.exports = {
  insert,
  findOne,
};
