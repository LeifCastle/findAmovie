"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("movies", "revenue", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.changeColumn("movies", "budget", {
      type: Sequelize.BIGINT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("movies", "revenue", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.changeColumn("movies", "budget", {
      type: Sequelize.INTEGER,
    });
  },
};
