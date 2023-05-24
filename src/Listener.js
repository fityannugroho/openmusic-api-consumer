class Listener {
  constructor(playlistsService, mailerService) {
    this._playlistsService = playlistsService;
    this._mailerService = mailerService;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());
      const playlist = await this._playlistsService.getPlaylist(playlistId);
      const songs = await this._playlistsService.getSongsInPlaylist(playlistId);
      const content = {
        playlist: {
          ...playlist,
          songs,
        },
      };

      const result = await this._mailerService.sendEmail(targetEmail, {
        subject: 'Export Playlist',
        html: '<p>Terlampir hasil dari ekspor playlist.</p>',
        attachments: [
          {
            filename: 'playlist.json',
            content: JSON.stringify(content),
          },
        ],
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
