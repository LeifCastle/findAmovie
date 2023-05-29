"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("movies", {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
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
        type: Sequelize.DATE,
      },
      language: {
        type: Sequelize.TEXT,
      },
      runtime: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.TEXT,
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
        type: Sequelize.TEXT,
      },
      genre_2: {
        type: Sequelize.TEXT,
      },
      genre_3: {
        type: Sequelize.TEXT,
      },
      genre_4: {
        type: Sequelize.TEXT,
      },
      genre_5: {
        type: Sequelize.TEXT,
      },
      backdrop_path: {
        type: Sequelize.TEXT,
      },
      poster_path: {
        type: Sequelize.TEXT,
      },
      video_site: {
        type: Sequelize.TEXT,
      },
      video_key: {
        type: Sequelize.TEXT,
      },
      video_name: {
        type: Sequelize.TEXT,
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
