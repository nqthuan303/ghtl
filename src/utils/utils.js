export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}
export function convertDateTime(dateTime) {
  const objDateTime = new Date(dateTime);
  const month = objDateTime.getMonth();
  const date = objDateTime.getDate();
  const hour = objDateTime.getHours();
  const min = objDateTime.getMinutes();
  const result = `${date}/${month} ${hour}:${min}`;
  return result;
}
