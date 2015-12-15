module.exports = {
  buffer: '',
  write: function (data) {
    this.buffer += data;
  },
  
  reset: function () {
    this.buffer = '';
  }
}