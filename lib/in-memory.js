function DB() {
  const self = this;

  let NEXT_ID = 0;
  function getNextId() { return ''+(NEXT_ID++); }

  self.items = [];

  self.type = () => {
    return 'In Memory';
  }

  self.init = () => {
    return Promise.resolve();
  }

  self.count = () => {
    return Promise.resolve(self.items.length);
  }

  self.search = () => {
    return Promise.resolve(self.items);
  }

  self.create = (item) => {
    console.log('Create with', item);
    const newItem = JSON.parse(JSON.stringify(item));
    newItem.id = getNextId();
    self.items.push(newItem);
    return Promise.resolve(newItem);
  }

  self.read = (id) => {
    let result = self.items.filter(item => item.id === id)[0] || null;
    return Promise.resolve(result);
  }

  self.update = (id, newValue) => {
    console.log('update', id, newValue, self.items);
    let itemIndex = self.items.findIndex(item => (item.id === id));
    console.log('index is', itemIndex);
    if (itemIndex === -1) {
      return Promise.reject('not found');
    } else {
      const newArrayValue = JSON.parse(JSON.stringify(newValue));
      newArrayValue.id = id;
      self.items[itemIndex] = newArrayValue;
      return Promise.resolve(newArrayValue);
    }
  }

  self.delete = (id) => {
    console.log('delete', id);
    let itemToDelete = self.items.find(item => item.id === id);
    if (itemToDelete) {
      self.items = self.items.filter(item => item !== itemToDelete);
      return Promise.resolve(itemToDelete);
    } else {
      return Promise.reject('not found');
    }
  }
}

module.exports = function() {
  return new DB();
}
