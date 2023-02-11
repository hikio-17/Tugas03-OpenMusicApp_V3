const AlbumsService = require('../../services/AlbumsService');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this._albumsService = new AlbumsService();
  }

  async postUploadCoverAlbumHandler(request, h) {
    const { headers } = request.payload.cover.hapi;
    this._validator.validateImageHeaders(headers);

    const { cover } = request.payload;
    const { id: albumId } = request.params;

    const filename = await this._service.writeFile(cover, cover.hapi);

    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
    console.log(coverUrl);

    await this._albumsService.addCover(albumId, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
