const express = require("express");
const Action = require("./actions-model");

const router = express.Router();

// [GET] -> get()
router.get("/", async (req, res) => {
  try {
    const action = await Action.get();
    if (!action) {
      res.status(200).json([]);
    } else {
      res.status(200).json(action);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// [GET] -> get()
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const action = await Action.get(id);
    if (!action) {
      res
        .status(404)
        .json({ message: "The action with that ID does not exist" });
    } else {
      res.status(200).json(action);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// [POST] -> insert()
router.post("/", async (req, res) => {
  try {
    const { notes, description, project_id } = req.body;
    if (!notes || !description || !project_id) {
      res.status(400).json({
        message:
          "Please provide notes, a description, or the project_id for the action",
      });
    } else {
      const createdAction = await Action.insert({
        notes,
        description,
        project_id,
      });
      res.status(201).json(createdAction);
    }
  } catch (error) {
    res.status(500).json({
      message: "There was an error while saving the action to the database",
    });
  }
});

// [PUT] -> update()
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, description, completed, project_id } = req.body;
    // console.log(req.body);
    if ((!notes || !description || !completed, !project_id)) {
      res.status(400).json({ message: "missing required fields" });
    } else {
      const updatedAction = await Action.update(id, {
        notes,
        description,
        completed,
        project_id,
      });
      if (!updatedAction) {
        res.status(404).json({ message: `no action with ID ${id} found` });
      } else {
        res.status(200).json(updatedAction);
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "The project information could not be modified" });
  }
});
// [DELETE] -> remove()
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAction = await Action.remove(id);
    if (!deletedAction) {
      res
        .status(404)
        .json({ message: `The action with ID ${id} could not be removed` });
    } else {
      res.json(deletedAction);
    }
  } catch (error) {
    res.status(500).json({ message: "The action could not be removed" });
  }
});

module.exports = router;
