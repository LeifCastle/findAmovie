"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.changeColumn("movies", "imdb_id", {
      type: Sequelize.TEXT,
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.changeColumn("movies", "imdb_id", {
      type: Sequelize.INTEGER,
    });
  },
};
