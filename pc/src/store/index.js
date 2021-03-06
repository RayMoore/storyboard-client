import Vue from "vue";
import vuex from "vuex";

Vue.use(vuex);

import user from "./modules/user";
import project from "./modules/project";
import team from "./modules/team";
import message from "./modules/message";
import warehouse from "./modules/warehouse";
import app from "./modules/app";

const store = new vuex.Store({
  modules: {
    user,
    project,
    team,
    message,
    warehouse,
    app
  }
});

export default store;
