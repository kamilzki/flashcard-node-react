exports.getResMock = function () {
  return {
    statusCode: 500,
    body: null,
    status: function (code) {
      this.statusCode = code;
      return this;
    },
    json: function (data) {
      this.body = data
    }
  };
}