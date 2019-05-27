export const addMember = (member, group) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    var batch = firestore.batch();
    batch.update(firestore.collection('groups').doc(group), {
      members: firestore.FieldValue.arrayUnion(member)
    });
    batch.update(firestore.collection('users').doc(member), {
      groups: firestore.FieldValue.arrayUnion(group)
    })
    batch.commit().then(() => {
      dispatch({ type: 'ADD_MEMBER', member: member, group: group });
    }).catch((err) => {
      dispatch({ type: 'ADD_MEMBER_ERROR', err });
    })
  }
}

export const removeMember = (member, group) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    var batch = firestore.batch();
    batch.update(firestore.collection('groups').doc(group), {
      members: firestore.FieldValue.arrayRemove(member)
    });
    batch.update(firestore.collection('users').doc(member), {
      groups: firestore.FieldValue.arrayRemove(group)
    })
    batch.commit().then(() => {
      dispatch({ type: 'REMOVE_MEMBER', member: member, group: group });
    }).catch((err) => {
      dispatch({ type: 'REMOVE_MEMBER_ERROR', err });
    })
  }
}

export const changeRemoveStatus = () => {
  return (dispatch) => {
    dispatch({type:'CHANGE_REMOVE_STATUS'});
  }
}

export const changeAddStatus = () => {
  return (dispatch) => {
    dispatch({type:'CHANGE_ADD_STATUS'});
  }
}