const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { mapDBToModel } = require('../utils/mapDBToModel');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Song gagal ditambahkan');
    }

    return rows[0].id;
  }

  async getSongs({ title, performer }) {
    const { rows: songs } = await this._pool.query('SELECT id, title, performer FROM songs');

    if (title && performer) {
      const songsByTitlePerformer = songs.filter((song) => song.title.toLowerCase().includes(title.toLowerCase()) && song.performer.toLowerCase().includes(performer.toLowerCase()));

      return songsByTitlePerformer;
    }

    if (title) {
      const songsByTitle = songs.filter((song) => song.title.toLowerCase().includes(title.toLowerCase()));

      return songsByTitle;
    }

    if (performer) {
      const songsByPerformer = songs.filter((song) => song.performer.toLowerCase().includes(performer.toLowerCase()));

      return songsByPerformer;
    }
    return songs;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Songs tidak ditemukan');
    }

    return rows.map(mapDBToModel)[0];
  }

  async editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Gagal menghapus song. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
