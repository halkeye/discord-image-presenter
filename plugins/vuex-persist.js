// ~/plugins/vuex-persist.js
import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    reducer: state => ({ messageApprovals: state.messageApprovals })
  }).plugin(store)
}
