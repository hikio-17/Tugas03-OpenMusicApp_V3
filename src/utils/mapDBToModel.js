const mapDBToModel = ({
  id, title, year, genre, performer, duration, album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

const mapAlbumToModel = ({
  id,
  name,
  year,
  cover_url,
}) => ({
  id,
  name,
  year,
  coverUrl: cover_url,
});

module.exports = { mapDBToModel, mapAlbumToModel };
