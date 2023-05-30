"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("movies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tmdb_id: {
        type: Sequelize.INTEGER,
      },
      imdb_id: {
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      overview: {
        type: Sequelize.STRING,
      },
      adult: {
        type: Sequelize.BOOLEAN,
      },
      release_date: {
        type: Sequelize.STRING,
      },
      language: {
        type: Sequelize.STRING,
      },
      runtime: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
      },
      budget: {
        type: Sequelize.INTEGER,
      },
      revenue: {
        type: Sequelize.INTEGER,
      },
      popularity: {
        type: Sequelize.FLOAT,
      },
      vote_average: {
        type: Sequelize.FLOAT,
      },
      vote_count: {
        type: Sequelize.INTEGER,
      },
      genre_1: {
        type: Sequelize.STRING,
      },
      genre_2: {
        type: Sequelize.STRING,
      },
      genre_3: {
        type: Sequelize.STRING,
      },
      genre_4: {
        type: Sequelize.STRING,
      },
      genre_5: {
        type: Sequelize.STRING,
      },
      backdrop_path: {
        type: Sequelize.STRING,
      },
      poster_path: {
        type: Sequelize.STRING,
      },
      video_site: {
        type: Sequelize.STRING,
      },
      video_key: {
        type: Sequelize.STRING,
      },
      video_name: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("movies");
  },
};
