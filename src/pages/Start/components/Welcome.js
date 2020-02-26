import React from 'react'
import {
  MdGroupWork,
  MdRedeem,
  MdDateRange,
  MdCenterFocusStrong
} from 'react-icons/md'

const Welcome = (props) => {
  return (
    <div className='welcomeIcons'>
      <div className='welcomeIconsArea'>
        <MdGroupWork className='workspaceIcon' />
        <label className='welcomeText'>Create your workspace. e.g. My Team, Project meeting</label>
      </div>
      <div className='welcomeIconsArea'>
        <MdRedeem className='workspaceIcon' />
        <label className='welcomeText'>Create the type of meeting. e.g. Status Report, Follow up</label>
      </div>
      <div className='welcomeIconsArea'>
        <MdDateRange className='workspaceIcon' />
        <label className='welcomeText'>Create the session(date) of the meeting</label>
      </div>
      <div className='welcomeIconsArea'>
        <MdCenterFocusStrong className='workspaceIcon' />
        <label className='welcomeText'>Create itens to be talked during the meeting session</label>
      </div>
    </div>
  )
}

export default Welcome
// <h3>Show Workspace + Meeting + Session + Itens (Should be a carrousel)</h3>
// <h3>On board message for the first time only</h3>
