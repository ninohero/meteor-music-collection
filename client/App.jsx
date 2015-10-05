App = React.createClass({
  // this is the meteor mixin that connects to Meteor-mongo, I think
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      albums: Albums.find({}, {sort: {date_added: -1}, limit: 25}).fetch(),
      currentUser: Meteor.user()
    }
  },
  getInitialState() {
    return {
      something: "some value"
    }
  },
  /*getAlbums() {
    return [
      { _id: 10001, title: "Kind of Blue", artist: "Miles Davis", media: "cd", label_year: "Columbia / '54", price: 12.00, date_acquired: new Date(9/2/2005)},
      date_added,
      rating
    ]
  },
  */
  renderAlbums() {
    // the data object is returned from getMeteorData?
    return this.data.albums.map((album) => {
      return <Album key={album._id} album={album} loggedInUser={this.data.currentUser} />;
    })
  },
  validateRequiredTextFields() {
    var title = React.findDOMNode(this.refs.titleInput).value.trim();
    var artist = React.findDOMNode(this.refs.artistInput).value.trim();

    if(title == "" || artist == "") {
      alert("all fields must be filled out.");
      return false;
    }
    return true;
  },
  /*handleKeyUp(event) {
    console.log("keycode = "+event.keyCode);

    // check for return key
    if(event.keyCode == "13") {
      var fieldCheck = this.validateRequiredTextFields();

      if(fieldCheck) {
        this.handleAddSubmit();
      }
    }
  },*/
  handleAddSubmit(event) {
    if(event.preventDefault) {
      event.preventDefault();
    } else if(event.nativeEvent){
      event.nativeEvent.defaultPrevented = true;
    }

    // check for return key
    if(event.keyCode == "13" || event.currentTarget.nodeName == "BUTTON") {
      var fieldCheck = this.validateRequiredTextFields();

      if(!fieldCheck) {
        return false;
      }
    }

    var title = React.findDOMNode(this.refs.titleInput).value.trim();
    var artist = React.findDOMNode(this.refs.artistInput).value.trim();

    Albums.insert({
      title: title,
      artist: artist,
      date_added: new Date(),
      added_by_user_id: Meteor.user().username
    })

    // clear field after value added
    React.findDOMNode(this.refs.titleInput).value = "";
    React.findDOMNode(this.refs.artistInput).value = "";
  },
  render() {
    return (
      <div className="album_holder">
        <header>
          <h1>Album Rater</h1>

          <AccountsUIWarapper />

          { this.data.currentUser ?
            <form className="new-album" onSubmit={this.handleAddSubmit}>
              <label htmlFor="title" className="cell">Enter new albums</label>
              <input type="text"
                     name="artist"
                     className="cell"
                     ref="artistInput"
                     placeholder="by artist"
                     onKeyUp={this.handleKeyUp} />
              <input type="text"
                     name="title"
                     className="cell"
                     ref="titleInput"
                     placeholder="Album title"
                     onKeyUp={this.handleKeyUp} />
              <button onClick={this.handleAddSubmit}>Submit</button>
            </form>
            : []
          }
        </header>

        <ul>
          {this.renderAlbums()}
        </ul>
      </div>
    );
  }
});
