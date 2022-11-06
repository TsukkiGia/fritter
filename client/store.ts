import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    notifications: [],
    searchResults: [],
    username: null, // Username of the logged in user
    userId: null,
    profileFreets: [],
    currentFreetComments: [],
    currentFreetId: null,
    deletedFreets: [],
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setUserId(state, userId) {
      /**
       * Update the stored userId to the specified one.
       * @param username - new userId to set
       */
      state.userId = userId;
    },
    setCurrentFreetId(state, freetId){
      state.currentFreetId = freetId
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    updateNotifications(state, notifications) {
      state.notifications = notifications;
    },
    updateSearchResults(state, searchResults) {
      state.searchResults = searchResults;
    },
    updateProfileFreets(state, profileFreets) {
      state.profileFreets = profileFreets;
    },
    updateDeletedFreets(state, deletedFreets){
      state.deletedFreets = deletedFreets;
    },
    updatCurrentFreetComments(state, currentFreetComments) {
      state.currentFreetComments = currentFreetComments;
    },
    async refreshDeletedFreets(state){
      const url =  '/api/freets/freetBin';
      const res = await fetch(url).then(async r => r.json());
      state.deletedFreets = res;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    async refreshNotifications(state) {
      /**
       * Request the server for the currently available notifications.
       */
      const url = 'api/notifications';
      const res = await fetch(url).then(async r => r.json());
      state.notifications = res;
    },
    async refreshComments(state){
      const url =`/api/freets/${state.currentFreetId}/comments`;
      const res = await fetch(url).then(async r => r.json());
      state.currentFreetComments = res;
    },
    async refreshSearchResults(state, isFreetResult){
      if (isFreetResult){

      } else {
        
      }
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
