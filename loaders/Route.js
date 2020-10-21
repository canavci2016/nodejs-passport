module.exports = class Route {

  constructor(app) {
    this.app = app;
    this.resource();
  }

  resource() {
    this.app.resource = function (path, object, parameterName = 'id') {
      const parameterString = '/:' + parameterName;
      this.get(path, object.index);
      this.put(path, object.update);
      this.get(path + parameterString, object.show);
      this.delete(path + parameterString, object.delete);
      this.post(path, object.store);
    };
  }
};