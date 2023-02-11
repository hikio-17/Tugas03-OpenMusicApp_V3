const PlaylistsService = require('../../services/PlaylistsService');

class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this._playlistService = new PlaylistsService();
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);

    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;
    const { targetEmail } = request.payload;

    const message = {
      userId,
      playlistId,
      targetEmail,
    };

    await this._playlistService.verifyPlaylistAccess(playlistId, userId);
    await this._service.sendMessage('exports:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
