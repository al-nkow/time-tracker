import React from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SendIcon from '@material-ui/icons/Send';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import RateReviewIcon from '@material-ui/icons/RateReview';
import AdbIcon from '@material-ui/icons/Adb';
import DoneIcon from '@material-ui/icons/Done';

const StyledMenuItem = styled(MenuItem)`
  &.MuiMenuItem-root {
    min-height: 34px;
    .MuiSvgIcon-root {
      color: #606686;
      width: 18px;
      height: 18px;
      margin-right: 7px;
    }
  }
`;

const StyledButton = styled(Button)`
  &.MuiButton-root {
    margin-left: 10px;
    margin-top: -3px;
    .MuiSvgIcon-root {
      vertical-align: middle;
      width: 20px;
      height: 20px;
      color: #606686;
    }
    .name {
      font-size: 12px;
      padding: 2px 0 0 5px;
    }
  }
`;

const statusList = {
  'to_do': {
    name: 'To Do',
    icon: (<PlayCircleOutlineIcon />)
  },
  'in_progress': {
    name: 'In Progress',
    icon: (<AlarmOnIcon />)
  },
  'in_review': {
    name: 'In Review',
    icon: (<RateReviewIcon />)
  },
  'in_testing': {
    name: 'In Testing',
    icon: (<AdbIcon />)
  },
  // 'ready_for_prod': {
  //   name: 'Ready for Production',
  //   icon: (<SendIcon />)
  // },
  'done': {
    name: 'Done',
    icon: (<DoneIcon />)
  }
};

const StatusSelect = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const status = props.status || 'to_do';

  const handleCloseStatus = (status) => {
    setAnchorEl(null);
    if (status) props.setStatus(status);
  };

  const handleClickStatus = event => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <span>
      <StyledButton size="small" aria-controls="status-menu" aria-haspopup="true"
              onClick={handleClickStatus}>
        { statusList[status].icon }
        <span className="name">{ statusList[status].name }</span>
      </StyledButton>
      <Menu
        id="status-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={ handleCloseStatus.bind(null, '') }
      >
        {
          Object.keys(statusList).map((key) => {
            return (
              <StyledMenuItem key={key} onClick={ () => handleCloseStatus(key) }>
                { statusList[key].icon } { statusList[key].name }
              </StyledMenuItem>
            )
          })
        }
      </Menu>
    </span>
  )
};

export default StatusSelect;