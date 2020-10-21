class TestResourceController {

  index(req, res) {
    res.send("index");
  }

  show(req, res) {
    res.send("detay");
  }

  update(req, res) {
    res.send("update");
  }

  delete(req, res, id) {
    res.send("delete");
  }

  store(req, res, a, b, format) {
    res.send("store");
  }

}


module.exports = new TestResourceController();