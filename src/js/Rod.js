'use strict';

function Rod() {
  this.disks = [];
  this.selected = false;
}

Rod.prototype.size = function() {
  return this.disks.length;
}

Rod.prototype.isSelected = function() {
  return this.selected;
}

Rod.prototype.select = function() {
  this.selected = !this.selected;
}

Rod.prototype.push = function(disk) {
  this.disks.push(disk);
}

Rod.prototype.pop = function() {
  if (this.disks.length > 0) {
    const popped = this.disks.pop();
    return popped;
  }
}

Rod.prototype.last = function() {
  return this.disks[this.disks.length -1];
}

Rod.prototype.isStackable = function(disk) {
  return (this.last() === undefined || disk < this.last());
}

Rod.prototype.populate = function(disk) {
  for (let i = disk - 1; i >= 0; i--) {
    this.disks.push(i);
  }
}
