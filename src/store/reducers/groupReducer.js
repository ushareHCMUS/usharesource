const initState = {
  addStatus: null,
  removeStatus: null
}

const groupReducer = (state = initState, action) => {
  switch (action.type) {
    case 'ADD_MEMBER':
      console.log('added member:', action.member, 'to:', action.group);
      state.addStatus = "Success";
      console.log(state.addStatus);
      return state;
    case 'ADD_MEMBER_ERROR':
      console.log('Error: ', action.err);
      state.addStatus = action.err;
      return state;
    case 'REMOVE_MEMBER':
      console.log('removed:', action.member, 'from:', action.group);
      state.removeStatus = "Success";
      console.log(state.removeStatus);
      return state;
    case 'REMOVE_MEMBER_ERROR':
      console.log('Error: ', action.err);
      state.removeStatus = action.err;
      return state;
    case 'CHANGE_REMOVE_STATUS':
      state.removeStatus = null;
      console.log(state.removeStatus);
      return state;
    case 'CHANGE_ADD_STATUS':
      state.addStatus = null;
      console.log(state.addStatus);
      return state;
    default:
      return state;
  }
};

export default groupReducer;