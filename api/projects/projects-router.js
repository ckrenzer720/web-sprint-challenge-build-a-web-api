const express = require("express");
const Project = require("./projects-model");
const { validateProjectId, validateProject } = require("./projects-middleware");

const router = express.Router();

// get() -> GET
router.get("/", async (req, res) => {
  try {
    const project = await Project.get();
    if (!project) {
      res.status(200).json([]);
    } else {
      res.status(200).json(project);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// get() -> GET
router.get("/:id", validateProjectId, async (req, res) => {
  res.json(req.project);
});

// insert() -> POST
router.post("/", async (req, res) => {
  try {
    const { name, description, completed } = req.body;
    if (!name) {
      res.status(400).json({
        message: "Please provide a name for the project",
      });
    } else if (!description) {
      res.status(400).json({
        message: "Please provide a description for the project",
      });
    } else {
      const createdProject = await Project.insert({
        name,
        description,
        ...(completed && { completed }),
      });
      res.status(201).json(createdProject);
    }
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      message: "There was an error while saving the project to the database",
    });
  }
});

// update() -> PUT
router.put("/:id", validateProjectId, validateProject, (req, res, next) => {
  const { name, description, completed } = req.body;
  Project.update(req.params.id, { name, description, completed })
    .then((updatedProject) => res.json(updatedProject))
    .catch(next);
});

// remove() -> DELETE
router.delete("/:id", validateProjectId, async (req, res, next) => {
  try {
    await Project.remove(req.params.id);
    res.json(req.project);
  } catch (error) {
    next(error);
  }
});

// getProjectActions() -> GET
router.get("/:id/actions", validateProjectId, async (req, res, next) => {
  try {
    const projectActions = await Project.getProjectActions(req.params.id);
    if (!projectActions) {
      res.json([]);
    } else {
      res.json(projectActions);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
