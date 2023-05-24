const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
  constructor() {
    /**
     * @type {Pool}
     */
    this._pool = new Pool();
  }

  /**
   * Get a playlist.
   * @param {string} playlistId The playlist id.
   * @returns {Promise<object>} The playlist.
   * @throws {NotFoundError} If playlist not found.
   */
  async getPlaylist(playlistId) {
    const result = await this._pool.query({
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Playlist not found');
    }

    return result.rows[0];
  }

  /**
   * Get all songs in a playlist.
   * @param {string} playlistId The id of playlist.
   * @returns {Promise<object[]>} Array of songs.
   */
  async getSongsInPlaylist(playlistId) {
    const result = await this._pool.query({
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
        INNER JOIN playlist_songs ON playlist_songs.song_id = songs.id
        WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    });

    return result.rows;
  }
}

module.exports = PlaylistsService;
