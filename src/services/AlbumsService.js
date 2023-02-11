const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { mapAlbumToModel } = require('../utils/mapDBToModel');
const CacheService = require('./CacheService');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
    this._cacheService = new CacheService();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return rows[0].id;
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const { rowCount, rows: resultAlbum } = await this._pool.query(queryAlbum);

    if (!rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const album = resultAlbum.map(mapAlbumToModel)[0];

    const querySongInAlbum = {
      text: `SELECT songs.id, songs.performer 
      FROM songs
      INNER JOIN albums ON albums.id = songs.album_id
      WHERE albums.id = $1
      `,
      values: [id],
    };

    const { rows: resultSongs } = await this._pool.query(querySongInAlbum);

    const songs = resultSongs;

    const data = {
      ...album,
      songs,
    };

    return data;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Gagal memeperbarui Album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Gagal menghapus Album. Id tidak ditemukan');
    }
  }

  async addCover(id, coverUrl) {
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, id],
    };

    await this._pool.query(query);
  }

  async albumLikes(albumId, userId) {
    const queryCheckAlbum = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };

    const { rowCount } = await this._pool.query(queryCheckAlbum);

    if (!rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const queryCheckUserLike = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const { rowCount: userLike } = await this._pool.query(queryCheckUserLike);

    if (!userLike) {
      const id = `albumLikes-${nanoid(16)}`;
      const queryAddUserLike = {
        text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
        values: [id, userId, albumId],
      };

      await this._pool.query(queryAddUserLike);
      await this._cacheService.delete(albumId);
      return 'Anda menyukai album ini';
    }

    const queryUserUnlike = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    await this._pool.query(queryUserUnlike);
    await this._cacheService.delete(albumId);
    return 'Anda tidak menyukai album ini';
  }

  async getAlbumLikes(albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const { rowCount } = await this._pool.query(query);

    await this._cacheService.set(albumId, JSON.stringify(rowCount));

    return rowCount;
  }
}

module.exports = AlbumsService;
