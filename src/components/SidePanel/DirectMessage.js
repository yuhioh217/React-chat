import React from "react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";
import { Menu, Icon } from "semantic-ui-react";

class DirectMessage extends React.Component {
  state = {
    activeChannel: "",
    user: this.props.currentUser,
    users: [],
    userRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence")
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListener(this.state.user.uid);
    }
  }

  addListener = currentUserId => {
    let loadedUser = [];
    /** Create Listener for events. **/

    // user counts and save all users' status to "offline" (default value), will update the latest status later.
    this.state.userRef.on("child_added", snap => {
      if (currentUserId !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        // console.log(snap);
        loadedUser.push(user);
        this.setState({ users: loadedUser });
      }
    });

    // user connection status, and save the statue to the "presence" table
    this.state.connectedRef.on("value", snap => {
      if (snap.val() === true) {
        const ref = this.state.presenceRef.child(currentUserId);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          /**
           * remove current user data in presence when login user is disconnecting.
           * onDisconnect() =>  allows you to write or clear data when your client disconnects from the Database server
           * remove => action when disconnecting.
           * reference : https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect.html#remove
           */
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });

    this.state.presenceRef.on("child_added", snap => {
      if (currentUserId !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });

    this.state.presenceRef.on("child_removed", snap => {
      if (currentUserId !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };

  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updatedUsers });
  };

  setDirectMessageMenu = users =>
    users.length > 0 &&
    users.map(user => (
      <Menu.Item
        key={user.uid}
        active={user.uid === this.state.activeChannel}
        onClick={() => this.changeChannel(user)}
        style={{ opacity: 0.7, fontStyle: "italic" }}
      >
        <Icon name="circle" color={this.isUserOnline(user) ? "green" : "red"} />
        @ {user.name}
      </Menu.Item>
    ));

  isUserOnline = user => user.status === "online";

  changeChannel = user => {
    const channelId = this.getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name
    };
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
    this.setActiveChannel(user.uid);
  };

  setActiveChannel = userId => {
    this.setState({ activeChannel: userId });
  };

  getChannelId = userId => {
    const currentUserId = this.state.user.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  render() {
    const { users } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGE
          </span>{" "}
          ({users.length})
        </Menu.Item>
        {/* Users to send Direct Message */}
        {this.setDirectMessageMenu(users)}
      </Menu.Menu>
    );
  }
}

export default connect(
  null,
  { setCurrentChannel, setPrivateChannel }
)(DirectMessage);
