"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.movie.belongsToMany(models.user, {
        through: "usersSeenMovies",
      });
    }
  }
  movie.init(
    {
      tmdb_id: DataTypes.INTEGER,
      imdb_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      overview: DataTypes.STRING,
      adult: DataTypes.BOOLEAN,
      release_date: DataTypes.STRING,
      language: DataTypes.STRING,
      runtime: DataTypes.INTEGER,
      status: DataTypes.STRING,
      budget: DataTypes.INTEGER,
      revenue: DataTypes.INTEGER,
      popularity: DataTypes.FLOAT,
      vote_average: DataTypes.FLOAT,
      vote_count: DataTypes.INTEGER,
      genre_1: DataTypes.STRING,
      genre_2: DataTypes.STRING,
      genre_3: DataTypes.STRING,
      genre_4: DataTypes.STRING,
      genre_5: DataTypes.STRING,
      backdrop_path: DataTypes.STRING,
      poster_path: DataTypes.STRING,
      video_site: DataTypes.STRING,
      video_key: DataTypes.STRING,
      video_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "movie",
    }
  );
  return movie;
};
