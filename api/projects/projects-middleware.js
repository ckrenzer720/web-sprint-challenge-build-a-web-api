// add middlewares here related to projects
const Project = require("./projects-model");

async function validateProjectId(req, res, next) {
  try {
    const project = await Project.get(req.params.id);
    if (!project) {
      res
        .status(404)
        .json({ message: "The project with that ID does not exist" });
    } else {
      req.project = project;
      next();
    }
  } catch (error) {
    res.status(400).json({ message: "project not found" });
  }
}

function validateProject(req, res, next) {
  const { name, description, completed } = req.body;
  if (
    !name ||
    !name.trim() ||
    !description ||
    !description.trim() ||
    completed === undefined
  ) {
    res.status(400).json({ message: "missing required fields" });
  } else {
    req.name = name.trim();
    req.description = description.trim();
    next();
  }
}

module.exports = {
  validateProjectId,
  validateProject,
};
