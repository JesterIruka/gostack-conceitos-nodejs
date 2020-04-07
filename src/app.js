const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

function validateUniqueId(req, res, next) {
  if (isUuid(req.params.id)) {
    return next();
  } else return res.status(400).json({error:'Invalid repository id '+req.params.id, params:req.params});
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = {id:uuid(), title, url, techs, likes:0};

  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", validateUniqueId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = repositories.findIndex(r=>r.id===id);
  if (index < 0) {
    return response.status(404).json({error:'Repository not found'});
  }
  const likes = repositories[index].likes;

  repositories[index] = {id,title,url,techs,likes}

  return response.json(repositories[index]);
});

app.delete("/repositories/:id", validateUniqueId, (req, res) => {
  const { id } = req.params;
  const index = repositories.findIndex(r=>r.id===id);
  if (index < 0) {
    return res.status(404).json({error:'Repository not found'});
  }
  repositories.splice(index, 1);
  return res.status(204).send();
});

app.post("/repositories/:id/like", validateUniqueId, (request, response) => {
  const { id } = request.params;
  
  const repo = repositories.find(r=>r.id===id);
  if (!repo) {
    return request.status(404).json({error:'Repository not found'});
  }
  repo.likes+= 1;

  return response.json({likes:repo.likes});
});

module.exports = app;
