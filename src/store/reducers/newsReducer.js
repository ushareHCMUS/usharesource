const initState = {
  addStatus: null,
  removeStatus: null,
  updateStatus: null,
  editStatus: null
}

const newsReducer = (state = initState, action) => {
  switch (action.type) {
    case 'ADD_NEWS':
      console.log('Added title:', action.news.title, 'to:', action.groups);
      state.addStatus = "Success";
      console.log(state.addStatus);
      return state;
    case 'ADD_NEWS_ERROR':
      console.log('Error: ', action.err);
      state.addStatus = action.err;
      return state;
    case 'CHANGE_ADD_STATUS':
      state.addStatus = null;
      console.log(state.addStatus);
      return state;
    case 'EDIT_NEWS':
      console.log('Editted title:', action.news.title);
      state.editStatus = "Success";
      console.log(state.editStatus);
      return state;
    case 'EDIT_NEWS_ERROR':
      console.log('Error: ', action.err);
      state.editStatus = action.err;
      return state;
    case 'CHANGE_EDIT_STATUS':
      state.editStatus = null;
      console.log(state.editStatus);
      return state;
    default:
      return state;
  }
};

export default newsReducer;