class UploadsHandler {
  constructor(uploadService, albumsService, validator) {
    this._uploadService = uploadService;
    this._albumsService = albumsService;
    this._validator = validator;
  }

  async postUploadCoverAlbumHandler(request, h) {
    const { headers } = request.payload.cover.hapi;
    this._validator.validateImageHeaders(headers);

    const { cover } = request.payload;
    const { id: albumId } = request.params;

    const filename = await this._uploadService.writeFile(cover, cover.hapi);

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
