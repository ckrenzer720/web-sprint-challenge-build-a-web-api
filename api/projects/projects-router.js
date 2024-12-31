const express = require("express");
const Project = require("./projects-model");

const router = express.Router();

// get() -> GET
router.get("/", (req, res) => {
  Project.get(req.query)
    .then((project) => {
      res.status(200).json(project || []);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error.message });
    });
});

// get() -> GET
router.get("/:id", (req, res) => {
  Project.get(req.params.id)
    .then((project) => {
      if (!project) {
        res
          .status(404)
          .json({ message: "The project with that ID does not exist" });
      } else {
        res.status(200).json(project);
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

// insert() -> POST
router.post("/", (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    res.status(400).json({ message: "Required fields are missing" });
  } else {
    Project.insert({ name, description })
      .then(({ id }) => {
        return Project.get(id);
      })
      .then((project) => res.status(201).json(project))
      .catch((error) => {
        console.log(error);
        res.status(500).json({ message: error.message });
      });
  }
});
// update() -> PUT
// remove() -> DELETE
// getProjectActions() -> GET

module.exports = router;
