const express = require("express");
const Project = require("./projects-model");
const { validateProjectId } = require("./projects-middleware");

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
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.get(id);
    if (!project) {
      res
        .status(404)
        .json({ message: "The project with that ID does not exist" });
    } else {
      res.status(200).json(project);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// insert() -> POST
// how to handle situations where completed is not included
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
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, completed } = req.body;
    // console.log(req.body);
    if (!name || !description || !completed) {
      res.status(400).json({ message: "missing required fields" });
    } else {
      const updatedProject = await Project.update(id, {
        name,
        description,
        completed,
      });
      if (!updatedProject) {
        res.status(404).json({ message: `no project with ID ${id} found` });
      } else {
        res.status(200).json(updatedProject);
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "The project information could not be modified" });
  }
});

// remove() -> DELETE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.remove(id);
    if (!deletedProject) {
      res
        .status(404)
        .json({ message: `The project with ID ${id} could not be removed` });
    } else {
      res.json(deletedProject);
    }
  } catch (error) {
    res.status(500).json({ message: "The project could not be removed" });
  }
});

// getProjectActions() -> GET
router.get("/:id/actions", async (req, res) => {
  try {
    const projectActions = await Project.getProjectActions(req.params.id);
    if (!projectActions) {
      res.json([]);
    } else {
      res.json(projectActions);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "The actions information could not be retrieved" });
  }
});

module.exports = router;
