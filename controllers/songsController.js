const express = require("express");
const songs = express.Router();
const {
  getAllSongs,
  getSong,
  createSong, // Updated function name
  deleteSong,
  updateSong,
} = require("../queries/songs");
const { checkName, checkBoolean, checkArtist } = require("../validations/checkSongs.js");

// INDEX
songs.get("/", async (req, res) => {
  const allsongs = await getAllSongs();
  if (allsongs.length > 0) {
    res.status(200).json(allsongs);
  } else {
    res.status(500).json({ error: "server error" });
  }
});

// SHOW
songs.get("/:id", async (req, res) => {
  const id = req.params.id;
  const Song = await getSong(id);
  if (Song) {
    res.json(Song);
  } else {
    res.status(404).json({ error: "not found" });
  }
});

// CREATE
songs.post("/", checkName, checkBoolean, checkArtist, async (req, res) => {
  try {
    const newSong = await createSong(req.body);
    res.json(newSong);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// DELETE
songs.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedSong = await deleteSong(id);
  if (deletedSong.id) {
    res.status(200).json(deletedSong);
  } else {
    res.status(404).json("Song not found");
  }
});

// UPDATE
songs.put("/:id", checkName, checkBoolean, checkArtist, async (req, res) => {
  const { id } = req.params;
  const updatedSong = await updateSong(id, req.body);
  res.status(200).json(updatedSong);
});

module.exports = songs;
