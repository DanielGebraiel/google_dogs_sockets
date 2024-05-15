// crdt.js

class CRDT {
  constructor() {
    this.chars = [];
  }

  insert(char, uniqueId, fractionalId, isBold = false, isItalic = false) {
    const index = this.findIndex(fractionalId);
    this.chars.splice(index, 0, {
      char,
      uniqueId,
      fractionalId,
      isBold,
      isItalic,
    });
  }

  delete(uniqueId, fractionalId) {
    const index = this.findIndex(fractionalId);
    if (index >= 0 && this.chars[index].uniqueId === uniqueId) {
      this.chars.splice(index, 1);
    }
  }

  bold(uniqueId) {
    const index = this.chars.findIndex((char) => char.uniqueId === uniqueId);
    if (index !== -1) {
      this.chars[index].isBold = true;
    }
  }

  unbold(uniqueId) {
    const index = this.chars.findIndex((char) => char.uniqueId === uniqueId);
    if (index !== -1) {
      this.chars[index].isBold = false;
    }
  }

  italic(uniqueId) {
    const index = this.chars.findIndex((char) => char.uniqueId === uniqueId);
    if (index !== -1) {
      this.chars[index].isItalic = true;
    }
  }

  unitalic(uniqueId) {
    const index = this.chars.findIndex((char) => char.uniqueId === uniqueId);
    if (index !== -1) {
      this.chars[index].isItalic = false;
    }
  }

  findIndex(fractionalId) {
    let low = 0;
    let high = this.chars.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (this.chars[mid].fractionalId === fractionalId) return mid;
      else if (this.chars[mid].fractionalId < fractionalId) low = mid + 1;
      else high = mid - 1;
    }
    return low;
  }
}

module.exports = CRDT;
