export const addNews = (news, groups) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    firestore.collection('news').add({
    }).then((docRef) => {
      var batch = firestore.batch();
      batch.update(firestore.collection('groups').doc(groups.value), {
          news: firestore.FieldValue.arrayUnion(docRef.id.toString())
        })
      batch.set(firestore.collection('news').doc(docRef.id), {
        title: news.title,
        content: news.content,
        groups: groups.value,
        isImportant: news.isImportant.value,
        time: news.time,
        place: news.place,
        timeStamp: firestore.FieldValue.serverTimestamp(),
        isPublic: news.isPublic.value
      })
      batch.commit().then(() => {
        dispatch({ type: 'ADD_NEWS', news: news, groups: groups });
      }).catch((err) => {
        firestore.collection('news').doc(docRef.id).delete();
        dispatch({ type: 'ADD_NEWS_ERROR', err });
      })
    })
  }
}

export const changeAddStatus = () => {
  return (dispatch) => {
    dispatch({ type: 'CHANGE_ADD_STATUS' });
  }
}

export const editNews = (news, groups, allGroups) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    var batch = firestore.batch();
    var nongroupsArr = allGroups.filter(
      function (e) {
        return this.indexOf(e) < 0;
      }, groups.value
    );
    batch.update(firestore.collection('groups').doc(groups.value), {
        news: firestore.FieldValue.arrayUnion(news.id)
      })
    nongroupsArr.map(group =>
      batch.update(firestore.collection('groups').doc(group), {
        news: firestore.FieldValue.arrayRemove(news.id)
      })
    );
    batch.update(firestore.collection('news').doc(news.id), {
      title: news.title,
      content: news.content,
      groups: groups.value,
      isImportant: news.isImportant,
      place: news.place,
      time: news.time,
      isPublic: news.isPublic.value
    });
    batch.commit()
    .then(() => {
      dispatch({ type: 'EDIT_NEWS', news: news, groups: groups });
    }).catch((err) => {
      dispatch({ type: 'EDIT_NEWS_ERROR', err });
    })
  }
}

export const changeEditStatus = () => {
  return (dispatch) => {
    dispatch({ type: 'CHANGE_EDIT_STATUS' });
  }
}
