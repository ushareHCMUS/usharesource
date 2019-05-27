import React from 'react'
import { Link } from 'react-router-dom';

const Group = ({ groups }) => {
  return (
    <li>
      {
        groups && groups.map(group => {
          return (
            <Link to={`/group/${group.id}`} style={{ textDecoration: 'none' }} className="collection-item avatar" key={group.id}>
              <img src={group.groupImage} alt="" className="circle" />
              <span className="title">{group.groupName}</span>
              <p>Members: {group.members.length} <br />{group.groupDescription}</p>
              <div className="secondary-content"><i className="material-icons">add</i></div>
            </Link>
          )
        })
      }
    </li>
  )
}

export default Group;
