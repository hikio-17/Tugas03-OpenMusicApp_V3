class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);

    const message = {
      userId: request.auth.credentials.id,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage('exports:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan anda sedang diproses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
