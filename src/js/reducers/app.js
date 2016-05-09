// import storage from '../modules/storage';
import _ from 'lodash';
import {handleActions} from 'redux-actions';
import {Map} from 'immutable';
import {
  APP_INITIALIZE,
  APP_SOCKET_OPEN,
  APP_SOCKET_MSG,
  APP_SOCKET_ERROR,
  APP_SHUTDOWN,
  APP_OPEN_CONTEXT_MENU,
  APP_CLOSE_CONTEXT_MENU,
  APP_MODAL_MESSAGE_OPEN,
  APP_MODAL_MESSAGE_CLOSE,
  APP_SET_DROPDOWN_ID,
  GET_STATUS_PAGE_INFO
} from '../actions/constants';

const initial = {
  socketMessages: [],
  socketError: undefined,
  ready: false,
  openContextMenu: undefined,
  dropdownId: undefined,
  modalMessage: {
    color: undefined,
    html: undefined,
    show: false
  },
  statusPageInfo: new Map()
};

export default handleActions({
  '@@reduxReactRouter/routerDidChange': {
    next(state){
      return _.assign({}, state, {
        openContextMenu: undefined
      });
    }
  },
  [APP_INITIALIZE]: {
    next(state){
      return _.assign({}, state, {ready: true});
    }
  },
  [APP_SOCKET_OPEN]: {
    next(state){
      return _.assign({}, state, {
        socketError: false
      });
    }
  },
  [APP_SOCKET_MSG]: {
    next(state, action){
      const data = _.assign({}, action.payload, {date: new Date()});
      const socketMessages = state.socketMessages.concat([data]);
      return _.assign({}, state, {socketMessages});
    }
  },
  [APP_SOCKET_ERROR]: {
    next(state){
      return _.assign({}, state, {
        socketError: true
      });
    }
  },
  [APP_SHUTDOWN]: {
    next(state){
      return _.assign({}, state, {
        socketMessages: [],
        socketError: undefined
      });
    }
  },
  [APP_OPEN_CONTEXT_MENU]: {
    next(state, action){
      return _.assign({}, state, {
        openContextMenu: action.payload
      });
    }
  },
  [APP_CLOSE_CONTEXT_MENU]: {
    next(state){
      return _.assign({}, state, {
        openContextMenu: undefined
      });
    }
  },
  [APP_MODAL_MESSAGE_OPEN]: {
    next(state, action){
      return _.assign({}, state, {
        modalMessage: _.assign({}, action.payload, {show: true})
      });
    }
  },
  [APP_MODAL_MESSAGE_CLOSE]: {
    next(state){
      const modalMessage = _.assign({}, state.modalMessage, {
        show: false
      });
      return _.assign({}, state, {modalMessage});
    }
  },
  [APP_SET_DROPDOWN_ID]: {
    next(state, action){
      return _.assign({}, state, {dropdownId: action.payload});
    }
  },
  [GET_STATUS_PAGE_INFO]: {
    next(state, action){
      // const data = action.payload;
      const data = {
        "page": {
          "id": "mdpjjlblknkm",
          "name": "Opsee",
          "url": "http://status.opsee.com",
          "updated_at": "2016-05-09T06:45:38-07:00"
        },
        "status": {
          "description": "Partial System Outage",
          "indicator": "major"
        },
        "components": [
          {
            "created_at": "2014-05-03T01:22:07.274Z",
            "description": null,
            "id": "b13yz5g2cw10",
            "name": "API",
            "page_id": "mdpjjlblknkm",
            "position": 1,
            "status": "partial_outage",
            "updated_at": "2014-05-14T20:34:43.340Z"
          },
          {
            "created_at": "2014-05-03T01:22:07.286Z",
            "description": null,
            "id": "9397cnvk62zn",
            "name": "Management Portal",
            "page_id": "mdpjjlblknkm",
            "position": 2,
            "status": "major_outage",
            "updated_at": "2014-05-14T20:34:44.470Z"
          }
        ],
        "incidents": [
          {
            "created_at": "2014-05-14T14:22:39.441-06:00",
            "id": "cp306tmzcl0y",
            "impact": "critical",
            "incident_updates": [
              {
                "body": "Our master database has ham sandwiches flying out of the rack, and we're working our hardest to stop the bleeding. The whole site is down while we restore functionality, and we'll provide another update within 30 minutes.",
                "created_at": "2014-05-14T14:22:40.301-06:00",
                "display_at": "2014-05-14T14:22:40.301-06:00",
                "id": "jdy3tw5mt5r5",
                "incident_id": "cp306tmzcl0y",
                "status": "identified",
                "updated_at": "2014-05-14T14:22:40.301-06:00"
              }
            ],
            "monitoring_at": null,
            "name": "Unplanned Database Outage",
            "page_id": "mdpjjlblknkm",
            "resolved_at": null,
            "shortlink": "http://stspg.dev:5000/Q0E",
            "status": "identified",
            "updated_at": "2014-05-14T14:35:21.711-06:00"
          }
        ],
        "scheduled_maintenances": [
          {
            "created_at": "2014-05-14T14:24:40.430-06:00",
            "id": "w1zdr745wmfy",
            "impact": "none",
            "incident_updates": [
              {
                "body": "Our data center has informed us that they will be performing routine network maintenance. No interruption in service is expected. Any issues during this maintenance should be directed to our support center",
                "created_at": "2014-05-14T14:24:41.913-06:00",
                "display_at": "2014-05-14T14:24:41.913-06:00",
                "id": "qq0vx910b3qj",
                "incident_id": "w1zdr745wmfy",
                "status": "scheduled",
                "updated_at": "2014-05-14T14:24:41.913-06:00"
              }
            ],
            "monitoring_at": null,
            "name": "Network Maintenance (No Interruption Expected)",
            "page_id": "mdpjjlblknkm",
            "resolved_at": null,
            "scheduled_for": "2014-05-17T22:00:00.000-06:00",
            "scheduled_until": "2014-05-17T23:30:00.000-06:00",
            "shortlink": "http://stspg.dev:5000/Q0F",
            "status": "scheduled",
            "updated_at": "2014-05-14T14:24:41.918-06:00"
          },
          {
            "created_at": "2014-05-14T14:27:17.303-06:00",
            "id": "k7mf5z1gz05c",
            "impact": "minor",
            "incident_updates": [
              {
                "body": "Scheduled maintenance is currently in progress. We will provide updates as necessary.",
                "created_at": "2014-05-14T14:34:20.036-06:00",
                "display_at": "2014-05-14T14:34:20.036-06:00",
                "id": "drs62w8df6fs",
                "incident_id": "k7mf5z1gz05c",
                "status": "in_progress",
                "updated_at": "2014-05-14T14:34:20.036-06:00"
              },
              {
                "body": "We will be performing rolling upgrades to our web tier with a new kernel version so that Heartbleed will stop making us lose sleep at night. Increased load and latency is expected, but the app should still function appropriately. We will provide updates every 30 minutes with progress of the reboots.",
                "created_at": "2014-05-14T14:27:18.845-06:00",
                "display_at": "2014-05-14T14:27:18.845-06:00",
                "id": "z40y7398jqxc",
                "incident_id": "k7mf5z1gz05c",
                "status": "scheduled",
                "updated_at": "2014-05-14T14:27:18.845-06:00"
              }
            ],
            "monitoring_at": null,
            "name": "Web Tier Recycle",
            "page_id": "mdpjjlblknkm",
            "resolved_at": null,
            "scheduled_for": "2014-05-14T14:30:00.000-06:00",
            "scheduled_until": "2014-05-14T16:30:00.000-06:00",
            "shortlink": "http://stspg.dev:5000/Q0G",
            "status": "in_progress",
            "updated_at": "2014-05-14T14:35:12.258-06:00"
          }
        ]
      }
      return _.assign({}, state, {statusPageInfo: new Map(data)})
    }
  }
}, initial);