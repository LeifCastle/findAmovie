"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.renameColumn("usersSeenMovies", "seenMovieId", "movieId");
  },

  async down(queryInterface, Sequelize) {
    queryInterface.renameColumn("usersSeenMovies", "movieId", "seenMovieId");
  },
};
