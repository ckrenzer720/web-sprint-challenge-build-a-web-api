// add middlewares here related to actions
const Action = require("./actions-model");

async function validateActionId(req, res, next) {
  try {
    const action = await Action.get(req.params.id);
    if (!action) {
      res
        .status(404)
        .json({ message: "The action with that ID does not exist" });
    } else {
      req.action = action;
      next();
    }
  } catch (error) {
    res.status(400).json({ message: "action not found" });
  }
}

function validateAction(req, res, next) {
  const { notes, description, project_id } = req.body;
  if (
    !notes ||
    !notes.trim() ||
    !description ||
    !description.trim() ||
    project_id
  ) {
    res.status(400).json({ message: "missing required fields" });
  } else {
    req.notes = notes.trim();
    req.description = description.trim();
    next();
  }
}

module.exports = {
  validateActionId,
  validateAction,
};
